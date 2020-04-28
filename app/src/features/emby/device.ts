import { v4 as uuid } from 'uuid';

const DEVICE_ID = 'emby_sync_device_id';

export class Device {
    private readonly deviceId: string;

    constructor() {
        const deviceId = window.localStorage.getItem(DEVICE_ID);
        if (!deviceId) {
            this.deviceId = uuid();
            window.localStorage.setItem(DEVICE_ID, this.deviceId);
        } else {
            this.deviceId = deviceId;
        }
    }

    getDeviceId(): string {
        return this.deviceId;
    }

    getDeviceName(): string {
        const nAgt = navigator.userAgent;
        let browserName = navigator.appName;
        let nameOffset, verOffset;

        // In Opera 15+, the true version is after "OPR/"
        if ((verOffset = nAgt.indexOf("OPR/")) !== -1) {
            browserName = "Opera";
        }
        // In older Opera, the true version is after "Opera" or after "Version"
        else if ((verOffset = nAgt.indexOf("Opera")) !== -1) {
            browserName = "Opera";
        }
        // In MSIE, the true version is after "MSIE" in userAgent
        else if ((verOffset = nAgt.indexOf("MSIE")) !== -1) {
            browserName = "Microsoft Internet Explorer";
        }
        // In Chrome, the true version is after "Chrome"
        else if ((verOffset=nAgt.indexOf("Chrome")) !== -1) {
            browserName = "Chrome";
        }
        // In Safari, the true version is after "Safari" or after "Version"
        else if ((verOffset=nAgt.indexOf("Safari")) !== -1) {
            browserName = "Safari";
        }
        // In Firefox, the true version is after "Firefox"
        else if ((verOffset=nAgt.indexOf("Firefox")) !== -1) {
            browserName = "Firefox";
        }
        // In most other browsers, "name/version" is at the end of userAgent
        else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
            (verOffset=nAgt.lastIndexOf('/')) )
        {
            browserName = nAgt.substring(nameOffset,verOffset);
            if (browserName.toLowerCase() === browserName.toUpperCase()) {
                browserName = navigator.appName;
            }
        }
        return browserName
    }
}
