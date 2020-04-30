import axios, { AxiosInstance } from 'axios';
import { Device } from './device';
import { InfoI, LoadLibrariesI, LoadResumeItemI } from './interface';
import * as path from 'path';

export const APPLICATION_NAME = 'Emby Sync';
export const APPLICATION_VERSION = '0.0.1';

export class Emby {
    private requester: AxiosInstance;
    private readonly baseUrl: string;
    private readonly localUserId: string;
    private readonly serverName: string;

    constructor(baseUrl: string, connectToken: string, localUserId: string, serverName: string) {
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
        this.baseUrl = baseUrl;
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

    async getResumeItems(): Promise<LoadResumeItemI> {
        const { data: resumeItems } = await this.requester.get(`/Users/${this.localUserId}/Items/Resume`, {
            params: {
                Limit: 10,
                Recursive: true,
                Fields: "PrimaryImageAspectRatio,BasicSyncInfo,ProductionYear",
                ImageTypeLimit: 1,
                EnableImageTypes: "Primary,Backdrop,Thumb",
                MediaTypes: "Video"
            }
        });
        return resumeItems as LoadResumeItemI;
    }

    getItemPrimaryImageUrl(itemId: string): string {
        const u = new URL(this.baseUrl);
        const param = new URLSearchParams();
        u.pathname = path.join(u.pathname, `/Items/${itemId}/Images/Backdrop`);
        param.set('maxWidth', '347');
        param.set('quality', '70');
        u.search = param.toString();
        return u.toString();
    }

    getServerName(): string {
        return this.serverName;
    }
}
