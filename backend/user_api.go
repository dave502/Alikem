package main

import (
	pb "backend/user_api"
	"context"
	l "log"

	wrapper "github.com/golang/protobuf/ptypes/wrappers"
)

type server struct {
	pb.UnimplementedUserAPIServer
}

func (*server) InitUserRegistration(ctx context.Context, social_id *pb.UserSocialID) (*wrapper.UInt64Value, error) {

	l.Println(social_id.Socialid)

	return &wrapper.UInt64Value{Value: 0}, nil
}

func (*server) FinishUserRegistraton(ctx context.Context, uid *wrapper.UInt64Value) (*wrapper.UInt64Value, error) {

	return &wrapper.UInt64Value{Value: 0}, nil
}
