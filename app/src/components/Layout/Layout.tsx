import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Layout as LayoutAnt, Menu } from 'antd';
import styles from './Layout.module.scss';

const { Header, Content, Footer } = LayoutAnt;

interface Props {
    children: ReactNode;
    isAuthenticated: boolean
}

export function Layout({ children, isAuthenticated }: Props) {
    return (
        <LayoutAnt className={styles.layout}>
            <Header>
                <Menu theme="dark" mode="horizontal">
                    {
                        (isAuthenticated)
                            ? (<Menu.Item style={{float: 'right'}}><Link to="/logout">Log Out</Link></Menu.Item>)
                            : (<Menu.Item style={{float: 'right'}}><Link to="/">Login</Link></Menu.Item>)
                    }
                </Menu>
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
