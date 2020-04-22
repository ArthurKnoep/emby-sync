import React, { ReactNode } from 'react';
import { Layout as LayoutAnt } from 'antd';
import styles from './Layout.module.scss';

const { Header, Content, Footer } = LayoutAnt;

interface Props {
    children: ReactNode;
}

export function Layout({ children }: Props) {
    return (
        <LayoutAnt className={styles.layout}>
            <Header>
                {/* <Menu theme="dark" mode="horizontal">
                    <Menu.Item>Oui</Menu.Item>
                </Menu> */}
            </Header>
            <Content className={styles.content}>
                {children}
            </Content>
            <Footer style={{textAlign: 'center'}}>
                EmbySync, 2020
            </Footer>
        </LayoutAnt>
    )
}