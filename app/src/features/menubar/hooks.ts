import { Event, MenubarConfiguration } from './menubar';
import { useContext, useEffect, useState } from 'react';
import { MenubarCtx } from './menubarCtx';
import { useHistory } from 'react-router-dom';

export function useRedirectBackButton(redirectTo: string) {
    const { menubarController } = useContext(MenubarCtx);
    const history = useHistory();
    useEffect(() => {
        menubarController.setEnableBackButton(true);
        const handleBackClick = () => {
            history.push(redirectTo);
        };
        menubarController.addListener(Event.BACK_BUTTON_CLICK, handleBackClick);
        return () => {
            menubarController.removeListener(Event.BACK_BUTTON_CLICK, handleBackClick);
        };
    }, [menubarController, history, redirectTo]);
}

export function useMenubarConfiguration(): MenubarConfiguration {
    const { menubarController } = useContext(MenubarCtx);
    const [menubarConfig, setMenubarConfig] = useState<MenubarConfiguration>(menubarController.getConfiguration());

    const handleMenubarConfigChange = (evt: MenubarConfiguration) => {
        setMenubarConfig(evt);
    };

    useEffect(() => {
        menubarController.addListener(Event.CONFIG_CHANGE, handleMenubarConfigChange);
        return () => {
            menubarController.removeListener(Event.CONFIG_CHANGE, handleMenubarConfigChange);
        };
    });
    return menubarConfig;
}
