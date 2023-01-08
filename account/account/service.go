package account

import (
	"account/fn"
	pb "account/generated"
	"context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type ServiceImpl struct {
	pb.UnimplementedAccountServiceServer
	useCase UseCase
	mapper  Mapper
}

func NewService(useCase UseCase, mapper Mapper) pb.AccountServiceServer {
	return ServiceImpl{useCase: useCase, mapper: mapper}
}

func (s ServiceImpl) CreateAccount(ctx context.Context, request *pb.CreateAccountRequest) (*pb.CreateAccountResponse, error) {
	reqPhoneNumber := request.GetPhoneNumber()
	if reqPhoneNumber == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	reqRole := request.GetRole()
	if reqRole.String() == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	id, err := s.useCase.CreateAccount(ctx, reqPhoneNumber, Role(reqRole))
	if err != nil {
		return nil, err
	}
	return &pb.CreateAccountResponse{Id: *id}, nil
}

func (s ServiceImpl) GetAccountById(ctx context.Context, request *pb.GetAccountByIdRequest) (*pb.GetAccountByIdResponse, error) {
	reqId := request.GetId()
	if reqId == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	account, err := s.useCase.GetAccountById(ctx, reqId)
	if err != nil {
		return nil, err
	}
	return &pb.GetAccountByIdResponse{Account: s.mapper.EntityToMessage(account)}, nil
}

func (s ServiceImpl) GetAccountByPhoneNumber(ctx context.Context, request *pb.GetAccountByPhoneNumberRequest) (*pb.GetAccountByPhoneNumberResponse, error) {
	reqPhoneNumber := request.GetPhoneNumber()
	if reqPhoneNumber == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	account, err := s.useCase.GetAccountByPhoneNumber(ctx, reqPhoneNumber)
	if err != nil {
		return nil, err
	}
	return &pb.GetAccountByPhoneNumberResponse{Account: s.mapper.EntityToMessage(account)}, nil
}

func (s ServiceImpl) GetAccountsByRole(ctx context.Context, request *pb.GetAccountsByRoleRequest) (*pb.GetAccountsByRoleResponse, error) {
	accounts, err := s.useCase.GetAccountsByRole(ctx, Role(request.GetRole()), request.GetSkip(), request.GetLimit())
	if err != nil {
		return nil, err
	}
	return &pb.GetAccountsByRoleResponse{Accounts: fn.Map(accounts, s.mapper.EntityToMessage)}, nil
}

func (s ServiceImpl) GetAccountsByStatus(ctx context.Context, request *pb.GetAccountsByStatusRequest) (*pb.GetAccountsByStatusResponse, error) {
	accounts, err := s.useCase.GetAccountsByStatus(ctx, Status(request.GetStatus()), request.GetSkip(), request.GetLimit())
	if err != nil {
		return nil, err
	}
	return &pb.GetAccountsByStatusResponse{Accounts: fn.Map(accounts, s.mapper.EntityToMessage)}, nil
}

func (s ServiceImpl) UpdateAccount(ctx context.Context, request *pb.UpdateAccountRequest) (*pb.UpdateAccountResponse, error) {
	reqAccount := request.GetAccount()
	if reqAccount.GetId() == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	account, err := s.useCase.UpdateAccount(ctx, s.mapper.MessageToEntity(reqAccount))
	if err != nil {
		return nil, err
	}
	return &pb.UpdateAccountResponse{Account: s.mapper.EntityToMessage(account)}, nil
}

func (s ServiceImpl) RemoveAccount(ctx context.Context, request *pb.RemoveAccountRequest) (*pb.RemoveAccountResponse, error) {
	reqId := request.GetId()
	if reqId == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	id, err := s.useCase.RemoveAccount(ctx, reqId)
	if err != nil {
		return nil, err
	}
	return &pb.RemoveAccountResponse{Id: *id}, nil
}
