package account

import "context"

type UseCase interface {
	CreateAccount(ctx context.Context, phoneNumber string, role Role) (*string, error)
	GetAccountById(ctx context.Context, id string) (*Account, error)
	GetAccountByPhoneNumber(ctx context.Context, phoneNumber string) (*Account, error)
	GetAccountsByRole(ctx context.Context, role Role, skip int64, limit int64) ([]*Account, error)
	GetAccountsByStatus(ctx context.Context, status Status, skip int64, limit int64) ([]*Account, error)
	UpdateAccount(ctx context.Context, account *Account) (*Account, error)
	RemoveAccount(ctx context.Context, id string) (*string, error)
}

type UseCaseImpl struct {
	repository Repository
}

func NewUseCase(repository Repository) UseCase {
	return UseCaseImpl{repository: repository}
}

func (u UseCaseImpl) CreateAccount(ctx context.Context, phoneNumber string, role Role) (*string, error) {
	return u.repository.CreateAccount(ctx, phoneNumber, role)
}

func (u UseCaseImpl) GetAccountById(ctx context.Context, id string) (*Account, error) {
	return u.repository.GetAccountById(ctx, id)
}

func (u UseCaseImpl) GetAccountByPhoneNumber(ctx context.Context, phoneNumber string) (*Account, error) {
	return u.repository.GetAccountByPhoneNumber(ctx, phoneNumber)
}

func (u UseCaseImpl) GetAccountsByRole(ctx context.Context, role Role, skip int64, limit int64) ([]*Account, error) {
	return u.repository.GetAccountsByRole(ctx, role, skip, limit)
}

func (u UseCaseImpl) GetAccountsByStatus(ctx context.Context, status Status, skip int64, limit int64) ([]*Account, error) {
	return u.repository.GetAccountsByStatus(ctx, status, skip, limit)
}

func (u UseCaseImpl) UpdateAccount(ctx context.Context, account *Account) (*Account, error) {
	return u.repository.UpdateAccount(ctx, account)
}

func (u UseCaseImpl) RemoveAccount(ctx context.Context, id string) (*string, error) {
	return u.repository.RemoveAccount(ctx, id)
}
