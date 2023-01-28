package delivery

import (
	"context"
	pb "gateway/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

type ServiceImpl struct {
	pb.UnimplementedDeliveryServiceServer
	Client pb.DeliveryServiceClient
}

func NewService(address string) pb.DeliveryServiceServer {
	connection, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	return &ServiceImpl{Client: pb.NewDeliveryServiceClient(connection)}
}

func (s *ServiceImpl) StartDelivery(ctx context.Context, request *pb.StartDeliveryRequest) (*pb.StartDeliveryResponse, error) {
	return s.Client.StartDelivery(ctx, request)
}

func (s *ServiceImpl) GetDeliveryById(ctx context.Context, request *pb.GetDeliveryByIdRequest) (*pb.GetDeliveryByIdResponse, error) {
	return s.Client.GetDeliveryById(ctx, request)
}

func (s *ServiceImpl) GetDeliveriesByCourierId(ctx context.Context, request *pb.GetDeliveriesByCourierIdRequest) (*pb.GetDeliveriesByCourierIdResponse, error) {
	return s.Client.GetDeliveriesByCourierId(ctx, request)
}

func (s *ServiceImpl) GetDeliveriesByOrderId(ctx context.Context, request *pb.GetDeliveriesByOrderIdRequest) (*pb.GetDeliveriesByOrderIdResponse, error) {
	return s.Client.GetDeliveriesByOrderId(ctx, request)
}

func (s *ServiceImpl) UpdateDelivery(ctx context.Context, request *pb.UpdateDeliveryRequest) (*pb.UpdateDeliveryResponse, error) {
	return s.Client.UpdateDelivery(ctx, request)
}

func (s *ServiceImpl) CancelDelivery(ctx context.Context, request *pb.CancelDeliveryRequest) (*pb.CancelDeliveryResponse, error) {
	return s.Client.CancelDelivery(ctx, request)
}

func (s *ServiceImpl) CompleteDelivery(ctx context.Context, request *pb.CompleteDeliveryRequest) (*pb.CompleteDeliveryResponse, error) {
	return s.Client.CompleteDelivery(ctx, request)
}

func (s *ServiceImpl) RemoveDelivery(ctx context.Context, request *pb.RemoveDeliveryRequest) (*pb.RemoveDeliveryResponse, error) {
	return s.Client.RemoveDelivery(ctx, request)
}
