package socket

import (
	"encoding/json"
	"fmt"

	"github.com/gin-gonic/gin"
	socketio "github.com/googollee/go-socket.io"

	"github.com/ArthurKnoep/emby-sync/pkg/userpool"
)

type Server struct {
	server *socketio.Server
	pool   *userpool.Pool
}

const Namespace = "/"

func New() (*Server, error) {
	server, err := socketio.NewServer(nil)
	if err != nil {
		return nil, err
	}
	return &Server{
		server: server,
		pool:   userpool.NewPool(),
	}, nil
}

func (s *Server) Handle() {
	s.server.OnConnect(Namespace, func(c socketio.Conn) error {
		c.SetContext("")
		fmt.Println("connected:", c.ID())
		s.pool.AddUser(c)
		return nil
	})
	s.server.OnDisconnect(Namespace, func(c socketio.Conn, msg string) {
		s.pool.DelUser(c.ID(), s.server)
		fmt.Println("closed", msg)
	})
	s.server.OnEvent(Namespace, "ping", s.handlePing)
	s.server.OnEvent(Namespace, "room:join", s.handleRoomJoin)
}

func (s *Server) HandleGin(router *gin.Engine) {
	router.GET("/socket.io/*any", gin.WrapH(s.server))
	router.POST("/socket.io/*any", gin.WrapH(s.server))
}

func (s *Server) Run() error {
	return s.server.Serve()
}

func (s *Server) Close() {
	s.server.Close()
}

func emitStruct(c socketio.Conn, evtName string, msg interface{}) {
	marshalledStruct, err := json.Marshal(msg)
	if err != nil {
		return
	}
	c.Emit(evtName, string(marshalledStruct))
}
