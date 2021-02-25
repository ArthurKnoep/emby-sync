import { Emby, Player as EmbyPlayer } from '../emby/';
import { Socket } from '../socket/socket';
import { Options } from '../options';
import { Context as PlayerContext } from '../emby/playerContext';
import { OnLoadedI } from '../socket/interface';

export class Player {
    private embyPlayer: EmbyPlayer;
    private videoElement?: HTMLVideoElement;
    private socket: Socket;
    private options: Options;
    private progressReportIntervalRef: number;
    private readonly progressReportIntervalDuration: number;

    constructor(emby: Emby, socket: Socket, options: Options) {
        this.embyPlayer = new EmbyPlayer(emby, options, socket.getIsMaster() || false);
        this.socket = socket;
        this.options = options;
        this.progressReportIntervalRef = 0;
        this.progressReportIntervalDuration = 10 * 1000;
    }

    attachVideoElement(videoElement: HTMLVideoElement) {
        this.videoElement = videoElement;
        this.embyPlayer.attachMedia(videoElement);
    }

    private handleNonMasterLoaded = async (msg: OnLoadedI) => {
        this.embyPlayer.userFinishedLoaded(msg);
        if (this.embyPlayer.hasWaitedForEveryone()) {
            this.socket.getSocket().off('play:onloaded', this.handleNonMasterLoaded);
            this.startPlayback().catch(() => {});
        }
    }

    private handleMasterPlaybackStarted = async () => {
        this.socket.getSocket().off('play:started', this.handleMasterPlaybackStarted);
        this.startPlayback().catch(() => {});
    };

    async initPlayback(playerCtx: PlayerContext) {
        const userInRoom = await this.socket.listUserInRoom();
        if (this.socket.getIsMaster()) {
            this.embyPlayer.startWaitingForUser(userInRoom.data.users.length - 1);
            this.socket.getSocket().on('play:onloaded', this.handleNonMasterLoaded);
        }
        await this.embyPlayer.initPlay(playerCtx, () => {
            if (!this.socket.getIsMaster()) {
                this.socket.getSocket().emit('play:loaded');
                this.socket.getSocket().on('play:started', this.handleMasterPlaybackStarted);
            } else {
                if (this.embyPlayer.hasWaitedForEveryone()) {
                    this.startPlayback().catch(() => {});
                }
            }
        });
    }

    private handlePlaybackReport = async () => {
        console.log('is reporting');
        try {
            await this.embyPlayer.reportProgress();
        } catch (e) {
            console.error('Unable to report progress', e);
        }
    }

    private async startPlayback() {
        if (this.socket.getIsMaster()) {
            try {
                await this.socket.playStarted();
            } catch (e) {}
        }
        try {
            await this.videoElement?.play();
        } catch (e) {
            console.log('Could not autostart play, retry with mute');
            if (this.videoElement !== undefined) {
                this.videoElement.muted = true;
            }
            try {
                await this.videoElement?.play();
            } catch (e) {
                console.log('Could not autostart play, need to be start at the end');
            }
        }
        try {
            await this.embyPlayer.reportStartPlay();
            window.clearInterval(this.progressReportIntervalRef);
            this.progressReportIntervalRef = window.setInterval(this.handlePlaybackReport, this.progressReportIntervalDuration);
        } catch (e) {
            console.error('could not report start play');
        }
    }

    stopPlayback() {
        if (this.socket.getIsMaster()) {
            this.socket.getSocket().off('play:onloaded', this.handleNonMasterLoaded);
        } else {
            this.socket.getSocket().off('play:started', this.handleMasterPlaybackStarted);
        }
        window.clearInterval(this.progressReportIntervalRef);
        this.embyPlayer.stop().catch(() => {});
        this.socket.getSocket().emit('play:stop');
    }
}
