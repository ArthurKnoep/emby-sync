package socket

import (
	"encoding/json"
	"fmt"

	socketio "github.com/googollee/go-socket.io"
)

type (
	roomJoinRequest struct {
		RoomName string `json:"room_name"`
		Password string `json:"room_password"`
	}

	resp struct {
		Success bool   `json:"success"`
		Reason  string `json:"reason"`
	}
)

func (s *Server) handleRoomJoin(c socketio.Conn, msg string) {
	fmt.Println(msg)
	var req roomJoinRequest
	if err := json.Unmarshal([]byte(msg), &req); err != nil {
		emitStruct(c, "room:join", &resp{Success: false, Reason: err.Error()})
		return
	}
	fmt.Println(req)
	if err := s.pool.JoinRoom(c.ID(), req.RoomName, req.Password); err != nil {
		emitStruct(c, "room:join", &resp{Success: false, Reason: err.Error()})
		return
	}
	fmt.Println("room joined")
	emitStruct(c, "room:join", &resp{Success: true})
}
