package server

import (
	"context"
	"google.golang.org/grpc"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/metadata"
	"google.golang.org/grpc/status"
)

func NewInterceptor(name string, callback func(ctx context.Context, header string) error) grpc.ServerOption {
	return grpc.UnaryInterceptor(func(ctx context.Context, req interface{}, info *grpc.UnaryServerInfo, handler grpc.UnaryHandler) (interface{}, error) {
		md, ok := metadata.FromIncomingContext(ctx)
		if !ok {
			return nil, status.Errorf(codes.InvalidArgument, "Error reading metadata")
		}
		header := md.Get(name)
		if len(header) < 1 {
			return nil, status.Errorf(codes.InvalidArgument, "Error reading header")
		}
		if err := callback(ctx, header[0]); err != nil {
			return nil, status.Errorf(codes.Internal, "Error processing header")
		}
		return handler(ctx, req)
	})
}
