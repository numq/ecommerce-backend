package main

import (
	"confirmation/config"
	"confirmation/confirmation"
	pb "confirmation/generated"
	"confirmation/server"
	"confirmation/store"
	"context"
	"flag"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"os"
	"os/exec"
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
	ctx := context.Background()
	client := store.NewClient(ctx, fmt.Sprintf("%s:%s", cfg.RedisHostname, cfg.RedisPort))
	accountRepository := confirmation.NewRepository(client)
	accountUseCase := confirmation.NewUseCase(accountRepository)
	accountService := confirmation.NewService(accountUseCase)
	authInterceptor := server.NewInterceptor("Authorization", func(header string) error {
		if header != cfg.ApiKey {
			return status.Errorf(codes.Unauthenticated, "Invalid API key")
		}
		return nil
	})
	server.Server{Address: cfg.ServerAddress}.Launch(func(server *grpc.Server) {
		pb.RegisterConfirmationServiceServer(server, accountService)
	}, authInterceptor)
}
