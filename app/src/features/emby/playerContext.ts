export interface Context {
    serverId: string
    itemId: string
    audioStreamIndex?: number
    subtitleStreamIndex?: number
}

export class PlayerContext {
    private ctx?: Context;

    setContext(ctx: Context) {
        this.ctx = ctx;
    }

    getContext(): Context | undefined {
        return this.ctx;
    }
}
