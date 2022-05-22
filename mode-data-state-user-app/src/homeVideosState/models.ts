import {
    VideoInfo,
} from '@moderepo/mode-apis';



export interface HomeVideosState {
    readonly videosByThumbnailByHomeIdBySmartModuleId: {
        readonly [homeId: number]: {
            readonly [smartModuleId: string]: {
                readonly [thumbnail: string]: VideoInfo | undefined;
            } | undefined;
        } | undefined;
    }

    readonly videoKeysByHomeIdBySmartModuleIdBySearchParams: {
        readonly [homeId: number]: {
            readonly [smartModuleId: string]: {
                readonly [searchParams: string]: readonly string[] | undefined;
            } | undefined;
        } | undefined;
    };
}


export const initialHomeVideosState: HomeVideosState = {
    videosByThumbnailByHomeIdBySmartModuleId: {
    },
    videoKeysByHomeIdBySmartModuleIdBySearchParams: {
    },
};
