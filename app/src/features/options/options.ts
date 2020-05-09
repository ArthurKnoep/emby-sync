import { alpha2ToAlpha3B, registerLocale } from '@cospired/i18n-iso-languages';

registerLocale(require("@cospired/i18n-iso-languages/langs/en.json"));

enum SubType {
    None,
    Forced,
    Complete
}

interface Opt {
    defaultAudioLanguage: string
    defaultSubLanguage: string
    defaultSubType: SubType
    maxBitrate: number
}

const OPTIONS_KEY = "emby_sync_options";

export class Options {
    private opt: Opt;

    constructor() {
        const localOpt = window.localStorage.getItem(OPTIONS_KEY);
        if (localOpt) {
            try {
                this.opt = JSON.parse(localOpt);
            } catch (e) {
                this.opt = Options.createDefaultConfig();
                window.localStorage.setItem(OPTIONS_KEY, JSON.stringify(this.opt));
            }
        } else {
            this.opt = Options.createDefaultConfig();
            window.localStorage.setItem(OPTIONS_KEY, JSON.stringify(this.opt));
        }
        console.log(this.opt);
    }

    private static createDefaultConfig(): Opt {
        const language = window?.navigator?.language;
        let defaultLanguage;
        if (language) {
            defaultLanguage = alpha2ToAlpha3B(language.split('-')[0]) || 'eng';
        } else {
            defaultLanguage = 'eng';
        }
        return {
            defaultAudioLanguage: defaultLanguage,
            defaultSubLanguage: defaultLanguage,
            defaultSubType: SubType.Forced,
            maxBitrate: 30 * 1000 * 1000
        };
    }

    setOpt(opt: Opt) {
        this.opt = opt;
    }

    getOpt(): Opt {
        return this.opt;
    }
}
