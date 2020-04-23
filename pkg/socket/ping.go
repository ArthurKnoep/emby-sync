package socket

import socketio "github.com/googollee/go-socket.io"

func (s *Server) handlePing(c socketio.Conn, _ string) {
	c.Emit("pong")
}
