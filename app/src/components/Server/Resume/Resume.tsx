import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { notification, Spin, Typography } from 'antd';
import classNames from 'classnames';
import { EmbyCtx } from '../../../features/emby/embyCtx';
import { ItemI } from '../../../features/emby/interface';
import { Item } from '../Item';
import globalStyles from '../Server.module.scss';
import styles from './Resume.module.scss';

interface Props {
    onItemClick?: (itemId: string) => void
}

export function Resume({ onItemClick }: Props) {
    const {authenticator} = useContext(EmbyCtx);
    const [loadingResumeItems, setLoadingResumeItems] = useState<boolean>(true);
    const [resumeItems, setResumeItems] = useState<ItemI[]>([]);
    const emby = useMemo(() => {
        try {
            return authenticator.getEmby();
        } catch (e) {
            return null;
        }
    }, [authenticator]);

    useEffect(() => {
        if (emby) {
            emby.getResumeItems()
                .then(resume => {
                    setLoadingResumeItems(false);
                    setResumeItems(resume.Items);
                })
                .catch(err => {
                    notification.error({
                        message: 'Could not load resume items',
                        description: err.toString()
                    });
                });
        }
    }, [emby]);

    const handleItemClick = (itemId: string) => {
        if (onItemClick) {
            onItemClick(itemId);
        }
    }

    if (!emby) {
        return <Redirect to="/servers" />
    }
    return (
        <>
            <Typography.Title level={3}>
                Resume
            </Typography.Title>
            <div className={globalStyles.flexScrollContainer}>
                {
                    (loadingResumeItems)
                        ? <Spin />
                        : resumeItems.map(resume => {
                            if (resume.Type === 'Movie') {
                                return (
                                    <Item
                                        key={resume.Id}
                                        itemId={resume.Id}
                                        aspectRatio={1.7777777777777777}
                                        className={classNames(styles.resumeItem, globalStyles.flexScrollItem)}
                                        imageSrc={emby.getItemPrimaryImageUrl(resume, 'Banner')}
                                        primaryText={resume.Name}
                                        secondaryText={resume.ProductionYear.toString()}
                                        progress={resume.UserData.PlayedPercentage}
                                        onPlayClick={handleItemClick}
                                    />
                                );
                            }
                            if (resume.Type === 'Episode') {
                                return (
                                    <Item
                                        key={resume.Id}
                                        itemId={resume.Id}
                                        aspectRatio={1.7777777777777777}
                                        className={classNames(styles.resumeItem, globalStyles.flexScrollItem)}
                                        imageSrc={emby.getItemPrimaryImageUrl(resume, 'Banner')}
                                        primaryText={resume.SeriesName || ''}
                                        secondaryText={`S${resume.ParentIndexNumber}:E${resume.IndexNumber} - ${resume.Name}`}
                                        progress={resume.UserData.PlayedPercentage}
                                        onPlayClick={handleItemClick}
                                    />
                                )
                            }
                            return null;
                        })
                }
            </div>
        </>
    );
}
