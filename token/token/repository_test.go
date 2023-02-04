package token

import (
	"context"
	"github.com/alicebob/miniredis"
	"github.com/go-redis/redis/v9"
	"github.com/golang-jwt/jwt/v4"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"math/rand"
	"strconv"
	"testing"
	"time"
	"token/config"
)

type RepositoryTestSuite struct {
	suite.Suite
	client     *redis.Client
	ctx        context.Context
	cfg        config.Config
	repository Repository
}

func NewToken(secret string, expiration time.Duration) (*Claims, *string) {
	id, timestamp := strconv.Itoa(rand.Int()), time.Now().Unix()
	claims := &Claims{
		Id:             id,
		IssuedAt:       timestamp,
		ExpirationTime: timestamp + expiration.Milliseconds(),
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, &jwt.MapClaims{
		"id":  claims.Id,
		"iat": claims.IssuedAt,
		"exp": claims.ExpirationTime,
	}).SignedString([]byte(secret))
	if err != nil {
		return nil, nil
	}
	return claims, &token
}

func (suite *RepositoryTestSuite) SetupTest() {
	server, _ := miniredis.Run()
	suite.client = redis.NewClient(&redis.Options{
		Addr: server.Addr(),
	})
	suite.ctx = context.TODO()
	suite.cfg = config.Config{SecretKey: "secret"}
	suite.repository = &RepositoryImpl{config: suite.cfg, client: suite.client}
}

func (suite *RepositoryTestSuite) TestRepositoryImpl_GenerateTokenPair() {
	id := "0"
	result, err := suite.repository.GenerateTokenPair(suite.ctx, id)
	assert.Nil(suite.T(), err)
	assert.NotNil(suite.T(), result)

	claims := jwt.MapClaims{}

	token, err := jwt.ParseWithClaims(result.AccessToken, &claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(suite.cfg.SecretKey), nil
	})
	assert.Nil(suite.T(), err)
	assert.True(suite.T(), token.Valid)
	assert.Equal(suite.T(), claims["id"].(string), id)

	token, err = jwt.ParseWithClaims(result.RefreshToken, &claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(suite.cfg.SecretKey), nil
	})
	assert.Nil(suite.T(), err)
	assert.True(suite.T(), token.Valid)
	assert.Equal(suite.T(), claims["id"].(string), id)
}

func (suite *RepositoryTestSuite) TestRepositoryImpl_VerifyToken() {
	claims, token := NewToken(suite.cfg.SecretKey, time.Hour)

	result, err := suite.repository.VerifyToken(suite.ctx, *token)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), result, claims)
}

func (suite *RepositoryTestSuite) TestRepositoryImpl_RevokeToken() {
	claims, token := NewToken(suite.cfg.SecretKey, time.Hour)

	result, err := suite.repository.RevokeToken(suite.ctx, *token, claims.ExpirationTime)
	assert.Nil(suite.T(), err)
	assert.Equal(suite.T(), token, result)

	assert.Equal(suite.T(), *token, suite.client.Get(suite.ctx, *token).Val())
}

func TestRepositoryTestSuite(t *testing.T) {
	suite.Run(t, new(RepositoryTestSuite))
}
