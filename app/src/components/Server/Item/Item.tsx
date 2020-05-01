import React from 'react';
import classNames from 'classnames';
import { Typography } from 'antd';
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
}

export function Item({aspectRatio, width = 300, className, imageSrc, primaryText, secondaryText, progress}: Props) {
    const heightPercentage = (1/aspectRatio) * 100;
    return (
        <div className={classNames(className)}>
            <div className={styles.imageContainer} style={{paddingBottom: `${heightPercentage}%`, width}}>
                <div className={styles.image}>
                    {
                        (imageSrc)
                        && <BackgroundImageLoader src={imageSrc} />
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
                        <Typography.Paragraph type="secondary" className={styles.secondaryText}>{secondaryText}</Typography.Paragraph>
                    )
                }
            </div>
        </div>
    );
}
