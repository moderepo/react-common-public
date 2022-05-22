import produce, {
    castDraft, Draft,
} from 'immer';
import {
    Entity, EntityClass,
} from '@moderepo/mode-apis';
import {
    BaseAction,
} from '@moderepo/mode-data-state-base';
import {
    EntitiesActionType, SetEntityAction, SetEntitiesAction, ClearEntitiesAction, SetEntityClassesAction, ClearEntityClassesAction,
    SetEntityClassAction,
} from './actions';
import {
    EntitiesState,
} from './models';



const entityClassesByProjectIdByEntityIdReducer = (
    currentState: EntitiesState['entityClassesByProjectIdByEntityClassId'], action: BaseAction,
): EntitiesState['entityClassesByProjectIdByEntityClassId'] => {
    const { type } = action;

    switch (type) {

        case EntitiesActionType.SET_ENTITY_CLASSES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, entityClasses } = action as SetEntityClassesAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
    
                entityClasses.forEach((entityClass: EntityClass) => {
                    temp[entityClass.entityClass] = castDraft(entityClass);
                });
            });

        case EntitiesActionType.SET_ENTITY_CLASS:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, entityClass } = action as SetEntityClassAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
                temp[entityClass.entityClass] = castDraft(entityClass);
            });

        case EntitiesActionType.CLEAR_ENTITY_CLASSES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId } = action as ClearEntityClassesAction;
                delete draft[projectId];
            });

        default:
            return currentState;
    }
};



const entityClassIdsByProjectIdReducer = (
    currentState: EntitiesState['entityClassIdsByProjectId'], action: BaseAction,
): EntitiesState['entityClassIdsByProjectId'] => {

    const { type } = action;

    switch (type) {
        case EntitiesActionType.SET_ENTITY_CLASSES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, entityClasses } = action as SetEntityClassesAction;
                draft[projectId] = entityClasses.map((entityClass: EntityClass): string => {
                    return entityClass.entityClass;
                });
            });

        case EntitiesActionType.CLEAR_ENTITY_CLASSES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId } = action as ClearEntityClassesAction;
                delete draft[projectId];
            });

        default:
            return currentState;
    }
};



const entitiesByProjectIdByEntityIdReducer = (
    currentState: EntitiesState['entitiesByProjectIdByEntityId'], action: BaseAction,
): EntitiesState['entitiesByProjectIdByEntityId'] => {
    const { type } = action;

    switch (type) {

        case EntitiesActionType.SET_ENTITIES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, entities } = action as SetEntitiesAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
    
                entities.items.forEach((entity: Entity) => {
                    temp[entity.entityId] = castDraft(entity);
                });
            });

        case EntitiesActionType.SET_ENTITY:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, entity } = action as SetEntityAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
                temp[entity.entityId] = castDraft(entity);
            });

        case EntitiesActionType.CLEAR_ENTITIES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId } = action as ClearEntitiesAction;
                delete draft[projectId];
            });

        default:
            return currentState;
    }
};



const entityIdsByProjectIdReducer = (
    currentState: EntitiesState['entityIdsByProjectId'], action: BaseAction,
): EntitiesState['entityIdsByProjectId'] => {

    const { type } = action;

    switch (type) {
        case EntitiesActionType.SET_ENTITIES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId, entities, searchParams } = action as SetEntitiesAction;
                const temp = draft[projectId] || {
                };
                draft[projectId] = temp;
                temp[searchParams] = {
                    range: entities.range,
                    items: entities.items.map((entity: Entity): string => {
                        return entity.entityId;
                    }),
                };
            });

        case EntitiesActionType.CLEAR_ENTITIES:
            return produce(currentState, (draft: Draft<typeof currentState>) => {
                const { projectId } = action as ClearEntitiesAction;
                delete draft[projectId];
            });

        default:
            return currentState;
    }
};



export const entitiesStateReducer = (currentState: EntitiesState, action: BaseAction): EntitiesState => {
    return produce(currentState, (draft: Draft<EntitiesState>) => {
        draft.entitiesByProjectIdByEntityId = castDraft(entitiesByProjectIdByEntityIdReducer(currentState.entitiesByProjectIdByEntityId, action));
        draft.entityIdsByProjectId = castDraft(entityIdsByProjectIdReducer(currentState.entityIdsByProjectId, action));

        draft.entityClassesByProjectIdByEntityClassId = castDraft(entityClassesByProjectIdByEntityIdReducer(
            currentState.entityClassesByProjectIdByEntityClassId, action,
        ));
        draft.entityClassIdsByProjectId = castDraft(entityClassIdsByProjectIdReducer(currentState.entityClassIdsByProjectId, action));
    });
};
