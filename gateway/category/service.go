package category

import (
	"context"
	pb "gateway/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

type ServiceImpl struct {
	pb.UnimplementedCategoryServiceServer
	Client pb.CategoryServiceClient
}

func NewService(address string) pb.CategoryServiceServer {
	connection, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	return ServiceImpl{Client: pb.NewCategoryServiceClient(connection)}
}

func (s ServiceImpl) AddCategory(ctx context.Context, request *pb.AddCategoryRequest) (*pb.AddCategoryResponse, error) {
	return s.Client.AddCategory(ctx, request)
}

func (s ServiceImpl) GetCategoryById(ctx context.Context, request *pb.GetCategoryByIdRequest) (*pb.GetCategoryByIdResponse, error) {
	return s.Client.GetCategoryById(ctx, request)
}

func (s ServiceImpl) GetCategories(ctx context.Context, request *pb.GetCategoriesRequest) (*pb.GetCategoriesResponse, error) {
	return s.Client.GetCategories(ctx, request)
}

func (s ServiceImpl) GetCategoriesByTags(ctx context.Context, request *pb.GetCategoriesByTagsRequest) (*pb.GetCategoriesByTagsResponse, error) {
	return s.Client.GetCategoriesByTags(ctx, request)
}

func (s ServiceImpl) UpdateCategory(ctx context.Context, request *pb.UpdateCategoryRequest) (*pb.UpdateCategoryResponse, error) {
	return s.Client.UpdateCategory(ctx, request)
}

func (s ServiceImpl) RemoveCategory(ctx context.Context, request *pb.RemoveCategoryRequest) (*pb.RemoveCategoryResponse, error) {
	return s.Client.RemoveCategory(ctx, request)
}
