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
}
