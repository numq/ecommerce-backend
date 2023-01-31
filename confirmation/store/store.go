package store

import (
	"context"
	"github.com/go-redis/redis/v9"
	"log"
)

func NewClient(ctx context.Context, address string) *redis.Client {
	client := redis.NewClient(&redis.Options{Addr: address})
	if _, err := client.Ping(ctx).Result(); err != nil {
		log.Fatal(err)
	}
	log.Printf("Connected to store: %s", address)
	return client
}
