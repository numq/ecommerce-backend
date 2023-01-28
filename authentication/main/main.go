package main

import (
	"authentication/account"
	"authentication/authentication"
	"authentication/config"
	"authentication/confirmation"
	"authentication/database"
	pb "authentication/generated"
	"authentication/server"
	"authentication/store"
	"authentication/token"
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

	tokenClient := token.NewClient(cfg.TokenAddress)
	tokenRepository := token.NewRepository(tokenClient)

	accountClient := account.NewClient(cfg.AccountAddress)
	accountRepository := account.NewRepository(accountClient, account.NewMapper())

	confirmationClient := confirmation.NewClient(cfg.ConfirmationAddress)
	confirmationRepository := confirmation.NewRepository(confirmationClient)

	client := store.NewClient(context.Background(), fmt.Sprintf("%s:%s", cfg.RedisHostname, cfg.RedisPort))
	if client != nil {
		// TODO use store
	}
	db := database.Connect(context.Background(), fmt.Sprintf("mongodb://%s:%s", cfg.MongoHostname, cfg.MongoPort))
	defer db.Disconnect()
	if db != nil {
		// TODO use db
	}
	authenticationRepository := authentication.NewRepository(db.Collection(cfg.DatabaseName, cfg.CollectionItems))
	if authenticationRepository != nil {
		// TODO use repository
	}
	authenticationUseCase := authentication.NewUseCase(accountRepository, confirmationRepository, tokenRepository)
	authenticationService := authentication.NewService(authenticationUseCase)
	authInterceptor := server.NewInterceptor("Authorization", func(ctx context.Context, header string) error {
		if header != cfg.ApiKey {
			return status.Errorf(codes.Unauthenticated, "Invalid API key")
		}
		return nil
	})
	grpcServer := server.Server{Address: cfg.ServerAddress}
	grpcServer.Launch(func(server *grpc.Server) {
		pb.RegisterAuthenticationServiceServer(server, authenticationService)
	}, authInterceptor)
}
