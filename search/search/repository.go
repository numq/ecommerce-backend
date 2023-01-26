package search

import (
	"bytes"
	"context"
	"encoding/json"
	"github.com/elastic/go-elasticsearch/v8"
	"strings"
)

type Repository interface {
	Search(ctx context.Context, query string) ([]*Item, error)
	Insert(ctx context.Context, item Item) (*string, error)
	Update(ctx context.Context, item Item) (*string, error)
	Remove(ctx context.Context, id string) (*string, error)
}

type RepositoryImpl struct {
	client *elasticsearch.Client
}

func NewRepository(client *elasticsearch.Client) Repository {
	return RepositoryImpl{client}
}

func (r RepositoryImpl) Search(ctx context.Context, query string) ([]*Item, error) {
	result, err := r.client.Search(
		r.client.Search.WithContext(ctx),
		r.client.Search.WithIndex("catalog"),
		r.client.Search.WithQuery(query),
		r.client.Search.WithSort("_score"),
	)
	if err != nil {
		return nil, err
	}
	defer result.Body.Close()
	var response map[string]interface{}
	if err = json.NewDecoder(result.Body).Decode(&response); err != nil {
		return nil, err
	}
	hits := response["hits"].(map[string]interface{})["hits"].([]interface{})
	var items []*Item
	for _, hit := range hits {
		i, err := json.Marshal(hit.(map[string]interface{})["_source"].(map[string]interface{}))
		if err != nil {
			return nil, err
		}
		var item *Item
		if err := json.Unmarshal(i, &item); err != nil {
			return nil, err
		}
		if item != nil {
			items = append(items, item)
		}
	}
	if len(items) > 0 {
		return items, nil
	}
	return nil, nil
}

func (r RepositoryImpl) Insert(ctx context.Context, item Item) (*string, error) {
	body, err := json.Marshal(item)
	if err != nil {
		return nil, err
	}
	if _, err := r.client.Index(
		"catalog",
		bytes.NewReader(body),
		r.client.Index.WithContext(ctx),
		r.client.Index.WithDocumentID(item.Id),
	); err != nil {
		return nil, err
	}
	return &item.Id, nil
}

func (r RepositoryImpl) Update(ctx context.Context, item Item) (*string, error) {
	body, err := json.Marshal(item)
	if err != nil {
		return nil, err
	}
	if _, err := r.client.Update(
		"catalog",
		item.Id,
		strings.NewReader(string(body)),
		r.client.Update.WithContext(ctx),
	); err != nil {
		return nil, err
	}
	return &item.Id, nil
}

func (r RepositoryImpl) Remove(ctx context.Context, id string) (*string, error) {
	if _, err := r.client.Delete("catalog", id, r.client.Delete.WithContext(ctx)); err != nil {
		return nil, err
	}
	return &id, nil
}
