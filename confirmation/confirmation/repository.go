package confirmation

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v9"
	"time"
)

type Repository interface {
	SendPhoneNumberConfirmation(ctx context.Context, phoneNumber string) (*int64, error)
	VerifyPhoneNumberConfirmation(ctx context.Context, phoneNumber string, confirmationCode string) (*string, error)
}

type RepositoryImpl struct {
	client *redis.Client
}

func NewRepository(client *redis.Client) Repository {
	return &RepositoryImpl{client: client}
}

func (r *RepositoryImpl) SendPhoneNumberConfirmation(ctx context.Context, phoneNumber string) (*int64, error) {
	if r.client.Exists(ctx, phoneNumber).Val() != 0 {
		return nil, fmt.Errorf("not yet time")
	}
	retryAt := time.Now().Add(time.Second * 90)
	confirmationCode := "0000" // Generate and send confirmation code using external API
	r.client.Set(ctx, phoneNumber, confirmationCode, time.Until(retryAt))
	timestamp := retryAt.UnixMilli()
	return &timestamp, nil
}

func (r *RepositoryImpl) VerifyPhoneNumberConfirmation(ctx context.Context, phoneNumber string, confirmationCode string) (*string, error) {
	if confirmationCode == r.client.Get(ctx, phoneNumber).Val() {
		r.client.Del(ctx, phoneNumber)
		return &phoneNumber, nil
	}
	return nil, fmt.Errorf("wrong confirmation code")
}
