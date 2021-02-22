import React from 'react';
import { Badge, Typography } from 'antd';
import { CheckCircleFilled, PlayCircleFilled } from '@ant-design/icons';
import classNames from 'classnames';
import { BackgroundImageLoader } from '../../BackgroundImageLoader';
import styles from './Item.module.scss';

interface Props {
    itemId: string
    aspectRatio: number
    width?: number
    className?: string
    imageSrc?: string
    primaryText: string
    secondaryText?: string
    progress?: number
    hasBeenPlayed?: boolean
    childrenElementCount?: number
    onPlayClick?: (itemId: string) => void
}

export function Item(
    {
        itemId,
        aspectRatio,
        width = 300,
        className,
        imageSrc,
        primaryText,
        secondaryText,
        progress,
        hasBeenPlayed,
        childrenElementCount,
        onPlayClick
    }: Props) {
    const heightPercentage = (1 / aspectRatio) * 100;

    const handleClick = () => {
        if (onPlayClick) {
            onPlayClick(itemId);
        }
    }

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
                    <div className={styles.background} />
                    <div className={styles.playBtnContainer} onClick={handleClick}>
                        <PlayCircleFilled />
                    </div>
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
