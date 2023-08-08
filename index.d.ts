declare module 'APlayer' {
    export class Bar {

    }
    export class Controller {

    }
    export class Events {

    }
    export type Icons = {
        play: any;
        pause: any;
        volumeUp: any;
        volumeDown: any;
        volumeOff: any;
        orderRandom: any;
        orderList: any;
        menu: any;
        loopAll: any;
        loopOne: any;
        loopNone: any;
        loading: any;
        right: any;
        skip: any;
        lrc: any;
    }

    export class List {

    }
    export class Lrc {

    }
    export default (options): Record<string, any> => ({})

    export class APlayer {
        constructor(options: {
            container: HTMLElement | null,
            fixed: boolean
            mini: boolean,
            autoplay: boolean,
            theme: string,
            loop: 'all' | 'one' | 'none',
            order: 'list' | 'random',
            preload: 'auto' | 'metadata' | 'none',
            volume: number,
            mutex: boolean,
            lrcType: number,
            listFolded: boolean,
            listMaxHeight: string,
            storageName: string,
            audio: Array<any> | Record<string, any>
        }): Record<string, any>
    }
    export class Storage {

    }
    export class Template {

    }
    export class Timer {

    }

    export type utils = {
        secondToTime: (second: number) => string,
        isMobile: boolean,
        storage: {
            set: (key: any, value: any) => void
            get: (key: any) => string | null
        };
        nameMap: {
            dragStart: string;
            dragMove: string;
            dragEnd: string;
        };
        randomOrder: (length: any) => any;
    }

}