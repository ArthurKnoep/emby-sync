import axios, { AxiosInstance } from 'axios';
import { Device } from './device';
import { InfoI, LoadLibrariesI, LoadItemsI, ItemI, FullItemI, PlaybackInfoI } from './interface';
import * as path from 'path';

export const APPLICATION_NAME = 'Emby Sync';
export const APPLICATION_VERSION = '0.0.1';

export class Emby {
    private requester: AxiosInstance;
    private readonly device: Device;
    private readonly baseUrl: string;
    private readonly localUserId: string;
    private readonly serverName: string;
    private readonly serverId: string;
    private libraries: LoadLibrariesI | null;

    constructor(baseUrl: string, connectToken: string, localUserId: string, serverName: string, serverId: string) {
        this.device = new Device();
        this.requester = axios.create({
            baseURL: baseUrl,
            headers: {
                "X-Emby-Client": APPLICATION_NAME,
                "X-Emby-Client-Version": APPLICATION_VERSION,
                "X-Emby-Device-Id": this.device.getDeviceId(),
                "X-Emby-Device-Name": this.device.getDeviceName(),
                "X-Emby-Token": connectToken,
            }
        });
        this.baseUrl = baseUrl;
        this.localUserId = localUserId;
        this.serverName = serverName;
        this.serverId = serverId;
        this.libraries = null;
    }

    async systemInfo(): Promise<InfoI> {
        const { data: info } = await this.requester.get("/emby/System/Info");
        return info as InfoI;
    }

    async getLibraries(): Promise<LoadLibrariesI> {
        if (this.libraries) {
            console.log('libraries from cache');
            return this.libraries;
        }
        const { data: libraries } = await this.requester.get(`/Users/${this.localUserId}/Views`);
        this.libraries = libraries;
        return libraries as LoadLibrariesI;
    }

    async getResumeItems(): Promise<LoadItemsI> {
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
        return resumeItems as LoadItemsI;
    }

    getItemPrimaryImageUrl(item: ItemI, mode: 'Poster' | 'Banner'): string {
        let id, type;
        if (mode === 'Banner') {
            if (item.ParentThumbItemId) {
                id = item.ParentThumbItemId;
                type = "Thumb";
            } else if (item.ParentBackdropItemId) {
                id = item.ParentBackdropItemId;
                type = "Backdrop";
            } else {
                id = item.Id;
                type = "Backdrop";
            }
        } else {
            id = item.Id;
            type = "Primary";
        }
        const u = new URL(this.baseUrl);
        const param = new URLSearchParams();
        u.pathname = path.join(u.pathname, `/Items/${id}/Images/${type}`);
        param.set('maxWidth', '347');
        param.set('quality', '70');
        u.search = param.toString();
        return u.toString();
    }

    appendServerBaseUrl(p: string): string {
        return this.baseUrl + p;
    }

    async getNextUp(): Promise<LoadItemsI> {
        const { data: nextUpItems } = await this.requester.get('/Shows/NextUp', {
            params: {
                Limit: 20,
                Fields: "PrimaryImageAspectRatio,SeriesInfo,DateCreated,BasicSyncInfo",
                UserId: this.localUserId,
                ImageTypeLimit: 1,
                EnableImageTypes: "Primary,Backdrop,Banner,Thumb"
            }
        });
        return nextUpItems as LoadItemsI;
    }

    async getLatestItemFromLibrary(libraryId: string): Promise<ItemI[]> {
        const { data: latest } = await this.requester.get(`/Users/${this.localUserId}/Items/Latest`, {
            params: {
                Limit: 20,
                Fields: "PrimaryImageAspectRatio,BasicSyncInfo,ProductionYear,Status,EndDate",
                ImageTypeLimit: 1,
                EnableImageTypes: "Primary,Backdrop,Thumb",
                ParentId: libraryId
            }
        });
        return latest as ItemI[];
    }

    async playbackInfo(itemId: string, audioStreamIndex: number, subtitleStreamIndex: number, mediaSourceId: string): Promise<PlaybackInfoI> {
        const { data: playbackInfo } = await this.requester.post(`/Items/${itemId}/PlaybackInfo`, this.device.getDeviceProfile(), {
            params: {
                UserId: this.localUserId,
                StartTimeTicks: 0,
                IsPlayback: true,
                AutoOpenLiveStream: true,
                AudioStreamIndex: audioStreamIndex,
                SubtitleStreamIndex: subtitleStreamIndex,
                MediaSourceId: mediaSourceId,
                MaxStreamingBitrate: 10000000
            }
        });
        return playbackInfo as PlaybackInfoI;
    }

    async getItem(itemId: string): Promise<FullItemI> {
        const { data: item } = await this.requester.get(`/Users/${this.localUserId}/Items/${itemId}`);
        return item as FullItemI;
    }


    private async queryBitrateTest(size: number): Promise<number> {
        const startDate = new Date().getTime();
        await this.requester.get('/Playback/BitrateTest', {
            params: {
                Size: size
            }
        });
        return new Date().getTime() - startDate;
    }

    /**
     * Auto detect the bitrate of the user with the server
     * @return Bitrate in bit per second
     */
    async bitrateTest(): Promise<number> {
        let timeTaken;
        let size = 1000 * 1000;
        do {
            timeTaken = await this.queryBitrateTest(size);
            if (timeTaken <= 4000) {
                size += 10 * 1000 * 1000;
            }
        } while (timeTaken <= 4000);
        return Math.round((size * 8) / (timeTaken / 1000));
    }

    getServerName(): string {
        return this.serverName;
    }

    getServerId(): string {
        return this.serverId;
    }
}
