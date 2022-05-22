import {
    Home, PaginationDataSet,
} from '@moderepo/mode-apis';


export interface HomesState {
    readonly homesById: {
        [homeId: number]: Home | undefined;
    };
    readonly homeIdsByUserId: {
        readonly [userId: number]: {
            readonly [searchParams: string]: PaginationDataSet<number> | undefined;
        } | undefined;
    };
    readonly homeIdsByProjectId: {
        readonly [projectId: number]: {
            readonly [searchParams: string]: PaginationDataSet<number> | undefined;
        } | undefined;
    };
}


export const initialHomesState: HomesState = {
    homesById: {
    },
    homeIdsByUserId: {
    },
    homeIdsByProjectId: {
    },
};
