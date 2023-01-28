package confirmation

import (
	pb "confirmation/generated"
	"context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type ServiceImpl struct {
	pb.UnimplementedConfirmationServiceServer
	useCase UseCase
}

func NewService(useCase UseCase) pb.ConfirmationServiceServer {
	return &ServiceImpl{useCase: useCase}
}

func (s *ServiceImpl) SendPhoneNumberConfirmation(ctx context.Context, request *pb.SendPhoneNumberConfirmationRequest) (*pb.SendPhoneNumberConfirmationResponse, error) {
	reqPhoneNumber := request.GetPhoneNumber()
	if reqPhoneNumber == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	retryAt, err := s.useCase.SendPhoneNumberConfirmation(ctx, reqPhoneNumber)
	if err != nil {
		return nil, err
	}
	return &pb.SendPhoneNumberConfirmationResponse{RetryAt: *retryAt}, nil
}
func (s *ServiceImpl) VerifyPhoneNumberConfirmation(ctx context.Context, request *pb.VerifyPhoneNumberConfirmationRequest) (*pb.VerifyPhoneNumberConfirmationResponse, error) {
	reqPhoneNumber := request.GetPhoneNumber()
	reqConfirmationCode := request.GetConfirmationCode()
	if reqPhoneNumber == "" || reqConfirmationCode == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	phoneNumber, err := s.useCase.VerifyPhoneNumberConfirmation(ctx, reqPhoneNumber, reqConfirmationCode)
	if err != nil {
		return nil, err
	}
	return &pb.VerifyPhoneNumberConfirmationResponse{PhoneNumber: *phoneNumber}, nil
}
