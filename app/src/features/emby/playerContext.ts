import { FullItemI } from './interface';
import { Opt, SubType } from '../options';

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

    static getAudioTrackIdx(item: FullItemI, ctx: Context, options: Opt): number {
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
        for (const stream of item.MediaSources[0].MediaStreams) {
            if (stream.Type === 'Audio' && defaultStreamIdx === -1) {
                defaultStreamIdx = stream.Index;
            }
            if (stream.Type === 'Audio' && stream.Language === options.defaultAudioLanguage) {
                return stream.Index;
            }
        }
        return defaultStreamIdx;
    }

    static getSubtitleTrackIdx(item: FullItemI, ctx: Context, options: Opt): number {
        if (!item.MediaSources || item.MediaSources.length === 0) {
            return -1;
        }
        if (ctx.subtitleStreamIndex && item.MediaSources[0].MediaStreams[ctx.subtitleStreamIndex]) {
            if (item.MediaSources[0].MediaStreams[ctx.subtitleStreamIndex].Type === 'Subtitle') {
                return ctx.subtitleStreamIndex;
            }
            return -1;
        }
        if (options.defaultSubType === SubType.NONE) {
            return -1;
        }
        for (const stream of item.MediaSources[0].MediaStreams) {
            if (stream.Type === 'Subtitle' && stream.Language === options.defaultSubLanguage) {
                if ((options.defaultSubType === SubType.FORCED && stream.IsForced) || options.defaultSubType === SubType.COMPLETE) {
                    return stream.Index;
                }
            }
        }
        return -1;
    }
}
