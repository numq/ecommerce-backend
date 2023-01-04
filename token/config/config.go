package config

import (
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	Debug         bool   `mapstructure:"DEBUG"`
	ServiceName   string `mapstructure:"SERVICE_NAME"`
	ServerAddress string `mapstructure:"SERVER_ADDRESS"`
	RedisHostname string `mapstructure:"REDIS_HOSTNAME"`
	RedisPort     string `mapstructure:"REDIS_PORT"`
	ApiKey        string `mapstructure:"API_KEY"`
	SecretKey     string `mapstructure:"SECRET_KEY"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigType("env")
	viper.SetConfigFile(".env")
	if err = viper.ReadInConfig(); err != nil {
		log.Fatal(err)
	}
	if err = viper.Unmarshal(&config); err != nil {
		log.Fatal(err)
	}
	return
}
