import { useCallback, useContext, useEffect, useState } from 'react';
import { RoomI } from './interface';
import { SocketCtx } from './socketCtx';

export function useRoomInfo(): RoomI {
    const { socket } = useContext(SocketCtx);
    const defaultValue: RoomI = {connected: false};
    const roomName = socket.getCurrentRoom();
    const isMaster = socket.getIsMaster();
    if (roomName && typeof isMaster === 'boolean') {
        defaultValue.connected = true;
        defaultValue.info = {
            room_name: roomName,
            is_master: isMaster
        };
    }
    const [room, setRoomInfo] = useState<RoomI>(defaultValue);

    const handleConnect = useCallback((isMaster: boolean) => (msg: any) => {
        if (msg.status) {
            socket.setCurrentRoom(msg.room_name);
            setRoomInfo({
                connected: true,
                info: {
                    room_name: msg.room_name,
                    is_master: isMaster
                }
            });
        }
    }, [setRoomInfo, socket]);

    const handleDisconnect = useCallback(() => {
        socket.setCurrentRoom(undefined);
        setRoomInfo({connected: false});
    }, [setRoomInfo, socket]);

    useEffect(() => {
        const handleCreate = handleConnect(true);
        const handleJoin = handleConnect(false);
        socket.getSocket().on('room:create', handleCreate);
        socket.getSocket().on('room:join', handleJoin);
        socket.getSocket().on('room:leave', handleDisconnect);
        socket.getSocket().on('disconnect', handleDisconnect);
        return () => {
            socket.getSocket().off('room:create', handleCreate);
            socket.getSocket().off('room:join', handleJoin);
            socket.getSocket().off('room:leave', handleDisconnect);
            socket.getSocket().off('disconnect', handleDisconnect);
        }
    }, [socket, handleConnect, handleDisconnect]);
    return room;
}
