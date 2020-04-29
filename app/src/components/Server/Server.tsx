import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Card, Col, notification, Row, Spin, Typography } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFilm, faTv, faMusic, faBook, faListUl } from '@fortawesome/free-solid-svg-icons'
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { Steps } from '../Steps';
import { useRoomInfo } from '../../features/socket/hooks';
import { EmbyCtx } from '../../features/emby/embyCtx';
import { LibraryI } from '../../features/emby/interface';
import styles from './Server.module.scss';

export function Server() {
    const {authenticator} = useContext(EmbyCtx);
    const {connected} = useRoomInfo();
    const [loadingLibraries, setLoadingLibraries] = useState<boolean>(true);
    const [libraries, setLibraries] = useState<LibraryI[]>([]);
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);

    useEffect(() => {
        if (connected && emby) {
            emby.getLibraries()
                .then(rst => {
                    setLibraries(rst.Items);
                    setLoadingLibraries(false);
                })
                .catch(err => {
                    notification.error({
                        message: 'Could not load server libraries',
                        description: err.toString()
                    });
                })

        }
    }, [connected, emby]);

    if (!connected) {
        return <Redirect to="/" />
    }
    if (!emby) {
        return <Redirect to="/servers" />
    }
    return (
        <Row>
            <Col span={14} offset={5}>
                <Steps current={2} />
            </Col>
            <Col span={18} offset={1}>
                <Typography.Title level={3}>
                    Libraries
                </Typography.Title>
                <div className={styles.librariesContainer}>
                {
                    (loadingLibraries)
                        ? <Spin />
                        : libraries.map(library => {
                            return (
                                <div key={library.Id} className={classNames({
                                    [styles.library]: true,
                                    [styles.disabled]: library.CollectionType !== 'movies' && library.CollectionType !== 'tvshows'
                                })}>
                                    <Card className={styles.libraryCard} bodyStyle={{
                                        padding: 0,
                                        height: '100%',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        {
                                            (library.CollectionType === 'movies')
                                            && <FontAwesomeIcon icon={faFilm} />
                                        }
                                        {
                                            (library.CollectionType === 'tvshows')
                                            && <FontAwesomeIcon icon={faTv} />
                                        }
                                        {
                                            (library.CollectionType === 'music')
                                            && <FontAwesomeIcon icon={faMusic} />
                                        }
                                        {
                                            (library.CollectionType === 'audiobooks' || library.CollectionType === 'books')
                                            && <FontAwesomeIcon icon={faBook} />
                                        }
                                        {
                                            (library.CollectionType === 'playlists')
                                            && <FontAwesomeIcon icon={faListUl} />
                                        }
                                    </Card>
                                    <p className={styles.libraryName}>{library.Name}</p>
                                </div>
                            )
                        })
                }
                </div>
            </Col>
        </Row>
    );
}
