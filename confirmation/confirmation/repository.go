package confirmation

import (
	"context"
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
		return nil, NotYetTime
	}
	retryAt := time.Now().Add(time.Second * 90)
	confirmationCode := "0000" // Generate and send confirmation code using external API
	err := r.client.Set(ctx, phoneNumber, confirmationCode, time.Until(retryAt)).Err()
	if err != nil {
		return nil, err
	}
	timestamp := retryAt.UnixMilli()
	return &timestamp, nil
}

func (r *RepositoryImpl) VerifyPhoneNumberConfirmation(ctx context.Context, phoneNumber string, confirmationCode string) (*string, error) {
	if confirmationCode == r.client.Get(ctx, phoneNumber).Val() {
		err := r.client.Del(ctx, phoneNumber).Err()
		if err != nil {
			return nil, err
		}
		return &phoneNumber, nil
	}
	return nil, WrongConfirmationCode
}
