package search

import (
	"context"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"search/fn"
	pb "search/generated"
)

type ServiceImpl struct {
	pb.UnimplementedSearchServiceServer
	useCase UseCase
	mapper  Mapper
}

func NewService(useCase UseCase, mapper Mapper) pb.SearchServiceServer {
	return ServiceImpl{useCase: useCase, mapper: mapper}
}

func (s ServiceImpl) Search(ctx context.Context, request *pb.SearchRequest) (*pb.SearchResponse, error) {
	reqQuery := request.GetQuery()
	if reqQuery == "" {
		return nil, status.Error(codes.InvalidArgument, "Value cannot be empty")
	}
	items, err := s.useCase.Search(ctx, reqQuery)
	if err != nil {
		return nil, err
	}
	return &pb.SearchResponse{Items: fn.Map(items, s.mapper.EntityToMessage)}, nil
}
