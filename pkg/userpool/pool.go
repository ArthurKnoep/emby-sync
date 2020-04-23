package userpool

import (
	"fmt"

	socketio "github.com/googollee/go-socket.io"
)

type (
	user struct {
		conn            socketio.Conn
		currentRoomName string
	}

	room struct {
		name         string
		needPassword bool
		password     string
	}

	Pool struct {
		users map[string]*user
		rooms map[string]*room
	}
)

func NewPool() *Pool {
	return &Pool{
		users: make(map[string]*user),
		rooms: make(map[string]*room),
	}
}

func (p *Pool) AddUser(conn socketio.Conn) {
	p.users[conn.ID()] = &user{
		conn: conn,
	}
}

func (p *Pool) getUser(userId string) (*user, error) {
	if v, ok := p.users[userId]; ok {
		return v, nil
	} else {
		return nil, UserNotFound
	}
}

func (p *Pool) getRoom(roomName string) (*room, error) {
	if v, ok := p.rooms[roomName]; ok {
		return v, nil
	} else {
		return nil, RoomNotFound
	}
}

func (p *Pool) delRoom(roomName string) {
	delete(p.rooms, roomName)
}

func (p *Pool) JoinRoom(userId, roomName string, password string) error {
	u, err := p.getUser(userId)
	if err != nil {
		return err
	}
	r, err := p.getRoom(roomName)
	if err != nil {
		return err
	}
	if r.needPassword && r.password != password {
		return RoomBadPassword
	}
	u.currentRoomName = roomName
	u.conn.LeaveAll()
	u.conn.Join(roomName)
	return nil
}

func (p *Pool) CreateRoom(userId, roomName string, password string) error {
	u, err := p.getUser(userId)
	if err != nil {
		return err
	}
	fmt.Printf("%p\n", u)
	if _, err := p.getRoom(roomName); err != RoomNotFound {
		return RoomAlreadyExist
	}
	r := room{
		name: roomName,
	}
	if password != "" {
		r.needPassword = true
		r.password = password
	}
	p.rooms[roomName] = &r
	u.currentRoomName = roomName
	u.conn.LeaveAll()
	u.conn.Join(roomName)
	return nil
}

func (p *Pool) DelUser(userId string, server *socketio.Server) {
	if u, err := p.getUser(userId); err == nil && u.currentRoomName != "" {
		if server.RoomLen("/", u.currentRoomName) == 0 {
			p.delRoom(u.currentRoomName)
		}
	}
	delete(p.users, userId)
}
