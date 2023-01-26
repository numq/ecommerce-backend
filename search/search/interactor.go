package search

import (
	"context"
)

type UseCase interface {
	Search(ctx context.Context, query string) ([]*Item, error)
	Insert(ctx context.Context, item Item) (*string, error)
	Update(ctx context.Context, item Item) (*string, error)
	Remove(ctx context.Context, id string) (*string, error)
}

type UseCaseImpl struct {
	repository Repository
}

func NewUseCase(repository Repository) UseCase {
	return UseCaseImpl{repository}
}

func (u UseCaseImpl) Search(ctx context.Context, query string) ([]*Item, error) {
	return u.repository.Search(ctx, query)
}

func (u UseCaseImpl) Insert(ctx context.Context, item Item) (*string, error) {
	return u.repository.Insert(ctx, item)
}

func (u UseCaseImpl) Update(ctx context.Context, item Item) (*string, error) {
	return u.repository.Update(ctx, item)
}

func (u UseCaseImpl) Remove(ctx context.Context, id string) (*string, error) {
	return u.repository.Remove(ctx, id)
}
