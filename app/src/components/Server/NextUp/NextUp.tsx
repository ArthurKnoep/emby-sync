import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { notification, Spin, Typography } from 'antd';
import classNames from 'classnames';
import { EmbyCtx } from '../../../features/emby/embyCtx';
import { ItemI } from '../../../features/emby/interface';
import { Item } from '../Item';
import globalStyles from '../Server.module.scss';
import styles from './NextUp.module.scss';

export function NextUp() {
    const {authenticator} = useContext(EmbyCtx);
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);
    const [isLoadingNextUp, setLoadingNextUp] = useState<boolean>(true);
    const [nextUp, setNextUp] = useState<ItemI[]>([]);

    useEffect(() => {
        if (emby) {
            emby.getNextUp()
                .then(items => {
                    setNextUp(items.Items);
                    setLoadingNextUp(false);
                })
                .catch(err => {
                    notification.error({
                        message: 'Could not load next up episode',
                        description: err.toString(),
                    })
                })
        }
    }, [emby, setLoadingNextUp, setNextUp]);

    if (!emby) {
        return <Redirect to="/servers" />
    }
    return (
        <>
            <Typography.Title level={3}>
                Next up
            </Typography.Title>
            <div className={globalStyles.flexScrollContainer}>
                {
                    (isLoadingNextUp)
                        ? <Spin />
                        : nextUp.map(item => (
                            <Item
                                key={item.Id}
                                aspectRatio={1.7777777777777777}
                                className={classNames(styles.nextUpItem, globalStyles.flexScrollItem)}
                                imageSrc={emby.getItemPrimaryImageUrl(item, 'Banner')}
                                primaryText={item.SeriesName || ''}
                                secondaryText={`S${item.ParentIndexNumber}:E${item.IndexNumber} - ${item.Name}`}
                                progress={item.UserData.PlayedPercentage}
                            />
                        ))
                }
            </div>
        </>
    )
}
