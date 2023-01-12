package authentication

import (
	"go.mongodb.org/mongo-driver/mongo"
)

type Repository interface {
}

type RepositoryImpl struct {
	collection *mongo.Collection
}

func NewRepository(collection *mongo.Collection) Repository {
	return RepositoryImpl{collection: collection}
}
