package main

import (
	"account/account"
	"account/config"
	"account/database"
	pb "account/generated"
	"account/server"
	"context"
	"fmt"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"log"
	"os"
	"os/exec"
)

func main() {
	cfg, _ := config.LoadConfig(".")
	if err := os.RemoveAll("./generated"); err != nil {
		log.Fatal(err)
	}
	if err := os.Mkdir("./generated", os.ModePerm); err != nil {
		log.Fatal(err)
	}
	if err := exec.Command("protoc", "--go_out=generated", "--go-grpc_out=generated", "--proto_path=proto", "proto/*.proto").Run(); err != nil {
		log.Fatal(err)
	}
	db := database.Connect(context.Background(), fmt.Sprintf("%s://%s:%s", cfg.DatabaseHost, cfg.DatabaseHostname, cfg.DatabasePort))
	defer db.Disconnect()
	accountRepository := account.NewRepository(db.Collection(cfg.DatabaseName, cfg.CollectionItems))
	accountUseCase := account.NewUseCase(accountRepository)
	accountService := account.NewService(accountUseCase, account.NewMapper())
	authInterceptor := server.NewInterceptor("Authorization", func(header string) error {
		if header != cfg.ApiKey {
			return status.Errorf(codes.Unauthenticated, "Invalid API key")
		}
		return nil
	})
	server.Server{Address: cfg.ServerAddress}.Launch(func(server *grpc.Server) {
		pb.RegisterAccountServiceServer(server, accountService)
	}, authInterceptor)
}
