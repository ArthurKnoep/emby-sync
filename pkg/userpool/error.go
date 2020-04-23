package userpool

import "errors"

var UserNotFound = errors.New("user not found")

var RoomNotFound = errors.New("room not found")

var RoomAlreadyExist = errors.New("room already exist")

var RoomBadPassword = errors.New("invalid room password")
