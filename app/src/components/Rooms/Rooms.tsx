import React, { ReactNode, useState } from "react";
import { Row, Col, Card } from 'antd';
import { Steps } from "../Steps";
import styles from './Rooms.module.scss';
import { CreateRoom } from "./CreateRoom";
import { JoinRoom } from "./JoinRoom";

interface Tab {
    key: string;
    tab: string;
    component: ReactNode;
}

const tabList: Tab[] = [
    {
        key: 'create',
        tab: 'Create',
        component: <CreateRoom />
    },
    {
        key: 'join',
        tab: 'Join',
        component: <JoinRoom />
    }
];

export function Rooms() {
    const [activeTab, setActiveTab] = useState<string>(tabList[0].key);
    return (
        <Row>
            <Col span={14} offset={5}>
                <Steps current={0} />
                <div className={styles.container}>
                    <Card
                        title="Rooms"
                        tabList={tabList}
                        activeTabKey={activeTab}
                        onTabChange={key => setActiveTab(key)}
                    >
                        {
                            tabList.find(elem => elem.key === activeTab)?.component
                        }
                    </Card>
                </div>
            </Col>
        </Row>
    );
}
