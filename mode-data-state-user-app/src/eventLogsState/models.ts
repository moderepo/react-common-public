import {
    EventLogData,
} from '@moderepo/mode-apis';


export interface EventLogsState {
    readonly eventLogDataByHomeIdByLogResourcePathBySearchParams: {
        readonly [homeId: number]: {
            readonly [logResourcePath: string]: {
                readonly [searchParams: string]: EventLogData | undefined;
            } | undefined;
        } | undefined;
    };
}


export const initialEventLogsState: EventLogsState = {
    eventLogDataByHomeIdByLogResourcePathBySearchParams: {
    },
};
