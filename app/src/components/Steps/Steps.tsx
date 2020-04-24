import React, { useContext } from "react";
import { Steps as StepsAnt } from 'antd';
import {useHistory} from 'react-router-dom';
import { SocketCtx } from '../../features/socket';

const { Step } = StepsAnt;

interface Props {
    current: number;
}

export function Steps({ current }: Props) {
    const { socket } = useContext(SocketCtx);
    const roomName = socket.getCurrentRoom();
    const history = useHistory();
    return (
        <StepsAnt current={current}>
            <Step title={(roomName) ? `Rooms: ${roomName}`: 'Rooms'} onClick={() => history.push('/rooms')}/>
            <Step title="Items"  onClick={() => {
                if (roomName) {
                    history.push('/servers');
                }
            }}/>
            <Step title="Play" />
        </StepsAnt>
    )
}
