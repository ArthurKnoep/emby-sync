import HLS from 'hls.js';
import { Emby } from './emby';
import { Context } from './playerContext';

enum PlayMode {
    Direct,
    Transcode
}

export class Player {
    private hls: HLS;
    private mode?: PlayMode;
    private emby: Emby;
    private videoElement?: HTMLVideoElement;
    private temporaryCallback?: () => void;

    constructor(emby: Emby) {
        this.hls = new HLS();
        this.emby = emby;
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