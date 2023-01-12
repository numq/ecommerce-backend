package profile

import (
	"context"
	pb "gateway/generated"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
	"log"
)

type ServiceImpl struct {
	pb.UnimplementedProfileServiceServer
	Client pb.ProfileServiceClient
}

func NewService(address string) pb.ProfileServiceServer {
	connection, err := grpc.Dial(address, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatal(err)
	}
	return ServiceImpl{Client: pb.NewProfileServiceClient(connection)}
}

func (s ServiceImpl) CreateProfile(ctx context.Context, request *pb.CreateProfileRequest) (*pb.CreateProfileResponse, error) {
	return s.Client.CreateProfile(ctx, request)
}

func (s ServiceImpl) GetProfileById(ctx context.Context, request *pb.GetProfileByIdRequest) (*pb.GetProfileByIdResponse, error) {
	return s.Client.GetProfileById(ctx, request)
}

func (s ServiceImpl) UpdateProfile(ctx context.Context, request *pb.UpdateProfileRequest) (*pb.UpdateProfileResponse, error) {
	return s.Client.UpdateProfile(ctx, request)
}

func (s ServiceImpl) RemoveProfile(ctx context.Context, request *pb.RemoveProfileRequest) (*pb.RemoveProfileResponse, error) {
	return s.Client.RemoveProfile(ctx, request)
}
