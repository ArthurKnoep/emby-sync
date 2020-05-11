import HLS from 'hls.js';
import { Emby } from './emby';
import { Options } from '../options';
import { Context } from './playerContext';
import { OnLoadedI } from '../socket/interface';

enum PlayMode {
    Direct,
    Transcode
}

export class Player {
    private readonly hls: HLS;
    private readonly options: Options;
    private mode?: PlayMode;
    private emby: Emby;
    private videoElement?: HTMLVideoElement;
    private temporaryCallback?: () => void;
    private waitingForUser: { count: number, list: OnLoadedI[] };

    constructor(emby: Emby, options: Options) {
        this.hls = new HLS();
        this.emby = emby;
        this.options = options;
        this.waitingForUser = {count: 0, list: []};
    }

    attachMedia(videoElement: HTMLVideoElement) {
        this.hls.attachMedia(videoElement);
        this.videoElement = videoElement;
    }

    private loadedVideoElementCB(cb: () => void) {
        return () => {
            if (!this.videoElement || !this.temporaryCallback) {
                return;
            }
            this.videoElement.removeEventListener('loadeddata', this.temporaryCallback);
            cb();
        }
    }

    startWaitingForUser(count: number) {
        this.waitingForUser = {count, list: []};
    }

    userFinishedLoaded(loaded: OnLoadedI): boolean {
        for (const l of this.waitingForUser.list) {
            if (l.uuid === loaded.uuid) {
                return false;
            }
        }
        this.waitingForUser.list.push(loaded);
        return true;
    }

    hasWaitedForEveryone(): boolean {
        return (this.waitingForUser.count === 0 || this.waitingForUser.count === this.waitingForUser.list.length);
    }

    async initPlay(playerCtx: Context, cbVideoLoaded: () => void) {
        if (!this.videoElement) {
            throw new Error("No video attached");
        }
        const item = await this.emby.getItem(playerCtx.itemId);
        if (item.MediaSources.length === 0) {
            throw new Error("No media sources");
        }
        const mediaId = item.MediaSources[0].Id;
        const playbackInfo = await this.emby.playbackInfo(playerCtx.itemId, 1, 3, mediaId);
        if (playbackInfo.MediaSources.length > 0) {
            if (playbackInfo.MediaSources[0].SupportsDirectStream) {
                this.mode = PlayMode.Direct;
                this.temporaryCallback = this.loadedVideoElementCB(cbVideoLoaded);
                this.videoElement.addEventListener('loadeddata', this.temporaryCallback);
                this.videoElement.src = this.emby.appendServerBaseUrl(playbackInfo.MediaSources[0].DirectStreamUrl);
            } else if (playbackInfo.MediaSources[0].SupportsTranscoding) {
                this.mode = PlayMode.Transcode;
                this.hls.loadSource(this.emby.appendServerBaseUrl(playbackInfo.MediaSources[0].TranscodingUrl));
                this.hls.once(HLS.Events.BUFFER_APPENDED, cbVideoLoaded);
            }
        }
    }
}
