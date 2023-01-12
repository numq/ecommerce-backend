package database

import (
	"context"
	"fmt"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
	"log"
)

type Database struct {
	context context.Context
	address string
	client  *mongo.Client
	db      *mongo.Database
}

func Connect(ctx context.Context, address string) *Database {
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(address))
	if err != nil {
		log.Fatal(err)
	}
	if err := client.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Connected to database: %s\n", address)
	return &Database{
		context: ctx,
		address: address,
		client:  client,
	}
}

func (d Database) Disconnect() {
	if err := d.client.Disconnect(d.context); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Disconnected to database: %s\n", d.address)
}

func (d Database) Collection(dbName string, collectionName string) *mongo.Collection {
	return d.client.Database(dbName).Collection(collectionName)
}
