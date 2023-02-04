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
	RevokeToken(ctx context.Context, token string, expirationTimestamp int64) (*string, error)
}

type RepositoryImpl struct {
	config config.Config
	client *redis.Client
}

func NewRepository(config config.Config, client *redis.Client) Repository {
	return &RepositoryImpl{config: config, client: client}
}

func (r *RepositoryImpl) GenerateTokenPair(ctx context.Context, id string) (*Pair, error) {
	timestamp := time.Now().Unix()
	accessToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  id,
		"iat": timestamp,
		"exp": timestamp + (time.Minute * 30).Milliseconds(),
	}).SignedString([]byte(r.config.SecretKey))
	if err != nil {
		return nil, err
	}
	refreshToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  id,
		"iat": timestamp,
		"exp": timestamp + (time.Hour * 24 * 30).Milliseconds(),
	}).SignedString([]byte(r.config.SecretKey))
	if err != nil {
		return nil, err
	}
	return &Pair{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

func (r *RepositoryImpl) VerifyToken(ctx context.Context, token string) (*Claims, error) {
	if r.client.Exists(ctx, token).Val() == 0 {
		claims := jwt.MapClaims{}
		parsedToken, err := jwt.ParseWithClaims(token, &claims, func(token *jwt.Token) (interface{}, error) {
			return []byte(r.config.SecretKey), nil
		})
		if err != nil {
			return nil, err
		}
		if parsedToken.Valid {
			id := claims["id"].(string)
			iat := claims["iat"].(float64)
			exp := claims["exp"].(float64)
			return &Claims{Id: id, IssuedAt: int64(iat), ExpirationTime: int64(exp)}, err
		}
	}
	return nil, fmt.Errorf("invalid token")
}

func (r *RepositoryImpl) RevokeToken(ctx context.Context, token string, expirationTimestamp int64) (*string, error) {
	revokedToken := r.client.Set(ctx, token, token, time.Duration(expirationTimestamp-time.Now().Unix()))
	err := revokedToken.Err()
	if err != nil {
		return nil, err
	}
	return &token, err
}
