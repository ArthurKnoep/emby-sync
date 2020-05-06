import React from 'react';
import { Badge, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import classNames from 'classnames';
import { BackgroundImageLoader } from '../../BackgroundImageLoader';
import styles from './Item.module.scss';

interface Props {
    aspectRatio: number
    width?: number
    className?: string
    imageSrc?: string
    primaryText: string
    secondaryText?: string
    progress?: number
    hasBeenPlayed?: boolean
    childrenElementCount?: number
}

export function Item(
    {
        aspectRatio,
        width = 300,
        className,
        imageSrc,
        primaryText,
        secondaryText,
        progress,
        hasBeenPlayed,
        childrenElementCount
    }: Props) {
    const heightPercentage = (1 / aspectRatio) * 100;
    return (
        <div className={classNames(className)}>
            <div className={styles.imageContainer} style={{paddingBottom: `${heightPercentage}%`, width}}>
                <div className={styles.image}>
                    {
                        (imageSrc)
                        && <BackgroundImageLoader src={imageSrc} />
                    }
                    {
                        (childrenElementCount)
                        && (
                            <div className={styles.badgeContainer}>
                                <Badge count={childrenElementCount} overflowCount={999} className={styles.badge} />
                            </div>
                        )
                    }
                    {
                        (hasBeenPlayed)
                        && (
                            <div className={styles.badgeContainer}>
                                <CheckCircleFilled className={styles.hasBeenPlayed} />
                            </div>
                        )
                    }
                    {
                        (progress)
                        && (
                            <div className={styles.progressContainer}>
                                <div className={styles.progress} style={{width: `${progress}%`}} />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className={styles.subText} style={{width}}>
                <Typography.Paragraph className={styles.primaryText}>{primaryText}</Typography.Paragraph>
                {
                    (secondaryText)
                    && (
                        <Typography.Paragraph type="secondary"
                                              className={styles.secondaryText}>{secondaryText}</Typography.Paragraph>
                    )
                }
            </div>
        </div>
    );
}
