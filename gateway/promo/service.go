package promo

import (
	"context"
	pb "gateway/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

type ServiceImpl struct {
	pb.UnimplementedPromoServiceServer
	Client pb.PromoServiceClient
}

func NewService(address string) pb.PromoServiceServer {
	connection, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	return &ServiceImpl{Client: pb.NewPromoServiceClient(connection)}
}

func (s *ServiceImpl) InsertPromo(ctx context.Context, request *pb.InsertPromoRequest) (*pb.InsertPromoResponse, error) {
	return s.Client.InsertPromo(ctx, request)
}

func (s *ServiceImpl) GetPromo(ctx context.Context, request *pb.GetPromoRequest) (*pb.GetPromoResponse, error) {
	return s.Client.GetPromo(ctx, request)
}

func (s *ServiceImpl) RemovePromo(ctx context.Context, request *pb.RemovePromoRequest) (*pb.RemovePromoResponse, error) {
	return s.Client.RemovePromo(ctx, request)
}
