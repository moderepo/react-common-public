/* eslint-disable max-len */
import {
    SmartModuleType, TimeSeriesAggregation,
} from '.';


export enum MetricValueType {
    NUMBER = 'number',
    STRING = 'string'
}


/**
 * valueName - The name of the metric. Usually this will be the same as type except when there are multiple metrics of the same type then this value
 *             will be more specific. E.g. if a device has multiple batteries and multiple battery metrics, both metrics' type can be 'battery_level'
 *             but one metrics' valueName can be 'main_battery_level', and another metrics' valueName can be 'backup_battery_level'.
 * displayName - User friendly name of the metric type (used for display)
 */
export interface MetricInfo {
    readonly name: string;
    readonly displayName?: string | undefined;
}

/**
 * Type guard function to check if an object is a MetricInfo
 */
export const isMetricInfo = (obj: unknown): obj is MetricInfo => {
    const object = obj as MetricInfo;
    return (typeof object.name === 'string')
        && (!object.displayName || typeof object.displayName === 'string');
};


export enum EvaluationPeriod {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}


/**
 * The Operator defines how to compare an aggregated value against threshold(s)
 *      - 'lessThan'(<), 'lessThanOrEqualTo'(<=), 'greaterThanOrEqualTo'(=>), or 'greaterThan'(>) against a threshold value
 *      - 'in', 'notIn' for a value is in or not in the thresholds, or 'between' (greater than or equal to Thresholds[0] AND less than or equal
 *          Thresholds[1]), or 'outside' (negation of 'between', less than Thresholds[0] OR greater than Thresholds[1]).
 * The Thresholds define in-alert threshold(s) for the period. 'between' and 'outside' operators require 2 thresholds. 'equal' and 'notEqual'
 * operators require 1 (or more) threshold(s). Other operators accept only 1 threshold.
 */
export enum ThresholdComparisonOperator {
    // The following 4 operator requires EXACTLY 1 threshold
    LESS_THAN = 'lessThan',
    LESS_THAN_OR_EQUAL_TO = 'lessThanOrEqualTo',
    GREATER_THAN = 'greaterThan',
    GREATER_THAN_OR_EQUAL_TO = 'greaterThanOrEqualTo',

    // The value must be equal to all thresholds provided. This require minimum 1 threshold and no limit on maximum number of threshold.
    IN = 'in',

    // The value must NOT be equal to any thresholds provided. This require minimum 1 threshold and no limit on maximum number of threshold.
    NOT_IN = 'notIn',

    // greater than or equal to Thresholds[0] AND less than or equal Thresholds[1]. This operator require 2 thresholds.
    BETWEEN = 'between',

    // opposite of 'between', less than Thresholds[0] OR greater than Thresholds[1]. This operator require 2 thresholds.
    OUTSIDE = 'outside',
}


export interface EntityNumericMetricAlertCondition {
    readonly period: EvaluationPeriod;
    readonly operator: ThresholdComparisonOperator;
    readonly thresholds: readonly number[];
}


export interface EntityNumericMetricEvaluator {
    readonly aggregation: TimeSeriesAggregation;
    readonly displayName: string;
    readonly alertConditions: readonly EntityNumericMetricAlertCondition[];
}


/**
 * type - Type of Numerical metric (temperature, pressure, etc...)
 * unit - The unit of metric measurement value
 */
export interface NumericMetricInfo extends MetricInfo {
    readonly type?: string | undefined;     // TODO - remove this
    readonly range?: {
        readonly min?: number | undefined;
        readonly max?: number | undefined;
    } | undefined;
    readonly unit?: string | undefined;
    readonly evaluator?: EntityNumericMetricEvaluator | undefined;
}

/**
 * Type guard function to check if an object is a NumericMetric's range
 */
export const isNumericMetricRange = (obj: unknown): obj is NumericMetricInfo['range'] => {
    const object = obj as NumericMetricInfo['range'];
    return object !== undefined
        && (object.min === undefined || typeof object.min === 'number')
        && (object.max === undefined || typeof object.max === 'number');
};


/**
 * Type guard function to check if an object is a NumericMetricInfo
 */
export const isNumericMetricInfo = (obj: unknown): obj is NumericMetricInfo => {
    const object = obj as NumericMetricInfo;
    return isMetricInfo(object)
        && (!object.unit || typeof object.unit === 'string')
        && (!object.range || isNumericMetricRange(object.range));
};


/**
 * A mapping of tag value => user friendly name. Sometime tag values are just numbers for example 0, 1, 2 which represent states like
 * NORMAL, WARNING, CRITICAL so it is more user friendly to show names instead of values.
 */
export interface TagMetricEnum {
    // The tag metric value from backend
    readonly value: string;

    // The display name of the value
    readonly name: string;
}

/**
 * Type guard function to check if an object is a TagMetricEnum
 */
export const isTagMetricEnum = (obj: unknown): obj is TagMetricEnum => {
    const object = obj as TagMetricEnum;
    return (typeof object.value === 'string')
        && (typeof object.name === 'string');
};


/**
 * Interface for Tag metrics, metrics which values are not numeric e.g. state, errors, etc...
 */
export interface TagMetricInfo extends MetricInfo {
    readonly enumDefinitions?: readonly TagMetricEnum[] | undefined;        // The mapping of tag values if tag values are enum
}

/**
 * Type guard function to check if an object is a TagMetricInfo
 */
export const isTagMetricInfo = (obj: unknown): obj is TagMetricInfo => {
    const object = obj as TagMetricInfo;
    return isMetricInfo(object)
        && (!object.enumDefinitions || object.enumDefinitions.find((mapValue) => {
            // find a mapValue that is not type TagMetricEnum
            return !isTagMetricEnum(mapValue);
        }) === undefined);
};



export enum MetricType {
    RAW = 'raw',
    DERIVED = 'derived'
}


/**
 * Module types other then SmartModuleType that are also supported by entities
 */
export enum EntityModuleType {
    HOME_APP_PROXY = 'home_app_proxy',
    VIDEO = 'video'
}


export interface EntityDataStoreConfiguration {
    readonly moduleType: SmartModuleType | EntityModuleType;
    readonly moduleInstanceId: string;
    readonly bulkDataLabel: string;
}


/**
 * Type guard function to check if an object is a EntityDataStoreConfiguration
 */
export const isEntityDataStoreConfiguration = (obj: unknown): obj is EntityDataStoreConfiguration => {
    const object = obj as EntityDataStoreConfiguration;
    return [...Object.values(SmartModuleType), ...Object.values(EntityModuleType)].includes(object.moduleType)
        && (typeof object.moduleInstanceId === 'string' && object.moduleInstanceId.length > 0)
        && (typeof object.bulkDataLabel === 'string' && object.bulkDataLabel.length > 0);
};


export interface EntityMetricsDefinitionLinkTo {
    readonly blobDefinitionId: string;
    readonly keyField: string;
}

/**
 * Type guard function to check if an object is a EntityMetricsDefinitionLinkTo
 */
export const isEntityMetricsDefinitionLinkTo = (obj: unknown): obj is EntityMetricsDefinitionLinkTo => {
    const object = obj as EntityMetricsDefinitionLinkTo;
    return (typeof object.blobDefinitionId === 'string' && object.blobDefinitionId.length > 0)
        && (typeof object.keyField === 'string' && object.keyField.length > 0);
};


export interface EntityMetricsDefinition {
    readonly metricsDefinitionId: string;
    readonly displayName?: string | undefined;
    readonly metricsType: MetricType;
    readonly tagMetrics: readonly TagMetricInfo[];
    readonly numericMetrics: readonly NumericMetricInfo[];
    readonly dataStoreConfiguration: EntityDataStoreConfiguration;
    readonly linksTo?: readonly EntityMetricsDefinitionLinkTo[] | undefined;
}


/**
 * Type guard function to check if an object is a EntityMetricsDefinition
 */
export const isEntityMetricsDefinition = (obj: unknown): obj is EntityMetricsDefinition => {
    const object = obj as EntityMetricsDefinition;
    return (typeof object.metricsDefinitionId === 'string' && object.metricsDefinitionId.length > 0)
        && Object.values(MetricType).includes(object.metricsType)
        && (object.numericMetrics && !object.numericMetrics.find((metric) => {
            return !isNumericMetricInfo(metric);
        }) === undefined)
        && (object.tagMetrics && !object.tagMetrics.find((metric) => {
            return !isTagMetricInfo(metric);
        }) === undefined)
        && isEntityDataStoreConfiguration(object.dataStoreConfiguration)
        && (!object.linksTo || (object.linksTo instanceof Array && object.linksTo.every((linkTo) => {
            return isEntityMetricsDefinitionLinkTo(linkTo);
        })));
};


export interface EntityBlobDefinition {
    readonly blobDefinitionId: string;
    readonly displayName?: string | undefined;
    readonly dataStoreConfiguration: EntityDataStoreConfiguration;
}


/**
 * Type guard function to check if an object is a EntityBlobDefinition
 */
export const isEntityBlobDefinition = (obj: unknown): obj is EntityBlobDefinition => {
    const object = obj as EntityBlobDefinition;
    return (typeof object.blobDefinitionId === 'string' && object.blobDefinitionId.length > 0)
    && (!object.displayName || (typeof object.displayName === 'string' && object.blobDefinitionId.length > 0))
        && isEntityDataStoreConfiguration(object.dataStoreConfiguration);
};


export interface S3FileInfo {
    readonly fileName: string;
    readonly url: string;
    readonly s3Bucket?: string | undefined;
    readonly s3Key?: string | undefined;
}


export const isS3FileInfo = (obj: unknown): obj is S3FileInfo => {
    const object = obj as S3FileInfo;
    return (typeof object.fileName === 'string' && object.fileName.length > 0)
        && (typeof object.url === 'string' && object.url.length > 0);
};


export interface EntityDisplaySettings {
    readonly name: string;
    readonly description: string;
    readonly iconData?: S3FileInfo;
    readonly imageData?: S3FileInfo;
    readonly uiSettings?: object | undefined;
}


/**
 * Type guard function to check if an object is a EntityDisplaySettings
 */
export const isEntityDisplaySettings = (obj: unknown): obj is EntityDisplaySettings => {
    const object = obj as EntityDisplaySettings;
    return (typeof object.name === 'string' && object.name.length > 0)
        && (!object.description || typeof object.description === 'string')
        && (isS3FileInfo(object.iconData))
        && (isS3FileInfo(object.imageData))
        && (!object.uiSettings || typeof object.uiSettings === 'object');
};


export enum AttributeValueCompareOperator {
    LESS_THAN = '<',
    LESS_THAN_OR_EQUAL = '<=',
    EQUAL = '==',
    EXACT_EQUAL = '===',
    GREATER_THAN_OR_EQUAL = '>=',
    GREATER_THAN = '>',
    INCLUDE = '~=',
    EXACT_INCLUDE = '~==',
}


export enum AttributeConditionConjunction {
    AND = 'AND',
    OR = 'OR',
}


export enum EntityAttributeType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    ARRAY = 'array',
    OBJECT = 'object',
}


// Shortcut for entity attribute value type so that we don't need to repeat this every where
// So instead of going this <T extends string | number | boolean>
// We can do this <T extends EntityAttributeValueType>
export type EntityAttributeValueType = string | number | boolean | object | Array<any>;

export interface EntityAttributeOption<ValueType extends EntityAttributeValueType> {
    readonly label: string;
    readonly value: ValueType;
}

export interface EntityAttributeParam<ValueType extends EntityAttributeValueType> {
    readonly key: string;
    readonly type: EntityAttributeType;
    readonly required: boolean;
    readonly label: string;
    readonly description?: string | undefined;
    readonly defaultValue?: ValueType | undefined;
    readonly options?: readonly EntityAttributeOption<ValueType>[] | undefined;
    readonly min?: number | undefined;
    readonly max?: number | undefined;
    readonly regex?: string | undefined;
}

/**
 * Type guard function to check if an object is a EntityAttributeParam
 */
export const isEntityAttributeParam = (obj: unknown): obj is EntityAttributeParam<any> => {
    const object = obj as EntityAttributeParam<any>;
    return (object !== undefined && typeof object === 'object')
        && (typeof object.key === 'string' && object.key.length > 0)
        && (object.type !== undefined && Object.values(EntityAttributeType).includes(object.type))
        && (typeof object.label === 'string' && object.label.length > 0)
        && (!object.description || typeof object.description === 'string');
};

export interface EntityClass {
    readonly entityClass: string;
    readonly projectId: number;
    readonly displaySettings: EntityDisplaySettings;
    readonly metricsDefinitions?: readonly EntityMetricsDefinition[] | undefined;
    readonly blobDefinitions?: readonly EntityBlobDefinition[] | undefined;
    readonly attributeSchema?: readonly EntityAttributeParam<EntityAttributeValueType>[] | undefined;
    readonly createdAt: string;
    readonly updatedAt: string;
}


/**
 * The updatable attributes for an entity class
 */
export interface UpdateEntityClassParams {
    readonly displaySettings?: Partial<EntityDisplaySettings> | undefined;
    readonly metricsDefinitions?: readonly EntityMetricsDefinition[] | undefined;
}



/**
 * Type guard function to check if an object is a EntityClass
 */
export const isEntityClass = (obj: unknown): obj is EntityClass => {
    const object = obj as EntityClass;
    return (typeof object.entityClass === 'string' && object.entityClass.length > 0)
         && (typeof object.projectId === 'number')
         && (isEntityDisplaySettings(object.displaySettings))
         && (object.metricsDefinitions === undefined || object.metricsDefinitions.every((metricDef) => {
             return isEntityMetricsDefinition(metricDef);
         }))
         && (object.attributeSchema === undefined || isEntityAttributeParam(object.attributeSchema));
};


export interface Entity {
    readonly entityId: string;
    readonly projectId: number;
    readonly homeId: number;
    readonly entityClass: string;
    readonly parentId?: string | undefined;
    readonly displaySettings: EntityDisplaySettings;
    readonly tags: readonly string[];
    readonly attributes?: {
        [key: string]: EntityAttributeValueType | undefined;
    } | undefined;
    readonly timeZone: string;
    readonly createdAt: string;
    readonly updatedAt: string;

    // An array of metricsDefinitionId and the id of the metrics data e.g. collection ID
    // There should be 1 item per metricsDefinition defined in the entityClass
    readonly metrics?: readonly {
        readonly metricsDefinitionId: string;
        readonly metricsId: string;
    }[] | undefined;
}

/**
 * Type guard function to check if an object is a Entity
 */
export const isEntity = (obj: unknown): obj is Entity => {
    const object = obj as Entity;
    return (typeof object.entityId === 'string' && object.entityId.length > 0)
         && (typeof object.projectId === 'number')
         && (typeof object.homeId === 'number')
         && (typeof object.entityClass === 'string' && object.entityClass.length > 0)
         && (!object.parentId || (typeof object.parentId === 'string' && object.parentId.length > 0))
         && (typeof object.timeZone === 'string' && object.timeZone.length > 0)
         && (isEntityDisplaySettings(object.displaySettings))
         && (object.tags && object.tags.find((tag) => {
             return typeof tag !== 'string' || tag.length === 0;
         }) === undefined);
};


// Interface for Entity filter options when calling GET entities API
export interface FetchEntityFilters {
    readonly skip?: number | undefined;
    readonly limit?: number | undefined;
    readonly homeId?: number | undefined;
    readonly entityIdSubstring?: string | undefined;
    readonly entityNameSubstring?: string | undefined;
    readonly tags?: string | undefined;
    // An comma separated list of entity classes
    readonly entityClasses?: string | undefined;
    readonly parentId?: string | null | undefined;
    readonly attributesQuery?: string | undefined;
}


/**
 * The updatable attributes for an entity
 */
export interface UpdateEntityParams {
    readonly parentId?: string | undefined;
    readonly displaySettings?: {
        readonly name?: string | undefined;
        readonly description?: string | undefined;
    } | undefined;
    readonly attributes?: {
        [key: string]: EntityAttributeValueType | undefined;
    } | undefined;
}

/**
 * The params required for creating an Entity
 */
export interface CreateEntityParams {
    readonly homeId: number;
    readonly parentId?: string | undefined;
    readonly entityClass: string;
    readonly entityId: string;
    readonly timeZone: string;
    readonly displaySettings: {
        readonly name: string;
        readonly description?: string | undefined;
    }
    readonly attributes?: {
        [key: string]: EntityAttributeValueType | undefined;
    } | undefined;
}
