package authentication

import (
	"authentication/account"
	"authentication/confirmation"
	"authentication/token"
	"context"
	"encoding/json"
)

type UseCase interface {
	SendConfirmationCode(ctx context.Context, phoneNumber string, confirmationCode string) (*token.Pair, error)
	SignInByPhoneNumber(ctx context.Context, phoneNumber string) (*int64, error)
	SignOut(ctx context.Context, tokens *token.Pair) (*string, error)
	RefreshToken(ctx context.Context, tokens *token.Pair) (*token.Pair, error)
	VerifyAccess(ctx context.Context, accessToken string) (*string, error)
}

type UseCaseImpl struct {
	accountRepository      account.Repository
	confirmationRepository confirmation.Repository
	tokenRepository        token.Repository
}

func NewUseCase(accountRepository account.Repository, confirmationRepository confirmation.Repository, tokenRepository token.Repository) UseCase {
	return &UseCaseImpl{accountRepository: accountRepository, confirmationRepository: confirmationRepository, tokenRepository: tokenRepository}
}

func (u *UseCaseImpl) SendConfirmationCode(ctx context.Context, phoneNumber string, confirmationCode string) (*token.Pair, error) {
	if _, err := u.confirmationRepository.VerifyPhoneNumberConfirmation(ctx, phoneNumber, confirmationCode); err != nil {
		return nil, err
	}
	acc, err := u.accountRepository.GetAccountByPhoneNumber(ctx, phoneNumber)
	if err != nil {
		return nil, err
	}
	acc, err = u.accountRepository.UpdateAccount(ctx, account.Account{
		Id:          acc.Id,
		PhoneNumber: acc.PhoneNumber,
		Role:        acc.Role,
		Status:      account.Active,
		CreatedAt:   acc.CreatedAt,
	})
	if err != nil {
		return nil, err
	}
	payload, err := json.Marshal(&acc)
	if err != nil {
		return nil, err
	}
	return u.tokenRepository.GenerateToken(ctx, string(payload))
}

func (u *UseCaseImpl) SignInByPhoneNumber(ctx context.Context, phoneNumber string) (*int64, error) {
	acc, err := u.accountRepository.GetAccountByPhoneNumber(ctx, phoneNumber)
	if err != nil {
		return nil, err
	}
	if acc == nil {
		if _, err := u.accountRepository.CreateAccount(ctx, phoneNumber, account.Customer); err != nil {
			return nil, err
		}
	}
	return u.confirmationRepository.SendPhoneNumberConfirmation(ctx, phoneNumber)
}

func (u *UseCaseImpl) SignOut(ctx context.Context, tokens *token.Pair) (*string, error) {
	access, refresh := tokens.AccessToken, tokens.RefreshToken
	if _, err := u.tokenRepository.VerifyToken(ctx, access); err == nil {
		if _, err := u.tokenRepository.RevokeToken(ctx, access); err != nil {
			return nil, err
		}
	}
	return u.tokenRepository.RevokeToken(ctx, refresh)
}

func (u *UseCaseImpl) RefreshToken(ctx context.Context, tokens *token.Pair) (*token.Pair, error) {
	access, refresh := tokens.AccessToken, tokens.RefreshToken
	payload, err := u.tokenRepository.VerifyToken(ctx, refresh)
	if err != nil {
		return nil, err
	}
	if _, err := u.tokenRepository.RevokeToken(ctx, access); err != nil {
		return nil, err
	}
	if _, err := u.tokenRepository.RevokeToken(ctx, refresh); err != nil {
		return nil, err
	}
	return u.tokenRepository.GenerateToken(ctx, *payload)
}

func (u *UseCaseImpl) VerifyAccess(ctx context.Context, accessToken string) (*string, error) {
	return u.tokenRepository.VerifyToken(ctx, accessToken)
}
