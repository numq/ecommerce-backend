package token

import (
	"context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	pb "token/generated"
)

type ServiceImpl struct {
	pb.UnimplementedTokenServiceServer
	useCase UseCase
}

func NewService(useCase UseCase) pb.TokenServiceServer {
	return &ServiceImpl{useCase: useCase}
}

func (s *ServiceImpl) GenerateToken(ctx context.Context, request *pb.GenerateTokenRequest) (*pb.GenerateTokenResponse, error) {
	reqPayload := request.GetPayload()
	if reqPayload == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	tokenPair, err := s.useCase.GenerateTokenPair(ctx, reqPayload)
	if err != nil {
		return nil, err
	}
	return &pb.GenerateTokenResponse{AccessToken: tokenPair.AccessToken, RefreshToken: tokenPair.RefreshToken}, nil
}

func (s *ServiceImpl) VerifyToken(ctx context.Context, request *pb.VerifyTokenRequest) (*pb.VerifyTokenResponse, error) {
	reqAccessToken := request.GetToken()
	if reqAccessToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	claims, err := s.useCase.VerifyToken(ctx, reqAccessToken)
	if err != nil {
		return nil, err
	}
	return &pb.VerifyTokenResponse{Payload: claims.Payload}, nil
}
func (s *ServiceImpl) RevokeToken(ctx context.Context, request *pb.RevokeTokenRequest) (*pb.RevokeTokenResponse, error) {
	reqToken := request.GetToken()
	if reqToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	if _, err := s.useCase.RevokeToken(ctx, reqToken); err != nil {
		return nil, err
	}
	return &pb.RevokeTokenResponse{Token: reqToken}, nil
}
