package account

import (
	"context"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"time"
)

type Repository interface {
	CreateAccount(ctx context.Context, phoneNumber string, role Role) (*string, error)
	GetAccountById(ctx context.Context, id string) (*Account, error)
	GetAccountByPhoneNumber(ctx context.Context, phoneNumber string) (*Account, error)
	GetAccountsByRole(ctx context.Context, role Role, skip int64, limit int64) ([]*Account, error)
	GetAccountsByStatus(ctx context.Context, status Status, skip int64, limit int64) ([]*Account, error)
	UpdateAccount(ctx context.Context, account *Account) (*Account, error)
	RemoveAccount(ctx context.Context, id string) (*string, error)
}

type RepositoryImpl struct {
	collection *mongo.Collection
}

func NewRepository(collection *mongo.Collection) Repository {
	return &RepositoryImpl{collection: collection}
}

func (r *RepositoryImpl) CreateAccount(ctx context.Context, phoneNumber string, role Role) (*string, error) {
	id := primitive.NewObjectID().Hex()
	if _, err := r.collection.InsertOne(ctx, Account{
		id,
		phoneNumber,
		role,
		PendingConfirmation,
		time.Now().UnixMilli(),
	}); err != nil {
		return nil, err
	}
	return &id, nil
}

func (r *RepositoryImpl) GetAccountById(ctx context.Context, id string) (*Account, error) {
	var result *Account
	if err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&result); err != nil {
		if err != mongo.ErrNoDocuments {
			return nil, err
		}
	}
	return result, nil
}

func (r *RepositoryImpl) GetAccountByPhoneNumber(ctx context.Context, phoneNumber string) (*Account, error) {
	var result *Account
	if err := r.collection.FindOne(ctx, bson.M{"phoneNumber": phoneNumber}).Decode(&result); err != nil {
		if err != mongo.ErrNoDocuments {
			return nil, err
		}
	}
	return result, nil
}

func (r *RepositoryImpl) GetAccountsByRole(ctx context.Context, role Role, skip int64, limit int64) ([]*Account, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"role": role}, &options.FindOptions{Skip: &skip, Limit: &limit})
	defer cursor.Close(ctx)
	if err != nil {
		return nil, err
	}
	var result []*Account
	if err = cursor.All(ctx, &result); err != nil {
		if err != mongo.ErrNoDocuments {
			return nil, err
		}
	}
	return result, nil
}

func (r *RepositoryImpl) GetAccountsByStatus(ctx context.Context, status Status, skip int64, limit int64) ([]*Account, error) {
	cursor, err := r.collection.Find(ctx, bson.M{"status": status}, &options.FindOptions{Skip: &skip, Limit: &limit})
	defer cursor.Close(ctx)
	if err != nil {
		return nil, err
	}
	var result []*Account
	if err = cursor.All(ctx, &result); err != nil {
		if err != mongo.ErrNoDocuments {
			return nil, err
		}
	}
	return result, nil
}

func (r *RepositoryImpl) UpdateAccount(ctx context.Context, account *Account) (*Account, error) {
	after := options.After
	opts := options.FindOneAndUpdateOptions{ReturnDocument: &after}
	var result *Account
	if err := r.collection.FindOneAndUpdate(ctx, bson.M{"_id": account.Id}, bson.M{"$set": bson.M{"role": account.Role, "status": account.Status}}, &opts).Decode(&result); err != nil {
		if err != mongo.ErrNoDocuments {
			return nil, err
		}
	}
	return result, nil
}

func (r *RepositoryImpl) RemoveAccount(ctx context.Context, id string) (*string, error) {
	if _, err := r.collection.DeleteOne(ctx, bson.M{"_id": id}); err != nil {
		return nil, err
	}
	return &id, nil
}
