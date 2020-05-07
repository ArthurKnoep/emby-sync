import React, { useContext, useEffect, useMemo, useState } from 'react';
import { notification, Spin, Typography } from 'antd';
import { Redirect } from 'react-router-dom';
import classNames from 'classnames';
import { EmbyCtx } from '../../../features/emby/embyCtx';
import { ItemI } from '../../../features/emby/interface';
import { Item } from '../Item';
import globalStyles from '../Server.module.scss';
import styles from './LastItems.module.scss';

interface Props {
    collectionType: 'movies' | 'tvshows'
    title: string
}

export function LastItems({ collectionType, title }: Props) {
    const {authenticator} = useContext(EmbyCtx);
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);
    const [isLoading, setLoading] = useState<boolean>(true);
    const [items, setItems] = useState<ItemI[]>([]);
    useEffect(() => {
        if (emby) {
            emby.getLibraries()
                .then(libraries => {
                    const movieLibrary = libraries.Items.find(lib => lib.CollectionType === collectionType);
                    if (!movieLibrary) {
                        return;
                    }
                    emby.getLatestItemFromLibrary(movieLibrary.Id)
                        .then(latestItem => {
                            setLoading(false);
                            setItems(latestItem);
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
    }, [collectionType, emby, setLoading, setItems]);

    if (!emby) {
        return <Redirect to="/servers" />
    }
    return (
        <>
            <Typography.Title level={3}>
                {title}
            </Typography.Title>
            <div className={globalStyles.flexScrollContainer}>
                {
                    (isLoading)
                    ? <Spin />
                    : items.map(item => (
                        <Item
                            key={item.Id}
                            itemId={item.Id}
                            className={classNames(globalStyles.flexScrollItem, styles.latestItem)}
                            width={160}
                            aspectRatio={0.66666666}
                            imageSrc={emby?.getItemPrimaryImageUrl(item, 'Poster')}
                            primaryText={item.Name}
                            secondaryText={item.ProductionYear.toString()}
                            progress={item.UserData.PlayedPercentage}
                            hasBeenPlayed={(collectionType === 'movies') ? item.UserData.Played : undefined}
                            childrenElementCount={(collectionType === 'tvshows') ? item.UserData.UnplayedItemCount : undefined}
                        />
                    ))
                }
            </div>
        </>
    )
}
