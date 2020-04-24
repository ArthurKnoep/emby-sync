import React, { useContext } from "react";
import { Steps as StepsAnt } from 'antd';
import {useHistory} from 'react-router-dom';
import { useRoomInfo } from '../../features/socket/hooks';

const { Step } = StepsAnt;

interface Props {
    current: number;
}

export function Steps({ current }: Props) {
    const { connected, info } = useRoomInfo();
    const history = useHistory();
    return (
        <StepsAnt current={current}>
            <Step title={(connected) ? `Rooms: ${info?.room_name}`: 'Rooms'} onClick={() => history.push('/rooms')}/>
            <Step title="Items"  onClick={() => {
                if (connected) {
                    history.push('/servers');
                }
            }}/>
            <Step title="Play" />
        </StepsAnt>
    )
}
