import {
    AppAPI, CreateEntityParams, Entity, EntityClass, FetchEntityFilters, PaginationDataSet, UpdateEntityParams,
} from '@moderepo/mode-apis';
import {
    BaseAction, ExtDispatch, searchParamsToString,
} from '@moderepo/mode-data-state-base';
import {
    UserAppDataStateAction, UserAppThunkAction,
} from '../actions';


/**
 * The types of action that can be dispatched to update this sub state.
 */
export enum EntitiesActionType {
    SET_ENTITY_CLASS = 'set entity class',
    SET_ENTITY_CLASSES = 'set entity classes',
    CLEAR_ENTITY_CLASSES = 'clear entity classes',

    SET_ENTITY = 'set entity',
    SET_ENTITIES = 'set entities',
    CLEAR_ENTITIES = 'clear entities',
}



/**
 * The Action interface for setting a list of entity classes that belonged to a project.
 * @param type - The action type
 * @param entityClasses - The array of entity classes
 */
export interface SetEntityClassesAction extends BaseAction {
    readonly type: EntitiesActionType.SET_ENTITY_CLASSES;
    readonly projectId: number;
    readonly entityClasses: readonly EntityClass[];
}


/**
 * The Action interface for setting a entity class that belonged to a user.
 * @param type - The action type
 * @param entityClass - The entity class
 */
export interface SetEntityClassAction extends BaseAction {
    readonly type: EntitiesActionType.SET_ENTITY_CLASS;
    readonly projectId: number;
    readonly entityClass: EntityClass;
}


/**
 * The Action interface for clearing the list of project entity classes
 * @param type - The action type
 */
export interface ClearEntityClassesAction extends BaseAction {
    readonly type: EntitiesActionType.CLEAR_ENTITY_CLASSES;
    readonly projectId: number;
}



/**
 * The Action interface for setting a list of entities that belonged to a project.
 * @param type - The action type
 * @param entities - The array of entities
 */
export interface SetEntitiesAction extends BaseAction {
    readonly type: EntitiesActionType.SET_ENTITIES;
    readonly projectId: number;
    readonly entities: PaginationDataSet<Entity>;
    readonly searchParams: string;
}


/**
 * The Action interface for setting a entity that belonged to a user.
 * @param type - The action type
 * @param entity - The entity
 */
export interface SetEntityAction extends BaseAction {
    readonly type: EntitiesActionType.SET_ENTITY;
    readonly projectId: number;
    readonly entity: Entity;
}



/**
 * The Action interface for clearing the list of project entities
 * @param type - The action type
 */
export interface ClearEntitiesAction extends BaseAction {
    readonly type: EntitiesActionType.CLEAR_ENTITIES;
    readonly projectId: number;
}



export const setEntityClasses = (projectId: number, entityClasses: readonly EntityClass[]): SetEntityClassesAction => {
    return {
        type: EntitiesActionType.SET_ENTITY_CLASSES,
        projectId,
        entityClasses,
    };
};



export const setEntityClass = (projectId: number, entityClass: EntityClass): SetEntityClassAction => {
    return {
        type: EntitiesActionType.SET_ENTITY_CLASS,
        projectId,
        entityClass,
    };
};


export const clearEntityClasses = (projectId: number): ClearEntityClassesAction => {
    return {
        type: EntitiesActionType.CLEAR_ENTITY_CLASSES,
        projectId,
    };
};



export const setEntities = (projectId: number, entities: PaginationDataSet<Entity>, searchParams: string): SetEntitiesAction => {
    return {
        type: EntitiesActionType.SET_ENTITIES,
        projectId,
        entities,
        searchParams,
    };
};



export const setEntity = (projectId: number, entity: Entity): SetEntityAction => {
    return {
        type: EntitiesActionType.SET_ENTITY,
        projectId,
        entity,
    };
};



export const clearEntities = (projectId: number): ClearEntitiesAction => {
    return {
        type: EntitiesActionType.CLEAR_ENTITIES,
        projectId,
    };
};



/**
 * Get multiple entity classes belonged to a Project
 * @param projectId - The id of the project to look for
 */
export const fetchEntityClasses = (
    projectId: number,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const entityClasses = await AppAPI.getInstance().getEntityClasses(projectId);
        await dataDispatch(setEntityClasses(projectId, entityClasses));
    };
};



/**
 * Get an entity by id. This action will also update the app state.
 *
 * @param entityClassId - The ID of the entity we want to get
 */
export const fetchEntityClassById = (projectId: number, entityClassId: string): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const entityClass = await AppAPI.getInstance().getEntityClassById(projectId, entityClassId);
        await dataDispatch(setEntityClass(projectId, entityClass));
    };
};


/**
 * Backend uses 'limit' and 'skip' attributes however in the frontend, we use pageNumber and pageSize so this function need
 * to accept a filter object that uses pageNumber, pageSize and then convert that to skip/limit before calling the API
 */
export interface UIFetchEntityFilters extends Omit<Omit<FetchEntityFilters, 'skip'>, 'limit'> {
    readonly pageNumber?: number | undefined;
    readonly pageSize?: number | undefined;
}

/**
 * Get multiple entities belonged to a Project
 * @param projectId - The id of the project to look for
 */
export const fetchEntities = (
    projectId: number, filters: UIFetchEntityFilters,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const modifiedFilters = {
            ...filters,                                             // Copy the filters
            // change pageSize/pageNumber to skip/limit
            skip      : filters.pageNumber && filters.pageSize ? filters.pageNumber * filters.pageSize : undefined,
            limit     : filters.pageSize ? filters.pageSize : undefined,
            // exclude pageSize/pageNumber
            pageNumber: undefined,
            pageSize  : undefined,
        };
        
        const entities = await AppAPI.getInstance().getEntities(
            projectId, modifiedFilters,
        );
        await dataDispatch(setEntities(projectId, entities, searchParamsToString(filters)));
    };
};



/**
 * Get an entity by id. This action will also update the app state.
 *
 * @param entityId - The ID of the entity we want to get
 */
export const fetchEntityById = (projectId: number, entityId: string): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction
    >): Promise<void> => {
        const entity = await AppAPI.getInstance().getEntityById(projectId, entityId);
        await dataDispatch(setEntity(projectId, entity));
    };
};


/**
 * Create an entity.
 * @param projectId - The id of the project the entity belonged to
 * @param params - The attributes and their values to be updated
 */
export const createEntity = (
    projectId: number,
    params: CreateEntityParams,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().createEntity(projectId, params);

        // Need to clear the entities because the list of entities changed
        await dataDispatch(clearEntities(projectId));
    };
};



/**
 * Update an entity.
 * @param projectId - The id of the project the entity belonged to
 * @param entityId - The id of the entity which we want to update
 * @param params - The attributes and their values to be updated
 */
export const updateEntity = (
    projectId: number,
    entityId: string,
    params: UpdateEntityParams,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().updateEntity(projectId, entityId, params);

        // Need to clear the entities because updating the entity's attributes can cause the list of entities to be changed
        await dataDispatch(clearEntities(projectId));
    };
};



/**
 * Update an entity.
 * @param projectId - The id of the project the entity belonged to
 * @param entityId - The id of the entity which we want to update
 * @param params - The attributes and their values to be updated
 */
export const deleteEntity = (
    projectId: number,
    entityId: string,
): UserAppThunkAction => {
    return async (dataDispatch: ExtDispatch<UserAppDataStateAction>): Promise<void> => {
        await AppAPI.getInstance().deleteEntity(projectId, entityId);

        // Need to clear the entities because the list of entities changed
        await dataDispatch(clearEntities(projectId));
    };
};
