import {
    Entity, EntityClass, PaginationDataSet,
} from '@moderepo/mode-apis';


export interface EntitiesState {
    // entities' ID are not unique globally therefore they need to be stored under projectId
    readonly entitiesByProjectIdByEntityId: {
        readonly [projectId: number]: {
            [entityId: string]: Entity | undefined;
        } | undefined;
    };
    readonly entityIdsByProjectId: {
        readonly [projectId: number]: {
            readonly [searchParams: string]: PaginationDataSet<string> | undefined;
        } | undefined;
    };
    readonly entityClassesByProjectIdByEntityClassId: {
        readonly [projectId: number]: {
            readonly [entityClassId: string]: EntityClass | undefined;
        } | undefined;
    };
    readonly entityClassIdsByProjectId: {
        readonly [projectId: number]: readonly string[] | undefined;
    };
}


export const initialEntitiesState: EntitiesState = {
    entitiesByProjectIdByEntityId: {
    },
    entityIdsByProjectId: {
    },
    entityClassesByProjectIdByEntityClassId: {
    },
    entityClassIdsByProjectId: {
    },
};
