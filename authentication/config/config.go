package config

import (
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	ServiceName         string `mapstructure:"SERVICE_NAME"`
	ServerAddress       string `mapstructure:"SERVER_ADDRESS"`
	RedisHostname       string `mapstructure:"REDIS_HOSTNAME"`
	RedisPort           string `mapstructure:"REDIS_PORT"`
	MongoHostname       string `mapstructure:"MONGO_HOSTNAME"`
	MongoPort           string `mapstructure:"MONGO_PORT"`
	DatabaseName        string `mapstructure:"DATABASE_NAME"`
	CollectionItems     string `mapstructure:"COLLECTION_ITEMS"`
	TokenAddress        string `mapstructure:"TOKEN_ADDRESS"`
	AccountAddress      string `mapstructure:"ACCOUNT_ADDRESS"`
	ConfirmationAddress string `mapstructure:"CONFIRMATION_ADDRESS"`
	ApiKey              string `mapstructure:"API_KEY"`
}

func LoadConfig(name string) (config Config, err error) {
	viper.AddConfigPath(".")
	viper.AddConfigPath("./config")
	viper.SetConfigType("env")
	viper.SetConfigName(name)
	if err = viper.ReadInConfig(); err != nil {
		log.Fatal(err)
	}
	if err = viper.Unmarshal(&config); err != nil {
		log.Fatal(err)
	}
	return
}
