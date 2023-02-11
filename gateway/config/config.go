package config

import (
	"github.com/spf13/viper"
	"log"
)

type Config struct {
	ServerAddress         string `mapstructure:"SERVER_ADDRESS"`
	CategoryAddress       string `mapstructure:"CATEGORY_ADDRESS"`
	CatalogAddress        string `mapstructure:"CATALOG_ADDRESS"`
	CartAddress           string `mapstructure:"CART_ADDRESS"`
	OrderAddress          string `mapstructure:"ORDER_ADDRESS"`
	DeliveryAddress       string `mapstructure:"DELIVERY_ADDRESS"`
	PaymentAddress        string `mapstructure:"PAYMENT_ADDRESS"`
	SearchAddress         string `mapstructure:"SEARCH_ADDRESS"`
	ProfileAddress        string `mapstructure:"PROFILE_ADDRESS"`
	PromoAddress          string `mapstructure:"PROMO_ADDRESS"`
	AuthenticationAddress string `mapstructure:"AUTHENTICATION_ADDRESS"`
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
