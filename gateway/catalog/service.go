package catalog

import (
	"context"
	pb "gateway/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

type ServiceImpl struct {
	pb.UnimplementedCatalogServiceServer
	Client pb.CatalogServiceClient
}

func NewService(address string) pb.CatalogServiceServer {
	connection, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	return ServiceImpl{Client: pb.NewCatalogServiceClient(connection)}
}

func (s ServiceImpl) AddCatalogItem(ctx context.Context, request *pb.AddCatalogItemRequest) (*pb.AddCatalogItemResponse, error) {
	return s.Client.AddCatalogItem(ctx, request)
}

func (s ServiceImpl) GetCatalogItemById(ctx context.Context, request *pb.GetCatalogItemByIdRequest) (*pb.GetCatalogItemByIdResponse, error) {
	return s.Client.GetCatalogItemById(ctx, request)
}

func (s ServiceImpl) GetCatalogItemsByTags(ctx context.Context, request *pb.GetCatalogItemsByTagsRequest) (*pb.GetCatalogItemsByTagsResponse, error) {
	return s.Client.GetCatalogItemsByTags(ctx, request)
}

func (s ServiceImpl) UpdateCatalogItem(ctx context.Context, request *pb.UpdateCatalogItemRequest) (*pb.UpdateCatalogItemResponse, error) {
	return s.Client.UpdateCatalogItem(ctx, request)
}

func (s ServiceImpl) RemoveCatalogItem(ctx context.Context, request *pb.RemoveCatalogItemRequest) (*pb.RemoveCatalogItemResponse, error) {
	return s.Client.RemoveCatalogItem(ctx, request)
}
