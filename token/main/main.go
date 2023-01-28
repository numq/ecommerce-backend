package main

import (
	"context"
	"flag"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"os"
	"os/exec"
	"token/config"
	pb "token/generated"
	"token/server"
	"token/store"
	"token/token"
)

func main() {
	productionMode := flag.Bool("production", false, "enable production mode")
	flag.Parse()
	cfgName := func() string {
		if *productionMode {
			return "prod"
		}
		return "dev"
	}()
	cfg, err := config.LoadConfig(cfgName)
	if err != nil {
		log.Fatal(err)
	}
	if !*productionMode {
		if err := os.RemoveAll("./generated"); err != nil {
			log.Fatal(err)
		}
		if err := os.Mkdir("./generated", os.ModePerm); err != nil {
			log.Fatal(err)
		}
		if err := exec.Command("protoc", "--go_out=generated", "--go-grpc_out=generated", "--proto_path=proto", "proto/*.proto").Run(); err != nil {
			log.Fatal(err)
		}
	}
	client := store.NewClient(context.Background(), fmt.Sprintf("%s:%s", cfg.RedisHostname, cfg.RedisPort))
	accountRepository := token.NewRepository(cfg, client)
	accountUseCase := token.NewUseCase(accountRepository)
	accountService := token.NewService(accountUseCase)
	authInterceptor := server.NewInterceptor("Authorization", func(ctx context.Context, header string) error {
		if header != cfg.ApiKey {
			return status.Errorf(codes.Unauthenticated, "Invalid API key")
		}
		return nil
	})
	grpcServer := server.Server{Address: cfg.ServerAddress}
	grpcServer.Launch(func(server *grpc.Server) {
		pb.RegisterTokenServiceServer(server, accountService)
	}, authInterceptor)
}
