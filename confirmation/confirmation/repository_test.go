package confirmation

import (
	"context"
	"github.com/alicebob/miniredis"
	"github.com/go-redis/redis/v9"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/suite"
	"testing"
	"time"
)

type RepositoryTestSuite struct {
	suite.Suite
	client     *redis.Client
	ctx        context.Context
	repository RepositoryImpl
}

func (suite *RepositoryTestSuite) SetupTest() {
	server, _ := miniredis.Run()
	suite.client = redis.NewClient(&redis.Options{
		Addr: server.Addr(),
	})
	suite.ctx = context.TODO()
}

func (suite *RepositoryTestSuite) TestRepositoryImpl_SendPhoneNumberConfirmation() {
	repository := RepositoryImpl{client: suite.client}
	phoneNumber := "1234567890"

	result, err := repository.SendPhoneNumberConfirmation(suite.ctx, phoneNumber)
	assert.Nil(suite.T(), err)
	assert.NotNil(suite.T(), result)

	result, err = repository.SendPhoneNumberConfirmation(suite.ctx, phoneNumber)
	assert.Nil(suite.T(), result)
	assert.Equal(suite.T(), err, NotYetTime)
}

func (suite *RepositoryTestSuite) TestRepositoryImpl_VerifyPhoneNumberConfirmation() {
	repository := RepositoryImpl{client: suite.client}
	phoneNumber := "1234567890"

	suite.client.Set(suite.ctx, phoneNumber, "0000", time.Minute)

	wrongCode := "123"
	result, err := repository.VerifyPhoneNumberConfirmation(suite.ctx, phoneNumber, wrongCode)
	assert.Nil(suite.T(), result)
	assert.Equal(suite.T(), err, WrongConfirmationCode)

	correctCode := "0000"
	result, err = repository.VerifyPhoneNumberConfirmation(suite.ctx, phoneNumber, correctCode)
	assert.Equal(suite.T(), result, &phoneNumber)
	assert.Nil(suite.T(), err)

	result, err = repository.VerifyPhoneNumberConfirmation(suite.ctx, phoneNumber, correctCode)
	assert.Nil(suite.T(), result)
	assert.Equal(suite.T(), err, WrongConfirmationCode)

	assert.Equal(suite.T(), suite.client.Exists(suite.ctx, phoneNumber).Val(), int64(0))
}

func TestRepositoryTestSuite(t *testing.T) {
	suite.Run(t, new(RepositoryTestSuite))
}
