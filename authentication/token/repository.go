package token

import (
	pb "authentication/generated"
	"context"
)

type Repository interface {
	GenerateToken(ctx context.Context, id string) (*Pair, error)
	VerifyToken(ctx context.Context, token string) (*string, error)
	RevokeToken(ctx context.Context, token string) (*string, error)
}

type RepositoryImpl struct {
	client pb.TokenServiceClient
}

func NewRepository(client pb.TokenServiceClient) Repository {
	return &RepositoryImpl{client: client}
}

func (r *RepositoryImpl) GenerateToken(ctx context.Context, id string) (*Pair, error) {
	response, err := r.client.GenerateToken(ctx, &pb.GenerateTokenRequest{Id: id})
	if err != nil {
		return nil, err
	}
	return &Pair{AccessToken: response.GetAccessToken(), RefreshToken: response.GetRefreshToken()}, err
}

func (r *RepositoryImpl) VerifyToken(ctx context.Context, token string) (*string, error) {
	response, err := r.client.VerifyToken(ctx, &pb.VerifyTokenRequest{Token: token})
	if err != nil {
		return nil, err
	}
	return &response.Id, err
}

func (r *RepositoryImpl) RevokeToken(ctx context.Context, token string) (*string, error) {
	response, err := r.client.RevokeToken(ctx, &pb.RevokeTokenRequest{Token: token})
	if err != nil {
		return nil, err
	}
	return &response.Token, err
}
