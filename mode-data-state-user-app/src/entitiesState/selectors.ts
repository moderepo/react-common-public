import {
    createCachedSelector,
} from 're-reselect';
import {
    Entity,
    EntityClass,
    PaginationDataSet,
} from '@moderepo/mode-apis';
import {
    searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    createSelector,
} from 'reselect';
import {
    UserAppDataState,
} from '../model';
import {
    EntitiesState,
} from './models';



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectEntityClassesFunc = (
    entityClassesByProjectIdByEntityId: EntitiesState['entityClassesByProjectIdByEntityClassId'],
    entityClassIdsByProjectId: EntitiesState['entityClassIdsByProjectId'],
    projectId: number,
): readonly EntityClass[] | undefined => {
    return entityClassIdsByProjectId?.[projectId]?.reduce((result: readonly EntityClass[], entityClassId: string) => {
        const entityClass = entityClassesByProjectIdByEntityId[projectId]?.[entityClassId];
        if (entityClass) {
            return [...result, entityClass];
        }
        return result;
    }, []);
};



/**
 * Select ALL device classes for a specific project
 */
export const selectEntityClasses = createSelector(
    (state: UserAppDataState) => { return state.entities.entityClassesByProjectIdByEntityClassId; },
    (state: UserAppDataState) => { return state.entities.entityClassIdsByProjectId; },
    (state: UserAppDataState, projectId: number) => { return projectId; },
    selectEntityClassesFunc,
);



/**
 * @param state
 * @param projectId
 * @param entityClass
 * @returns EntityClass | undefined
 */
export const selectEntityClassById = (state: UserAppDataState, projectId: number, entityClass: string): EntityClass | undefined => {
    return state.entities.entityClassesByProjectIdByEntityClassId[projectId]?.[entityClass];
};



/**
 * This is the actual function that will get the data from the state and return the data requested. However, this function returns a new
 * object every time which can cause an infinite loop in re-rendering if used in React component. Therefore this function is not EXPORTED
 * and we will create another function below which use memoize to cache the result.
 */
const selectEntitiesFunc = (
    entitiesByProjectIdByEntityId: EntitiesState['entitiesByProjectIdByEntityId'],
    entityIdsByProjectId: EntitiesState['entityIdsByProjectId'],
    projectId: number,
    searchParams: string,
): PaginationDataSet<Entity> | undefined => {
    const dataSet = entityIdsByProjectId[projectId]?.[searchParams];
    const entitiesByProjectId = entitiesByProjectIdByEntityId[projectId];
    if (dataSet && entitiesByProjectId) {

        // This will return a new PaginationDataSet of Entity which can cause infinite loop if we don't use memoize
        return {
            range: dataSet.range,
            items: dataSet.items.reduce((result: readonly Entity[], entityId: string) => {
                const entity = entitiesByProjectId[entityId];
                if (entity) {
                    return [
                        ...result,
                        entity,
                    ];
                }
                return result;
            }, []),
        };
    }
    return undefined;
};



/**
 * Select ALL homes for a specific user
 * @param state
 * @param projectId
 * @param searchParams?: {
 *              pageNumber,
 *              pageSize
 *        }
 * @returns PaginationDataSet<Home> | undefined
 */
export const selectEntities = createCachedSelector(
    (state: UserAppDataState) => { return state.entities.entitiesByProjectIdByEntityId; },
    (state: UserAppDataState) => { return state.entities.entityIdsByProjectId; },
    (state: UserAppDataState, projectId: number) => { return projectId; },
    (state: UserAppDataState, projectId: number, searchParams?: {
        readonly pageNumber?: number | undefined;
        readonly pageSize?: number | undefined;
    }) => { return searchParamsToString(searchParams); },
    selectEntitiesFunc,
)((state: UserAppDataState, projectId: number, searchParams?: {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}) => {
    // use searchParams as cache key for createCachedSelector
    return searchParamsToString(searchParams);
});



/**
 * @param state
 * @param projectId
 * @param entityId
 * @returns Entity | undefined
 */
export const selectEntityById = (state: UserAppDataState, projectId: number, entityId: string): Entity | undefined => {
    return state.entities.entitiesByProjectIdByEntityId[projectId]?.[entityId];
};
