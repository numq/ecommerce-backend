package main

import (
	"context"
	"flag"
	"gateway/authentication"
	"gateway/cart"
	"gateway/catalog"
	"gateway/category"
	"gateway/config"
	"gateway/delivery"
	pb "gateway/generated"
	"gateway/order"
	"gateway/profile"
	"gateway/search"
	"gateway/server"
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

	authenticationClient := authentication.NewClient(cfg.AuthenticationAddress)
	authInterceptor := server.NewInterceptor("Authorization", func(ctx context.Context, info *grpc.UnaryServerInfo, header string) error {
		if _, ok := info.Server.(authentication.ServiceImpl); ok {
			return nil
		}
		_, err := authenticationClient.VerifyAccess(ctx, &pb.VerifyAccessRequest{AccessToken: header})
		if err != nil {
			return status.Errorf(codes.Unauthenticated, "Invalid access token")
		}
		return nil
	})

	authenticationService := authentication.NewService(cfg.AuthenticationAddress)
	categoryService := category.NewService(cfg.CategoryAddress)
	catalogService := catalog.NewService(cfg.CatalogAddress)
	cartService := cart.NewService(cfg.CartAddress)
	orderService := order.NewService(cfg.OrderAddress)
	deliveryService := delivery.NewService(cfg.DeliveryAddress)
	profileService := profile.NewService(cfg.ProfileAddress)
	searchService := search.NewService(cfg.SearchAddress)
	grpcServer := server.Server{Address: cfg.ServerAddress}
	grpcServer.Launch(func(server *grpc.Server) {
		pb.RegisterAuthenticationServiceServer(server, authenticationService)
		pb.RegisterCategoryServiceServer(server, categoryService)
		pb.RegisterCatalogServiceServer(server, catalogService)
		pb.RegisterCartServiceServer(server, cartService)
		pb.RegisterOrderServiceServer(server, orderService)
		pb.RegisterDeliveryServiceServer(server, deliveryService)
		pb.RegisterProfileServiceServer(server, profileService)
		pb.RegisterSearchServiceServer(server, searchService)
	}, authInterceptor)
}
