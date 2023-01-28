package token

import (
	pb "authentication/generated"
	"context"
)

type Repository interface {
	GenerateToken(ctx context.Context, payload string) (*Pair, error)
	VerifyToken(ctx context.Context, token string) (*string, error)
	RevokeToken(ctx context.Context, token string) (*string, error)
}

type RepositoryImpl struct {
	service pb.TokenServiceClient
}

func NewRepository(service pb.TokenServiceClient) Repository {
	return &RepositoryImpl{service: service}
}

func (r *RepositoryImpl) GenerateToken(ctx context.Context, payload string) (*Pair, error) {
	response, err := r.service.GenerateToken(ctx, &pb.GenerateTokenRequest{Payload: payload})
	if err != nil {
		return nil, err
	}
	return &Pair{AccessToken: response.GetAccessToken(), RefreshToken: response.GetRefreshToken()}, err
}

func (r *RepositoryImpl) VerifyToken(ctx context.Context, token string) (*string, error) {
	response, err := r.service.VerifyToken(ctx, &pb.VerifyTokenRequest{Token: token})
	if err != nil {
		return nil, err
	}
	return &response.Payload, err
}

func (r *RepositoryImpl) RevokeToken(ctx context.Context, token string) (*string, error) {
	response, err := r.service.RevokeToken(ctx, &pb.RevokeTokenRequest{Token: token})
	if err != nil {
		return nil, err
	}
	return &response.Token, err
}
