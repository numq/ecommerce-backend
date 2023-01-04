package config

import (
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	ServiceName      string `mapstructure:"SERVICE_NAME"`
	DatabaseHost     string `mapstructure:"DATABASE_HOST"`
	DatabaseHostname string `mapstructure:"DATABASE_HOSTNAME"`
	DatabasePort     string `mapstructure:"DATABASE_PORT"`
	DatabaseName     string `mapstructure:"DATABASE_NAME"`
	CollectionItems  string `mapstructure:"COLLECTION_ITEMS"`
	ServerAddress    string `mapstructure:"SERVER_ADDRESS"`
	ApiKey           string `mapstructure:"API_KEY"`
}

func LoadConfig(path string) (config Config, err error) {
	viper.AddConfigPath(path)
	viper.SetConfigName("app")
	viper.SetConfigType("env")
	viper.AutomaticEnv()
	if err = viper.ReadInConfig(); err != nil {
		log.Fatal(err)
	}
	if err = viper.Unmarshal(&config); err != nil {
		log.Fatal(err)
	}
	return
}
