import React, { useContext } from "react";
import { Steps as StepsAnt } from 'antd';
import {useHistory} from 'react-router-dom';
import { useRoomInfo } from '../../features/socket/hooks';
import { EmbyCtx } from '../../features/emby/embyCtx';

const { Step } = StepsAnt;

interface Props {
    current: number;
}

export function Steps({ current }: Props) {
    const { connected, info } = useRoomInfo();
    const { authenticator } = useContext(EmbyCtx);
    const history = useHistory();
    let serverName = null;
    try {
        serverName = authenticator.getEmby().getServerName();
    } catch (e) {
    }

    return (
        <StepsAnt current={current}>
            <Step title={(connected) ? `Rooms: ${info?.room_name}`: 'Rooms'} onClick={() => history.push('/rooms')}/>
            <Step title={(serverName) ? `Servers: ${serverName}` : 'Servers'}  onClick={() => {
                if (connected) {
                    history.push('/servers');
                }
            }}/>
            <Step title="Items" />
        </StepsAnt>
    )
}
