import { useCallback, useContext, useEffect, useState } from 'react';
import { RoomI } from './interface';
import { SocketCtx } from './socketCtx';

export function useRoomInfo(): RoomI {
    const { socket } = useContext(SocketCtx);
    const defaultValue: RoomI = {connected: false};
    const roomName = socket.getCurrentRoom();
    if (roomName) {
        defaultValue.connected = true;
        defaultValue.info = {
            room_name: roomName
        };
    }
    const [room, setRoomInfo] = useState<RoomI>(defaultValue);

    const handleConnect = useCallback((msg) => {
        if (msg.status) {
            socket.setCurrentRoom(msg.room_name);
            setRoomInfo({
                connected: true,
                info: {
                    room_name: msg.room_name
                }
            });
        }
    }, [setRoomInfo, socket]);

    const handleDisconnect = useCallback(() => {
        socket.setCurrentRoom(undefined);
        setRoomInfo({connected: false});
    }, [setRoomInfo, socket]);

    useEffect(() => {
        socket.getSocket().on('room:create', handleConnect);
        socket.getSocket().on('room:join', handleConnect);
        socket.getSocket().on('room:leave', handleDisconnect);
        socket.getSocket().on('disconnect', handleDisconnect);
        return () => {
            socket.getSocket().off('room:create', handleConnect);
            socket.getSocket().off('room:join', handleConnect);
            socket.getSocket().off('room:leave', handleDisconnect);
            socket.getSocket().off('disconnect', handleDisconnect);
        }
    }, [socket, handleConnect, handleDisconnect]);
    return room;
}
