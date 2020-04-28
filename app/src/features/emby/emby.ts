import axios, { AxiosInstance } from 'axios';
import { Device } from './device';
import { InfoI, LoadLibrariesI } from './interface';

export const APPLICATION_NAME = 'Emby Sync';
export const APPLICATION_VERSION = '0.0.1';

export class Emby {
    private requester: AxiosInstance;
    private localUserId: string;
    private readonly serverName: string;

    constructor(baseUrl: string, connectToken: string, localUserId: string, serverName: string) {
        console.log('construct emby with', baseUrl, connectToken, localUserId);
        const device = new Device();
        this.requester = axios.create({
            baseURL: baseUrl,
            headers: {
                "X-Emby-Client": APPLICATION_NAME,
                "X-Emby-Client-Version": APPLICATION_VERSION,
                "X-Emby-Device-Id": device.getDeviceId(),
                "X-Emby-Device-Name": device.getDeviceName(),
                "X-Emby-Token": connectToken,
            }
        });
        this.localUserId = localUserId;
        this.serverName = serverName;
    }

    async systemInfo(): Promise<InfoI> {
        const { data: info } = await this.requester.get("/emby/System/Info");
        return info as InfoI;
    }

    async getLibraries(): Promise<LoadLibrariesI> {
        const { data: libraries } = await this.requester.get(`/Users/${this.localUserId}/Views`);
        return libraries as LoadLibrariesI;
    }

    getServerName(): string {
        return this.serverName;
    }
}
