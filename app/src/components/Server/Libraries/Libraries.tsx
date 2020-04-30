import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Card, notification, Spin, Typography } from 'antd';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faFilm, faListUl, faMusic, faTv } from '@fortawesome/free-solid-svg-icons';
import { LibraryI } from '../../../features/emby/interface';
import { EmbyCtx } from '../../../features/emby/embyCtx';
import globalStyles from '../Server.module.scss';
import styles from './Libraries.module.scss';

export function Libraries() {
    const {authenticator} = useContext(EmbyCtx);
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
        if (emby) {
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
                });
        }
    }, [emby]);

    return (
        <>
            <Typography.Title level={3}>
                Libraries
            </Typography.Title>
            <div className={classNames(styles.librariesContainer, globalStyles.flexScrollContainer)}>
                {
                    (loadingLibraries)
                        ? <Spin />
                        : libraries.map(library => {
                            return (
                                <div key={library.Id} className={classNames({
                                    [styles.library]: true,
                                    [globalStyles.flexScrollItem]: true,
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
        </>
    )
}
