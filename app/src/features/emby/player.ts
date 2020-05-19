import HLS from 'hls.js';
import { Emby } from './emby';
import { Options } from '../options';
import { Context, PlayerContext } from './playerContext';
import { OnLoadedI } from '../socket/interface';
import { ReportPlayingRequestI } from './interface';

enum PlayMode {
    Direct,
    Transcode
}

interface Session {
    SessionId: string;
    PlayMode: PlayMode;
    AudioStreamIndex: number;
    SubtitleStreamIndex: number;
    MaxBitrate: number;
    ItemId: string;
    MediaSourceId: string;
}

export class Player {
    private readonly hls: HLS;
    private readonly options: Options;
    private emby: Emby;
    private videoElement?: HTMLVideoElement;
    private temporaryCallback?: () => void;
    private session?: Session;
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

    private generateProgressReport(): ReportPlayingRequestI {
        if (!this.videoElement) {
            throw new Error('video element not attached');
        }
        if (!this.session) {
            throw new Error('no session');
        }
        return {
            AudioStreamIndex: this.session.AudioStreamIndex,
            BufferedRanges: [{end: 0, start: 0}],
            CanSeek: false,
            IsMuted: this.videoElement.muted,
            IsPaused: this.videoElement.paused,
            ItemId: this.session.ItemId,
            MaxStreamingBitrate: this.session.MaxBitrate,
            MediaSourceId: this.session.MediaSourceId,
            PlayMethod: this.session.PlayMode === PlayMode.Transcode ? "Transcode": "DirectPlay",
            PlaySessionId: this.session.SessionId,
            PlaybackStartTimeTicks: 0,
            PositionTicks: this.videoElement.currentTime * 1000000,
            RepeatMode: 'RepeatNone',
            SubtitleStreamIndex: this.session.SubtitleStreamIndex,
            VolumeLevel: this.videoElement.volume * 100
        };
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
        const audioStreamIndex = PlayerContext.getAudioTrackIdx(item, playerCtx, this.options.getOpt());
        if (audioStreamIndex === -1) {
            throw new Error("Invalid audio stream");
        }
        const subtitleStreamIndex = PlayerContext.getSubtitleTrackIdx(item, playerCtx, this.options.getOpt());
        const mediaId = item.MediaSources[0].Id;
        const playbackInfo = await this.emby.playbackInfo(playerCtx.itemId, audioStreamIndex, subtitleStreamIndex, mediaId, this.options.getOpt().maxBitrate);
        if (playbackInfo.MediaSources.length > 0) {
            let mode;
            if (playbackInfo.MediaSources[0].SupportsDirectStream) {
                mode = PlayMode.Direct;
                this.temporaryCallback = this.loadedVideoElementCB(cbVideoLoaded);
                this.videoElement.addEventListener('loadeddata', this.temporaryCallback);
                this.videoElement.src = this.emby.appendServerBaseUrl(playbackInfo.MediaSources[0].DirectStreamUrl);
            } else if (playbackInfo.MediaSources[0].SupportsTranscoding) {
                mode = PlayMode.Transcode;
                this.hls.loadSource(this.emby.appendServerBaseUrl(playbackInfo.MediaSources[0].TranscodingUrl));
                this.hls.once(HLS.Events.BUFFER_APPENDED, cbVideoLoaded);
            }
            this.session = {
                AudioStreamIndex: audioStreamIndex,
                MaxBitrate: this.options.getOpt().maxBitrate,
                MediaSourceId: mediaId,
                PlayMode: mode || PlayMode.Direct,
                SessionId: playbackInfo.PlaySessionId,
                SubtitleStreamIndex: subtitleStreamIndex,
                ItemId: playerCtx.itemId
            };
        }
    }
}
