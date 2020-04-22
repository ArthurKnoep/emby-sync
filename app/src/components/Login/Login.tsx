import React, { useContext, useState } from 'react';
import { Card, Row, Col, Form, Input, Button, Typography, notification } from 'antd';
import { Store } from 'rc-field-form/lib/interface';
import { ConnectCtx } from '../../features/emby/connectCtx';
import { Layout } from '../Layout';
import styles from './Login.module.scss';

const { Title, Paragraph } = Typography;

export function Login() {
    const { authenticator } = useContext(ConnectCtx);
    const [ isLoading, setIsLoading ] = useState<boolean>(false);

    const createNotification = (msg: string) => notification.error({
        message: 'Could not connect to your emby account',
        description: msg
    });

    const onFinish = (values: Store) => {
        setIsLoading(true);
        authenticator.connect(values.username, values.password)
            .catch(err => {
                setIsLoading(false);
                if (err.response.status === 401) {
                    createNotification('Invalid username or password');
                } else {
                    createNotification('An unexpected error happened while logging you');
                }
            });
    }

    return (
        <Layout>
            <Row>
                <Col span={10} offset={7}>
                    <Card>
                        <Title level={2}>Login</Title>
                        <Paragraph>Please login using your emby account</Paragraph>
                        <Form
                            labelCol={{span: 5}}
                            wrapperCol={{span: 16}}
                            className={styles.form}
                            name="login"
                            onFinish={onFinish}
                        >
                            <Form.Item
                                label="Username"
                                name="username"
                                rules={[{required: true, message: 'Please enter your emby username'}]}
                            >
                                <Input/>
                            </Form.Item>
                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[{required: true, message: 'Please enter your emby password'}]}
                            >
                                <Input.Password/>
                            </Form.Item>
                            <Form.Item
                                wrapperCol={{offset: 5, span: 16}}
                            >
                                <Button type='primary' htmlType="submit" loading={isLoading}>
                                    Connection
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Layout>
    )
}