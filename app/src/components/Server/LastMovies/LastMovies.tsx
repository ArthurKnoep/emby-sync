import React, { useContext, useEffect, useMemo, useState } from 'react';
import { notification, Spin, Typography } from 'antd';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { EmbyCtx } from '../../../features/emby/embyCtx';
import { ItemI } from '../../../features/emby/interface';
import { Item } from '../Item';
import globalStyles from '../Server.module.scss';
import styles from './LastMovies.module.scss';

export function LastMovies() {
    const {authenticator} = useContext(EmbyCtx);
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);
    const [isLoadingMovies, setLoadingMovies] = useState<boolean>(true);
    const [movies, setMovies] = useState<ItemI[]>([]);
    useEffect(() => {
        if (emby) {
            emby.getLibraries()
                .then(libraries => {
                    const movieLibrary = libraries.Items.find(lib => lib.CollectionType === 'movies');
                    if (!movieLibrary) {
                        return;
                    }
                    emby.getLatestItemFromLibrary(movieLibrary.Id)
                        .then(items => {
                            setLoadingMovies(false);
                            setMovies(items);
                        })
                        .catch(err => notification.error({
                            message: 'Could not load latest movies',
                            description: err.toString(),
                        }));
                })
                .catch(err => notification.error({
                    message: 'Could not load libraries',
                    description: err.toString(),
                }))
        }
    }, [emby, setLoadingMovies, setMovies]);

    if (!emby) {
        return <Redirect to="/servers" />
    }
    return (
        <>
            <Typography.Title level={3}>
                Last movies
            </Typography.Title>
            <div className={globalStyles.flexScrollContainer}>
                {
                    (isLoadingMovies)
                    ? <Spin />
                    : movies.map(movie => (
                        <Item
                            key={movie.Id}
                            className={classNames(globalStyles.flexScrollItem, styles.latestItem)}
                            width={160}
                            aspectRatio={0.66666666}
                            imageSrc={emby?.getItemPrimaryImageUrl(movie, 'Poster')}
                            primaryText={movie.Name}
                            secondaryText={movie.ProductionYear.toString()}
                            progress={movie.UserData.PlayedPercentage}
                        />
                    ))
                }
            </div>
        </>
    )
}
