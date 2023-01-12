package authentication

import (
	pb "authentication/generated"
	"authentication/token"
	"context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type ServiceImpl struct {
	pb.UnimplementedAuthenticationServiceServer
	useCase UseCase
}

func NewService(useCase UseCase) pb.AuthenticationServiceServer {
	return ServiceImpl{useCase: useCase}
}

func (s ServiceImpl) SignInByPhoneNumber(ctx context.Context, request *pb.SignInByPhoneNumberRequest) (*pb.SignInByPhoneNumberResponse, error) {
	reqPhoneNumber := request.GetPhoneNumber()
	if reqPhoneNumber == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}

	return nil, status.Errorf(codes.Unimplemented, "method SignInByPhoneNumber not implemented")
}

func (s ServiceImpl) SignOut(ctx context.Context, request *pb.SignOutRequest) (*pb.SignOutResponse, error) {
	reqAccessToken := request.GetRefreshToken()
	reqRefreshToken := request.GetRefreshToken()
	if reqRefreshToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	if _, err := s.useCase.SignOut(ctx, &token.Pair{AccessToken: reqAccessToken, RefreshToken: reqRefreshToken}); err != nil {
		return nil, err
	}
	return &pb.SignOutResponse{}, nil
}

func (s ServiceImpl) RefreshToken(ctx context.Context, request *pb.RefreshTokenRequest) (*pb.RefreshTokenResponse, error) {
	reqAccessToken := request.GetAccessToken()
	if reqAccessToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	reqRefreshToken := request.GetAccessToken()
	if reqRefreshToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	tokenPair, err := s.useCase.RefreshToken(ctx, &token.Pair{
		AccessToken:  reqAccessToken,
		RefreshToken: reqRefreshToken,
	})
	if err != nil {
		return nil, err
	}
	return &pb.RefreshTokenResponse{AccessToken: tokenPair.AccessToken, RefreshToken: tokenPair.RefreshToken}, nil
}

func (s ServiceImpl) VerifyAccess(ctx context.Context, request *pb.VerifyAccessRequest) (*pb.VerifyAccessResponse, error) {
	reqAccessToken := request.GetAccessToken()
	if reqAccessToken == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	payload, err := s.useCase.VerifyAccess(ctx, reqAccessToken)
	if err != nil {
		return nil, err
	}
	return &pb.VerifyAccessResponse{Payload: *payload}, nil
}
