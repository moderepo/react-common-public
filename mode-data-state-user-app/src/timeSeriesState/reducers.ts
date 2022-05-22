import {
    TimeSeriesCollectionInfo, TimeSeriesInfo,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import produce, {
    castDraft, Draft,
} from 'immer';
import {
    SetAllTimeSeriesCollectionInfoAction, SetAllTimeSeriesInfoAction, SetTimeSeriesCollectionDataAction, SetTimeSeriesCollectionInfoAction,
    SetTimeSeriesCollectionRangeAction, SetTimeSeriesCollectionRawDataAction, SetTimeSeriesDataAction, SetTimeSeriesInfoAction,
    SetTimeSeriesRangeAction, SetTimeSeriesRawDataAction, TimeSeriesActionType,
} from './actions';
import {
    TimeSeriesState,
} from './models';



const tsIdsByHomeIdByTSDBModuleIdReducer = (
    currentState: TimeSeriesState['tsIdsByHomeIdByTSDBModuleId'], action: BaseAction,
): TimeSeriesState['tsIdsByHomeIdByTSDBModuleId'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_ALL_TIME_SERIES_INFO:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetAllTimeSeriesInfoAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;

                // We only need to store the list of timeSeries' id but not the whole timeSeries info object. The objects will be stored
                // in the tsInfoByIdByHomeIdByTSDBModuleId state
                temp[actualAction.tsdbModuleId] = actualAction.timeSeries.map((timeSeriesInfo: TimeSeriesInfo) => {
                    return timeSeriesInfo.id;
                });
            });

        default:
            return currentState;
    }
};


const tsInfoByIdByHomeIdByTSDBModuleIdReducer = (
    currentState: TimeSeriesState['tsInfoByIdByHomeIdByTSDBModuleId'], action: BaseAction,
): TimeSeriesState['tsInfoByIdByHomeIdByTSDBModuleId'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_ALL_TIME_SERIES_INFO:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetAllTimeSeriesInfoAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;

                actualAction.timeSeries.forEach((timeSeriesInfo: TimeSeriesInfo) => {
                    temp2[timeSeriesInfo.id] = timeSeriesInfo;
                });
            });

        case TimeSeriesActionType.SET_TIME_SERIES_INFO:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetTimeSeriesInfoAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;
                
                temp2[actualAction.timeSeriesId] = castDraft(actualAction.timeSeries);
            });

        default:
            return currentState;
    }
};


const tsRangeByIdByHomeIdByTSDBModuleIdReducer = (
    currentState: TimeSeriesState['tsRangeByIdByHomeIdByTSDBModuleId'], action: BaseAction,
): TimeSeriesState['tsRangeByIdByHomeIdByTSDBModuleId'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_TIME_SERIES_RANGE:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetTimeSeriesRangeAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;

                temp2[actualAction.timeSeriesId] = castDraft(actualAction.range);
            });

        default:
            return currentState;
    }
};


const tsDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer = (
    currentState: TimeSeriesState['tsDataByIdByHomeIdByTSDBModuleIdBySearchParams'], action: BaseAction,
): TimeSeriesState['tsDataByIdByHomeIdByTSDBModuleIdBySearchParams'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_TIME_SERIES_DATA:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetTimeSeriesDataAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
            
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;
                
                const temp3 = temp2[actualAction.timeSeriesId] || {
                };
                temp2[actualAction.timeSeriesId] = temp3;

                temp3[actualAction.searchParams] = castDraft(
                    actualAction.data,
                );
            });

        default:
            return currentState;
    }
};

const tsRawDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer = (
    currentState: TimeSeriesState['tsRawDataByIdByHomeIdByTSDBModuleIdBySearchParams'], action: BaseAction,
): TimeSeriesState['tsRawDataByIdByHomeIdByTSDBModuleIdBySearchParams'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_TIME_SERIES_RAW_DATA:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetTimeSeriesRawDataAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;
                
                const temp3 = temp2[actualAction.timeSeriesId] || {
                };
                temp2[actualAction.timeSeriesId] = temp3;
                
                temp3[actualAction.searchParams] = castDraft(
                    actualAction.data,
                );
            });

        default:
            return currentState;
    }
};


const tsCollectionIdsByHomeIdByTSDBModuleIdReducer = (
    currentState: TimeSeriesState['tsCollectionIdsByHomeIdByTSDBModuleId'], action: BaseAction,
): TimeSeriesState['tsCollectionIdsByHomeIdByTSDBModuleId'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_ALL_TIME_SERIES_COLLECTION_INFO:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetAllTimeSeriesCollectionInfoAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                // We only need to store the list of timeSeries collection's id but not the whole timeSeries collection info object.
                // The objects will be stored in the tsCollectionInfoByIdByHomeIdByTSDBModuleId state
                temp[actualAction.tsdbModuleId] = actualAction.collections.map((collectionInfo: TimeSeriesCollectionInfo) => {
                    return collectionInfo.id;
                });
            });

        default:
            return currentState;
    }
};


const tsCollectionInfoByIdByHomeIdByTSDBModuleIdReducer = (
    currentState: TimeSeriesState['tsCollectionInfoByIdByHomeIdByTSDBModuleId'], action: BaseAction,
): TimeSeriesState['tsCollectionInfoByIdByHomeIdByTSDBModuleId'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_ALL_TIME_SERIES_COLLECTION_INFO:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetAllTimeSeriesCollectionInfoAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;
                
                actualAction.collections.forEach((collectionInfo: TimeSeriesCollectionInfo) => {
                    temp2[collectionInfo.id] = castDraft(collectionInfo);
                });
            });

        case TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_INFO:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetTimeSeriesCollectionInfoAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;
                
                temp2[actualAction.collectionId] = castDraft(actualAction.collection);
            });

        default:
            return currentState;
    }
};

const tsCollectionRangeByIdByHomeIdByTSDBModuleIdReducer = (
    currentState: TimeSeriesState['tsCollectionRangeByIdByHomeIdByTSDBModuleId'], action: BaseAction,
): TimeSeriesState['tsCollectionRangeByIdByHomeIdByTSDBModuleId'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_RANGE:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetTimeSeriesCollectionRangeAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;
                
                temp2[actualAction.collectionId] = castDraft(actualAction.range);
            });

        default:
            return currentState;
    }
};


const tsCollectionDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer = (
    currentState: TimeSeriesState['tsCollectionDataByIdByHomeIdByTSDBModuleIdBySearchParams'], action: BaseAction,
): TimeSeriesState['tsCollectionDataByIdByHomeIdByTSDBModuleIdBySearchParams'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_DATA:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetTimeSeriesCollectionDataAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;
                
                const temp3 = temp2[actualAction.collectionId] || {
                };
                temp2[actualAction.collectionId] = temp3;
                
                temp3[actualAction.searchParams] = castDraft(
                    actualAction.data,
                );
            });

        default:
            return currentState;
    }
};


const tsCollectionRawDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer = (
    currentState: TimeSeriesState['tsCollectionRawDataByIdByHomeIdByTSDBModuleIdBySearchParams'], action: BaseAction,
): TimeSeriesState['tsCollectionRawDataByIdByHomeIdByTSDBModuleIdBySearchParams'] => {
    const { type } = action;

    switch (type) {
        case TimeSeriesActionType.SET_TIME_SERIES_COLLECTION_RAW_DATA:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const actualAction = action as SetTimeSeriesCollectionRawDataAction;
                const temp = draft[actualAction.homeId] || {
                };
                draft[actualAction.homeId] = temp;
                
                const temp2 = temp[actualAction.tsdbModuleId] || {
                };
                temp[actualAction.tsdbModuleId] = temp2;
                
                const temp3 = temp2[actualAction.collectionId] || {
                };
                temp2[actualAction.collectionId] = temp3;
                
                temp3[actualAction.searchParams] = castDraft(
                    actualAction.data,
                );
            });

        default:
            return currentState;
    }
};



export const timeSeriesStateReducer = (currentState: TimeSeriesState, action: BaseAction): TimeSeriesState => {
    return produce(currentState, (draft: Draft<TimeSeriesState>) => {
        draft.tsIdsByHomeIdByTSDBModuleId = castDraft(tsIdsByHomeIdByTSDBModuleIdReducer(
            currentState.tsIdsByHomeIdByTSDBModuleId, action,
        ));
        draft.tsInfoByIdByHomeIdByTSDBModuleId = tsInfoByIdByHomeIdByTSDBModuleIdReducer(
            currentState.tsInfoByIdByHomeIdByTSDBModuleId, action,
        );
        draft.tsRangeByIdByHomeIdByTSDBModuleId = tsRangeByIdByHomeIdByTSDBModuleIdReducer(
            currentState.tsRangeByIdByHomeIdByTSDBModuleId, action,
        );
        draft.tsDataByIdByHomeIdByTSDBModuleIdBySearchParams = castDraft(
            tsDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer(
                currentState.tsDataByIdByHomeIdByTSDBModuleIdBySearchParams, action,
            ),
        );
        draft.tsRawDataByIdByHomeIdByTSDBModuleIdBySearchParams = castDraft(
            tsRawDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer(
                currentState.tsRawDataByIdByHomeIdByTSDBModuleIdBySearchParams, action,
            ),
        );

        draft.tsCollectionIdsByHomeIdByTSDBModuleId = castDraft(tsCollectionIdsByHomeIdByTSDBModuleIdReducer(
            currentState.tsCollectionIdsByHomeIdByTSDBModuleId, action,
        ));
        draft.tsCollectionInfoByIdByHomeIdByTSDBModuleId = castDraft(tsCollectionInfoByIdByHomeIdByTSDBModuleIdReducer(
            currentState.tsCollectionInfoByIdByHomeIdByTSDBModuleId, action,
        ));
        draft.tsCollectionRangeByIdByHomeIdByTSDBModuleId = tsCollectionRangeByIdByHomeIdByTSDBModuleIdReducer(
            currentState.tsCollectionRangeByIdByHomeIdByTSDBModuleId, action,
        );
        draft.tsCollectionDataByIdByHomeIdByTSDBModuleIdBySearchParams = castDraft(
            tsCollectionDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer(
                currentState.tsCollectionDataByIdByHomeIdByTSDBModuleIdBySearchParams, action,
            ),
        );
        draft.tsCollectionRawDataByIdByHomeIdByTSDBModuleIdBySearchParams = castDraft(
            tsCollectionRawDataByIdByHomeIdByTSDBModuleIdBySearchParamsReducer(
                currentState.tsCollectionRawDataByIdByHomeIdByTSDBModuleIdBySearchParams, action,
            ),
        );
    });
};
