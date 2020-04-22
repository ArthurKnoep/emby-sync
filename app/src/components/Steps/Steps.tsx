import React from "react";
import { Steps as StepsAnt } from 'antd';

const { Step } = StepsAnt;

interface Props {
    current: number;
}

export function Steps({ current }: Props) {
    return (
        <StepsAnt current={current}>
            <Step title="Rooms"/>
            <Step title="Server"/>
            <Step title="Item" />
        </StepsAnt>
    )
}
