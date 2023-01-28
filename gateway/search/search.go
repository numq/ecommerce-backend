package search

import (
	"context"
	pb "gateway/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

type ServiceImpl struct {
	pb.UnimplementedSearchServiceServer
	Client pb.SearchServiceClient
}

func NewService(address string) pb.SearchServiceServer {
	connection, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	return &ServiceImpl{Client: pb.NewSearchServiceClient(connection)}
}

func (s *ServiceImpl) Search(ctx context.Context, request *pb.SearchRequest) (*pb.SearchResponse, error) {
	return s.Client.Search(ctx, request)
}
