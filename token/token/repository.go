package token

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v9"
	"github.com/golang-jwt/jwt/v4"
	"time"
	"token/config"
)

type Repository interface {
	GenerateTokenPair(ctx context.Context, id string) (*Pair, error)
	VerifyToken(ctx context.Context, tokenString string) (*Claims, error)
	RevokeToken(ctx context.Context, token string, expirationTimestamp string) (*string, error)
}

type RepositoryImpl struct {
	config config.Config
	client *redis.Client
}

func NewRepository(config config.Config, client *redis.Client) Repository {
	return RepositoryImpl{config: config, client: client}
}

func (r RepositoryImpl) GenerateTokenPair(ctx context.Context, payload string) (*Pair, error) {
	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"payload": payload,
		"iat":     time.Now(),
		"exp":     time.Minute * 30,
	}).SignedString([]byte(r.config.SecretKey))
	if err != nil {
		return nil, err
	}
	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iat": time.Now(),
		"exp": time.Hour * 24 * 30,
	}).SignedString([]byte(r.config.SecretKey))
	if err != nil {
		return nil, err
	}
	return &Pair{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

func (r RepositoryImpl) VerifyToken(ctx context.Context, token string) (*Claims, error) {
	if r.client.Exists(ctx, token).Val() == 0 {
		claims := jwt.MapClaims{}
		parsedToken, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(r.config.SecretKey), nil
		})
		if err != nil {
			return nil, err
		}
		if parsedToken.Valid {
			payload := claims["payload"].(string)
			iat := claims["iat"].(string)
			exp := claims["exp"].(string)
			return &Claims{Payload: payload, IssuedAt: iat, ExpirationTime: exp}, err
		}
	}
	return nil, fmt.Errorf("invalid token")
}

func (r RepositoryImpl) RevokeToken(ctx context.Context, token string, expirationTimestamp string) (*string, error) {
	expiresAt, err := time.ParseDuration(expirationTimestamp)
	revokedToken := r.client.Set(ctx, token, token, expiresAt)
	value, err := revokedToken.Val(), revokedToken.Err()
	return &value, err
}
