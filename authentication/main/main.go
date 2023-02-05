package main

import (
	"authentication/account"
	"authentication/authentication"
	"authentication/config"
	"authentication/confirmation"
	pb "authentication/generated"
	"authentication/server"
	"authentication/token"
	"flag"
	"google.golang.org/grpc"
	"google.golang.org/grpc/metadata"
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

	authenticationUseCase := authentication.NewUseCase(accountRepository, confirmationRepository, tokenRepository)

	md := metadata.New(map[string]string{"Authorization": cfg.ApiKey})
	authenticationService := authentication.NewService(authenticationUseCase, md)
	grpcServer := server.Server{Address: cfg.ServerAddress}
	grpcServer.Launch(func(server *grpc.Server) {
		pb.RegisterAuthenticationServiceServer(server, authenticationService)
	})
}
