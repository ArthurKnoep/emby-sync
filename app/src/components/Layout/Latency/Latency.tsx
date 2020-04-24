import React, { useCallback, useContext, useState, useEffect, useRef } from 'react';
import { Typography } from 'antd';
import { SocketCtx } from '../../../features/socket';
import { CancelablePromise, CancelError } from '../../../utils';

const {Paragraph} = Typography;

export function Latency() {
    const {socket} = useContext(SocketCtx);
    const [latency, setLatency] = useState<number>(-1);
    const lastPromise = useRef<CancelablePromise<number> | null>(null);

    const executePing = useCallback(() => {
        if (lastPromise.current) {
            lastPromise.current.cancel();
        }
        lastPromise.current = socket.ping();
        lastPromise.current
            .then(ping => setLatency(ping))
            .catch(err => {
                if (!(err instanceof CancelError)) {
                    setLatency(-1);
                }
            })
    }, [socket]);

    useEffect(() => {
        executePing();
        const intervalIdx = window.setInterval(executePing, 5000);
        return () => {
            window.clearInterval(intervalIdx);
            if (lastPromise.current) {
                lastPromise.current.cancel();
            }
        }
    }, [executePing]);

    return (
        <Paragraph type="secondary">
            {
                (latency === -1)
                    ? '--'
                    : latency.toString()
            } ms
        </Paragraph>
    )
}
