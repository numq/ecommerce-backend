package order

import (
	"context"
	pb "gateway/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

type ServiceImpl struct {
	pb.UnimplementedOrderServiceServer
	Client pb.OrderServiceClient
}

func NewService(address string) pb.OrderServiceServer {
	connection, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	return ServiceImpl{Client: pb.NewOrderServiceClient(connection)}
}

func (s ServiceImpl) CreateOrder(ctx context.Context, request *pb.CreateOrderRequest) (*pb.CreateOrderResponse, error) {
	return s.Client.CreateOrder(ctx, request)
}
func (s ServiceImpl) GetOrderById(ctx context.Context, request *pb.GetOrderByIdRequest) (*pb.GetOrderByIdResponse, error) {
	return s.Client.GetOrderById(ctx, request)
}
func (s ServiceImpl) GetCustomerOrders(ctx context.Context, request *pb.GetCustomerOrdersRequest) (*pb.GetCustomerOrdersResponse, error) {
	return s.Client.GetCustomerOrders(ctx, request)
}
func (s ServiceImpl) UpdateOrder(ctx context.Context, request *pb.UpdateOrderRequest) (*pb.UpdateOrderResponse, error) {
	return s.Client.UpdateOrder(ctx, request)
}
func (s ServiceImpl) DeleteOrder(ctx context.Context, request *pb.DeleteOrderRequest) (*pb.DeleteOrderResponse, error) {
	return s.Client.DeleteOrder(ctx, request)
}
