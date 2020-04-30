import React, { useContext, useEffect, useMemo, useState } from 'react';
import { notification, Spin, Typography } from 'antd';
import classNames from 'classnames';
import { Image } from "react-image-and-background-image-fade";
import { EmbyCtx } from '../../../features/emby/embyCtx';
import { ResumeItemI } from '../../../features/emby/interface';
import globalStyles from '../Server.module.scss';
import styles from './Resume.module.scss';

export function Resume() {
    const {authenticator} = useContext(EmbyCtx);
    const [loadingResumeItems, setLoadingResumeItems] = useState<boolean>(true);
    const [resumeItems, setResumeItems] = useState<ResumeItemI[]>([]);
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

    return (
        <>
            <Typography.Title level={3}>
                Resume
            </Typography.Title>
            <div className={classNames(globalStyles.flexScrollContainer, styles.resumeContainer)}>
                {
                    (loadingResumeItems)
                        ? <Spin />
                        : resumeItems.map(resume => (
                            <div key={resume.Id} className={classNames(globalStyles.flexScrollItem, styles.resumeItem)}>
                                <div className={styles.imageContainer}>
                                    <div className={styles.image}>
                                        <Img src={emby?.getItemPrimaryImageUrl(resume.Id)}/>
                                    </div>
                                </div>
                                <p className={styles.name}>{resume.Name}</p>
                            </div>
                        ))
                }
            </div>
        </>
    );
}
