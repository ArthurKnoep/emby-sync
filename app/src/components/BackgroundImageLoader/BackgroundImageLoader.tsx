import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import styles from './BackgroundImageLoader.module.scss';

interface Props {
    src: string
    children?: ReactNode
}

export function BackgroundImageLoader({src, children}: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const imageLoaded = useCallback(() => {
        setIsLoading(false);
    }, [setIsLoading]);

    useEffect(() => {
        setIsLoading(true);
        const i = new Image();
        i.addEventListener('load', imageLoaded);
        i.src = src;
        return () => {
            i.removeEventListener('load', imageLoaded);
        }
    }, [src, imageLoaded, setIsLoading]);

    return (
        <div
            className={classNames({
                [styles.container]: true,
                [styles.loaded]: !isLoading
            })}
            style={{backgroundImage: `url(${src})`}}
        >
            {children}
        </div>
    );
}
