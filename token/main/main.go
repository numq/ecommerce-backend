package main

import (
	"context"
	"fmt"
	"github.com/go-redis/redis/v9"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	//"os"
	//"os/exec"
	"token/config"
	pb "token/generated"
	"token/server"
	"token/token"
)

func main() {
	cfg, _ := config.LoadConfig(".")
	/*if cfg.Debug {
		if err := os.RemoveAll("./generated"); err != nil {
			log.Fatal(err)
		}
		if err := os.Mkdir("./generated", os.ModePerm); err != nil {
			log.Fatal(err)
		}
		if err := exec.Command("protoc", "--go_out=generated", "--go-grpc_out=generated", "--proto_path=proto", "proto/*.proto").Run(); err != nil {
			log.Fatal(err)
		}
	}*/
	redisClient := redis.NewClient(&redis.Options{Addr: fmt.Sprintf("%s:%s", cfg.RedisHostname, cfg.RedisPort)})
	if _, err := redisClient.Ping(context.Background()).Result(); err != nil {
		log.Fatal(err)
	}
	defer func(redisClient *redis.Client) {
		err := redisClient.Close()
		if err != nil {
			log.Fatal(err)
		}
	}(redisClient)
	accountRepository := token.NewRepository(cfg, redisClient)
	accountUseCase := token.NewUseCase(accountRepository)
	accountService := token.NewService(accountUseCase)
	authInterceptor := server.NewInterceptor("Authorization", func(header string) error {
		if header != cfg.ApiKey {
			return status.Errorf(codes.Unauthenticated, "Invalid API key")
		}
		return nil
	})
	log.Println(cfg.Debug)
	server.Server{Address: cfg.ServerAddress}.Launch(func(server *grpc.Server) {
		pb.RegisterTokenServiceServer(server, accountService)
	}, authInterceptor)
}
