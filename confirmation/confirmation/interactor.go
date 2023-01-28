package confirmation

import "context"

type UseCase interface {
	SendPhoneNumberConfirmation(ctx context.Context, phoneNumber string) (*int64, error)
	VerifyPhoneNumberConfirmation(ctx context.Context, phoneNumber string, confirmationCode string) (*string, error)
}

type UseCaseImpl struct {
	repository Repository
}

func NewUseCase(repository Repository) UseCase {
	return &UseCaseImpl{repository: repository}
}

func (u *UseCaseImpl) SendPhoneNumberConfirmation(ctx context.Context, phoneNumber string) (*int64, error) {
	return u.repository.SendPhoneNumberConfirmation(ctx, phoneNumber)
}

func (u *UseCaseImpl) VerifyPhoneNumberConfirmation(ctx context.Context, phoneNumber string, confirmationCode string) (*string, error) {
	return u.repository.VerifyPhoneNumberConfirmation(ctx, phoneNumber, confirmationCode)
}
