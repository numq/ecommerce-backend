package cart

import (
	"context"
	pb "gateway/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

type ServiceImpl struct {
	pb.UnimplementedCartServiceServer
	Client pb.CartServiceClient
}

func NewService(address string) pb.CartServiceServer {
	connection, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	return ServiceImpl{Client: pb.NewCartServiceClient(connection)}
}

func (s ServiceImpl) GetCart(ctx context.Context, request *pb.GetCartRequest) (*pb.GetCartResponse, error) {
	return s.Client.GetCart(ctx, request)
}

func (s ServiceImpl) ClearCart(ctx context.Context, request *pb.ClearCartRequest) (*pb.ClearCartResponse, error) {
	return s.Client.ClearCart(ctx, request)
}

func (s ServiceImpl) IncreaseItemQuantity(ctx context.Context, request *pb.IncreaseItemQuantityRequest) (*pb.IncreaseItemQuantityResponse, error) {
	return s.Client.IncreaseItemQuantity(ctx, request)
}

func (s ServiceImpl) DecreaseItemQuantity(ctx context.Context, request *pb.DecreaseItemQuantityRequest) (*pb.DecreaseItemQuantityResponse, error) {
	return s.Client.DecreaseItemQuantity(ctx, request)
}
