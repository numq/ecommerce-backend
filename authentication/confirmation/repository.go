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
	service pb.ConfirmationServiceClient
}

func NewRepository(service pb.ConfirmationServiceClient) Repository {
	return &RepositoryImpl{service: service}
}

func (r *RepositoryImpl) SendPhoneNumberConfirmation(ctx context.Context, phoneNumber string) (*int64, error) {
	response, err := r.service.SendPhoneNumberConfirmation(ctx, &pb.SendPhoneNumberConfirmationRequest{PhoneNumber: phoneNumber})
	if err != nil {
		return nil, err
	}
	return &response.RetryAt, err
}

func (r *RepositoryImpl) VerifyPhoneNumberConfirmation(ctx context.Context, phoneNumber string, confirmationCode string) (*string, error) {
	response, err := r.service.VerifyPhoneNumberConfirmation(ctx, &pb.VerifyPhoneNumberConfirmationRequest{PhoneNumber: phoneNumber, ConfirmationCode: confirmationCode})
	if err != nil {
		return nil, err
	}
	return &response.PhoneNumber, err
}
