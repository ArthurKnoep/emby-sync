interface Context {
    serverId: string
    itemId: string
}

export class PlayerContext {
    private ctx?: Context;

    setContext(ctx: Context) {
        console.log(ctx);
        this.ctx = ctx;
    }

    getContext(): Context | undefined {
        return this.ctx;
    }
}
