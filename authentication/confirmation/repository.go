package confirmation

import (
	pb "authentication/generated"
	"context"
)

type Repository interface {
	SendPhoneNumberConfirmation(ctx context.Context, phoneNumber string) (*int64, error)
	VerifyPhoneNumberConfirmation(ctx context.Context, phoneNumber string, confirmationCode string) (*string, error)
}

type RepositoryImpl struct {
	client pb.ConfirmationServiceClient
}

func NewRepository(client pb.ConfirmationServiceClient) Repository {
	return &RepositoryImpl{client: client}
}

func (r *RepositoryImpl) SendPhoneNumberConfirmation(ctx context.Context, phoneNumber string) (*int64, error) {
	response, err := r.client.SendPhoneNumberConfirmation(ctx, &pb.SendPhoneNumberConfirmationRequest{PhoneNumber: phoneNumber})
	if err != nil {
		return nil, err
	}
	return &response.RetryAt, err
}

func (r *RepositoryImpl) VerifyPhoneNumberConfirmation(ctx context.Context, phoneNumber string, confirmationCode string) (*string, error) {
	response, err := r.client.VerifyPhoneNumberConfirmation(ctx, &pb.VerifyPhoneNumberConfirmationRequest{PhoneNumber: phoneNumber, ConfirmationCode: confirmationCode})
	if err != nil {
		return nil, err
	}
	return &response.PhoneNumber, err
}
