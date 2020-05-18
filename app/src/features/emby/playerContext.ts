import { FullItemI } from './interface';

export interface Context {
    serverId: string
    itemId: string
    audioStreamIndex?: number
    subtitleStreamIndex?: number
}

export class PlayerContext {
    private ctx?: Context;
    private nbUserToWait: number;

    constructor() {
        this.nbUserToWait = 0;
    }

    setContext(ctx: Context) {
        this.ctx = ctx;
    }

    getContext(): Context | undefined {
        return this.ctx;
    }

    setNbUserToWait(count: number) {
        this.nbUserToWait = count;
    }

    getNbUserToWait(): number {
        return this.nbUserToWait;
    }

    static getAudioTrackIdx(item: FullItemI, ctx: Context, defaultAudio: string): number {
        if (!item.MediaSources || item.MediaSources.length === 0) {
            return -1;
        }
        if (ctx.audioStreamIndex && item.MediaSources[0].MediaStreams[ctx.audioStreamIndex]) {
            if (item.MediaSources[0].MediaStreams[ctx.audioStreamIndex].Type === 'Audio') {
                return ctx.audioStreamIndex;
            }
            return -1;
        }
        let defaultStreamIdx = -1;
        for (let i = 0; item.MediaSources[0].MediaStreams[i]; i++) {
            const stream = item.MediaSources[0].MediaStreams[i];
            if (stream.Type === 'Audio' && defaultStreamIdx === -1) {
                defaultStreamIdx = i;
            }
            if (stream.Type === 'Audio' && stream.Language === defaultAudio) {
                return i;
            }
        }
        return defaultStreamIdx;
    }
}
