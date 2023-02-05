package authentication

import (
	pb "authentication/generated"
	"authentication/token"
	"context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

type ServiceImpl struct {
	pb.UnimplementedAuthenticationServiceServer
	useCase UseCase
	md      metadata.MD
}

func NewService(useCase UseCase, md metadata.MD) pb.AuthenticationServiceServer {
	return &ServiceImpl{useCase: useCase, md: md}
}

func (s *ServiceImpl) SignInByPhoneNumber(ctx context.Context, request *pb.SignInByPhoneNumberRequest) (*pb.SignInByPhoneNumberResponse, error) {
	reqPhoneNumber := request.GetPhoneNumber()
	if reqPhoneNumber == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	retryAt, err := s.useCase.SignInByPhoneNumber(metadata.NewOutgoingContext(ctx, s.md), reqPhoneNumber)
	if err != nil {
		return nil, err
	}
	return &pb.SignInByPhoneNumberResponse{RetryAt: *retryAt}, nil
}

func (s *ServiceImpl) ConfirmPhoneNumber(ctx context.Context, request *pb.ConfirmPhoneNumberRequest) (*pb.ConfirmPhoneNumberResponse, error) {
	reqPhoneNumber := request.GetPhoneNumber()
	if reqPhoneNumber == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	reqConfirmationCode := request.GetConfirmationCode()
	if reqConfirmationCode == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	tokenPair, err := s.useCase.SendConfirmationCode(metadata.NewOutgoingContext(ctx, s.md), reqPhoneNumber, reqConfirmationCode)
	if err != nil {
		return nil, err
	}
	return &pb.ConfirmPhoneNumberResponse{AccessToken: tokenPair.AccessToken, RefreshToken: tokenPair.RefreshToken}, nil
}

func (s *ServiceImpl) SignOut(ctx context.Context, request *pb.SignOutRequest) (*pb.SignOutResponse, error) {
	reqAccessToken := request.GetRefreshToken()
	reqRefreshToken := request.GetRefreshToken()
	if reqRefreshToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	if _, err := s.useCase.SignOut(metadata.NewOutgoingContext(ctx, s.md), &token.Pair{AccessToken: reqAccessToken, RefreshToken: reqRefreshToken}); err != nil {
		return nil, err
	}
	return &pb.SignOutResponse{}, nil
}

func (s *ServiceImpl) RefreshToken(ctx context.Context, request *pb.RefreshTokenRequest) (*pb.RefreshTokenResponse, error) {
	reqAccessToken := request.GetAccessToken()
	if reqAccessToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	reqRefreshToken := request.GetAccessToken()
	if reqRefreshToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	tokenPair, err := s.useCase.RefreshToken(metadata.NewOutgoingContext(ctx, s.md), &token.Pair{
		AccessToken:  reqAccessToken,
		RefreshToken: reqRefreshToken,
	})
	if err != nil {
		return nil, err
	}
	return &pb.RefreshTokenResponse{AccessToken: tokenPair.AccessToken, RefreshToken: tokenPair.RefreshToken}, nil
}

func (s *ServiceImpl) VerifyAccess(ctx context.Context, request *pb.VerifyAccessRequest) (*pb.VerifyAccessResponse, error) {
	reqAccessToken := request.GetAccessToken()
	if reqAccessToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	id, err := s.useCase.VerifyAccess(metadata.NewOutgoingContext(ctx, s.md), reqAccessToken)
	if err != nil {
		return nil, err
	}
	return &pb.VerifyAccessResponse{Id: *id}, nil
}
