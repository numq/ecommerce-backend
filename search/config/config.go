package config

import (
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	ServiceName        string `mapstructure:"SERVICE_NAME"`
	ServerAddress      string `mapstructure:"SERVER_ADDRESS"`
	ElasticHostname    string `mapstructure:"ELASTIC_HOSTNAME"`
	ElasticPort        string `mapstructure:"ELASTIC_PORT"`
	AmqpHostname       string `mapstructure:"AMQP_HOSTNAME"`
	AmqpPort           string `mapstructure:"AMQP_PORT"`
	AmqpChannelCatalog string `mapstructure:"AMQP_CHANNEL_CATALOG"`
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
