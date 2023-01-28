package account

import (
	pb "authentication/generated"
	"context"
)

type Repository interface {
	CreateAccount(ctx context.Context, phoneNumber string, role Role) (*string, error)
	GetAccountById(ctx context.Context, id string) (*Account, error)
	GetAccountByPhoneNumber(ctx context.Context, phoneNumber string) (*Account, error)
	UpdateAccount(ctx context.Context, account Account) (*Account, error)
	RemoveAccount(ctx context.Context, id string) (*string, error)
}

type RepositoryImpl struct {
	service pb.AccountServiceClient
	mapper  Mapper
}

func NewRepository(service pb.AccountServiceClient, mapper Mapper) Repository {
	return &RepositoryImpl{service: service, mapper: mapper}
}

func (r *RepositoryImpl) CreateAccount(ctx context.Context, phoneNumber string, role Role) (*string, error) {
	response, err := r.service.CreateAccount(ctx, &pb.CreateAccountRequest{PhoneNumber: phoneNumber, Role: pb.Role(role)})
	if err != nil {
		return nil, err
	}
	return &response.Id, err
}

func (r *RepositoryImpl) GetAccountById(ctx context.Context, id string) (*Account, error) {
	response, err := r.service.GetAccountById(ctx, &pb.GetAccountByIdRequest{Id: id})
	if err != nil {
		return nil, err
	}
	return r.mapper.MessageToEntity(response.GetAccount()), nil
}

func (r *RepositoryImpl) GetAccountByPhoneNumber(ctx context.Context, phoneNumber string) (*Account, error) {
	response, err := r.service.GetAccountByPhoneNumber(ctx, &pb.GetAccountByPhoneNumberRequest{PhoneNumber: phoneNumber})
	if err != nil {
		return nil, err
	}
	return r.mapper.MessageToEntity(response.GetAccount()), nil
}

func (r *RepositoryImpl) UpdateAccount(ctx context.Context, account Account) (*Account, error) {
	response, err := r.service.UpdateAccount(ctx, &pb.UpdateAccountRequest{Account: r.mapper.EntityToMessage(&account)})
	if err != nil {
		return nil, err
	}
	return r.mapper.MessageToEntity(response.GetAccount()), nil
}

func (r *RepositoryImpl) RemoveAccount(ctx context.Context, id string) (*string, error) {
	response, err := r.service.RemoveAccount(ctx, &pb.RemoveAccountRequest{Id: id})
	if err != nil {
		return nil, err
	}
	return &response.Id, err
}
