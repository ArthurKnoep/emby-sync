import EventEmitter from 'events';

export const Event = {
    CONFIG_CHANGE: 'CONFIG_CHANGE',
    BACK_BUTTON_CLICK: 'BACK_BUTTON_CLICK',
}

export interface MenubarConfiguration {
    enableBackButton: boolean
}

export class Menubar extends EventEmitter {
    private configuration: MenubarConfiguration;

    constructor() {
        super();
        this.configuration = {
            enableBackButton: false,
        };
    }

    getConfiguration(): MenubarConfiguration {
        return this.configuration;
    }

    setEnableBackButton(val: boolean) {
        this.configuration = {
            ...this.configuration,
            enableBackButton: val,
        };
        this.emit(Event.CONFIG_CHANGE, this.configuration);
    }
}
