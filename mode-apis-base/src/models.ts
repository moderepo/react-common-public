/* eslint-disable max-len */


// The key in the RESPONSE header that contain paging info about the data returned e.g. page number, total items, etc...
export const DATA_RANGE_HEADER_KEY: string = 'vnd.tinkermode.range';


/**
 * Some pagination API returns the data range so that we know what index the first and last items
 * in the result are in the complete data set and also the total number of items.
 */
export interface DataRange {
    readonly start: number;
    readonly end: number;
    readonly total: number;
}


/**
 * We have a few API that return pagination data so this interface is used for those API instead of
 * returning a untyped JSON object.
 */
export interface PaginationDataSet<T> {
    readonly range?: DataRange;
    readonly items: readonly T[];
}

/**
 * The sort order values that backend allow
 */
export enum SortOrder {
    ASC = 'asc',
    DESC = 'desc'
}



/**
 * Base class for all LoginInfo object. Different app will have different login info data so this interface will be blank and only used as a
 * placeholder for specific LoginInfo type.
 */
export interface LoginInfo {
}


/**
 * Base user interface. We don't use this interface directly. We use sub interfaces of this interface e.g. Agent, User, etc...
 */
export interface BaseUser {
    readonly id: number;
    readonly email?: string;
    readonly phoneNumber?: string;
    readonly name: string;
    readonly creationTime: string;
    readonly verified: boolean;
}



/**
 * Interface for users. These are MODE user's users e.g. Panasonic's users.
 */
export interface User extends BaseUser {
    readonly projectId: number;
}



/**
 * Interface for a user's home
 */
export interface Home {
    readonly id: number;
    readonly projectId: number;
    readonly name: string;
    readonly deactivated?: boolean;
    readonly creationTime: string;
}


/**
 * The Home member role
 */
export enum MemberRole {
    OWNER = 'owner',
    MEMBER = 'member',
}


/**
 * Interface for HomeMembers. HomeMember is like a user except that it is not tied to a project and it has a role.
 */
export interface HomeMember extends Omit<BaseUser, 'id'> {
    readonly userId: number;
    readonly role: MemberRole;
}



/**
 * Interface for Home devices
 */
export interface HomeDevice {
    readonly id: number;
    readonly projectId: number;
    readonly deviceClass: string;
    readonly name: string;
    readonly tag: string;
    readonly homeId: number;
    readonly claimExpirationTime: string;
    readonly claimTime: string;
    readonly lastConnectTime: string;
    readonly lastDisconnectTime: string;
    readonly isConnected: boolean;
}

/**
 * The home device props that can be updated
 */
export interface UpdatableHomeDeviceProps {
    readonly name?: string | undefined;
    readonly tag?: string | undefined;

    // The following props require projectKey to update
    readonly homeId?: number | undefined;
    readonly claimCode?: string | undefined;
}



/**
 * The data structure of the data of a device that is in claim mode
 */
export interface DeviceRegistrationData {
    readonly claimExpirationTime: string;
}


/**
 * The data structure of the data used for on demand provisioning
 */
export interface DeviceProvisioningData {
    readonly token: string;
    readonly expirationTime: string;
}


/** **********************************    DEVICE CONFIG SCHEME INTERFACES    ************************************* */
export enum DeviceConfigParamType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    ARRAY = 'array',
    OBJECT = 'object',
}



// Shortcut for config param value type so that we don't need to repeat this every where
// So instead of going this <T extends string | number | boolean | Array | Object>
// We can do this <T extends DeviceConfigParamValueType>
export type DeviceConfigParamValueType = string | number | boolean | Array<any> | Object;


export interface DeviceConfigParamOption<ValueType extends DeviceConfigParamValueType> {
    readonly label: string;
    readonly value: ValueType;
}


export interface DeviceConfigParam<ValueType extends DeviceConfigParamValueType> {
    readonly key: string;
    readonly type: DeviceConfigParamType;
    readonly required: boolean;
    readonly label: string;
    readonly description?: string | undefined;
    readonly defaultValue?: ValueType | undefined;
    readonly options?: readonly DeviceConfigParamOption<ValueType>[] | undefined;
    readonly min?: number | undefined;
    readonly max?: number | undefined;
    readonly regex?: string | undefined;
}


export interface DeviceConfigParamSet {
    readonly name: string;
    readonly description?: string | undefined;
    readonly repeatable?: boolean | undefined;
    readonly keyName: string;
    readonly parameters: readonly DeviceConfigParam<DeviceConfigParamValueType>[];
}


/**
 * Device config schema for a firmware component
 */
export interface DeviceConfigFirmwareSchema {
    readonly componentName: string;
    readonly componentVersionName: string;
    readonly deviceConfigSchema?: readonly DeviceConfigParamSet[] | undefined;
}
/** **********************************    END DEVICE CONFIG SCHEME INTERFACES    ************************************* */



/**
 * Interface for Key/value pairs used for adding custom data for Homes and Devices. This is a generic KeyValuePair
 * which the value can be anything. Each application will need to define the structure for the value depending
 * on how its want to use the KeyValuePair.
 */
export interface KeyValuePair {
    readonly key: string;
    readonly value: any;
    readonly modificationTime: string;
}

/**
 * The interface for commands that we can send to the devices. This is a generic action which only has 2 params, action and paramters.
 * Each application will define its own set of command and what params are required for each command.
 */
export interface DeviceCommand {
    readonly action: string;
    readonly parameters?: Object | undefined;
}

/**
 * The types of smart modules that mode platform support
 */
export enum SmartModuleType {
    WEBHOOKS = 'webhooks',
    TSDB = 'tsdb',
    GOOGLE_ANALYTICS = 'google_analytics',
    SDS = 'sds',
    VIDEO = 'video',
}


/**
 * The data structure for an instance of smart module
 */
export interface SmartModule {
    readonly id: string;
    readonly description: string;
    readonly moduleType: SmartModuleType;
    readonly suspended: boolean;
    readonly version: string;
    readonly creationTime: string;
}


/**
 * Interface for a TimeSeries info. Note that this is NOT time series data. This structure only contain information about
 * each time series e.g. time series id, the home id of the home it is associated with, etc...
 */
export interface TimeSeriesInfo {
    readonly id: string;
    readonly homeId: number;
    readonly moduleId: string;
    readonly timeZone: string;
}

/**
 * The data structure that contain each time series's range, the very first and last date of the series
 */
export interface TimeSeriesRange {
    readonly begin: string;
    readonly end: string;
    readonly seriesId: string;
}

/**
 * Aggregation function that backend can apply to the data when we fetch time series data
 */
export enum TimeSeriesAggregation {
    MIN = 'min',
    MAX = 'max',
    AVG = 'avg',
    COUNT = 'count',
    SUM = 'sum',
}


/**
 * The data resolution that back end uses to aggregate data
 */
export enum TimeSeriesResolution {
    SEC_5 = '5sec',
    SEC_15 = '15sec',
    MIN_1 = '1min',
    MIN_10 = '10min',
    HOUR_1 = '1hour',
    DAY_1 = '1day',
    WEEK_1 = '1week',
    MONTH_1 = '1month',
}

/**
 * This is the data structure for time series AGGREGATED data
 */
export interface TimeSeriesData {
    readonly seriesId: string;
    readonly begin: string;
    readonly end: string;
    readonly aggregation: TimeSeriesAggregation;
    readonly resolution?: TimeSeriesResolution | undefined;
    readonly data: readonly [string, number][];
}

/**
 * This is the data structure for time series RAW data
 */
export interface TimeSeriesRawData {
    readonly seriesId: string;
    readonly ts: string;
    readonly limit: number;
    readonly data: readonly [string, number][];
}

/**
 * Interface for a TimeSeriesCollection info. Note that this is NOT time series collection data.
 * This structure only contain information about each time series collection.
 * e.g. time series id, the home id of the home it is associated with, etc...
 */
export interface TimeSeriesCollectionInfo extends TimeSeriesInfo {
    readonly valueNames: readonly string[];
    readonly tagNames?: readonly string[] | undefined;
}

/**
 * The data structure that contain each time series collection's range, the very first and last date of the collection.
 * TimeSeriesCollectionRange is almost the same as TimeSeriesRange therefore we can extends TimeSeriesRange and replace 'seriesId' with
 * 'collectionId'
 */
export interface TimeSeriesCollectionRange extends Omit<TimeSeriesRange, 'seriesId'> {
    readonly collectionId: string;
}


/**
 * This is the data structure for Collection AGGREGATED data
 */
export interface TimeSeriesCollectionData {
    readonly collectionId: string;
    readonly begin: string;
    readonly end: string;
    readonly aggregation: TimeSeriesAggregation;
    readonly resolution?: TimeSeriesResolution | undefined;
    readonly data: readonly [string, ...(string | number | null)[]][];
}

/**
 * This is the data structure for Collection RAW data
 */
export interface TimeSeriesCollectionRawData extends Omit<Omit<TimeSeriesRawData, 'seriesId'>, 'data'> {
    readonly collectionId: string;
    readonly ts: string;
    readonly limit: number;
    readonly data: readonly [string, ...(string | number | null)[]][];
}

/**
 * This is the data structure for the URLs for downloading the exported time series data
 */
export interface TimeSeriesExportInfo {
    readonly dataUrl: string;
    readonly statusUrl: string;
}

/**
 * This is the data structure for the URLs for downloading the exported data
 * NOTE: Maybe use TimeSeriesExportInfo instead since the name TimeSeriesCollectionExportedUrl suggest it is only for Collection
 * however, it works for both simple time series and collection
 */
export interface TimeSeriesCollectionExportedUrl extends TimeSeriesExportInfo {
}


/**
 * This is the data structure for a Video info from the video smart module
 */
export interface VideoInfo {
    readonly homeId: number;
    readonly searchKey: string;
    readonly thumbnail: string;
    readonly video: string;
}


/**
 * valueName - The name of the metric. Usually this will be the same as type except when there are multiple metrics of the same type then this value
 *             will be more specific. E.g. if a device has multiple batteries and multiple battery metrics, both metrics' type can be 'battery_level'
 *             but one metrics' valueName can be 'main_battery_level', and another metrics' valueName can be 'backup_battery_level'.
 * displayName - User friendly name of the metric type (used for display)
 */
export interface MetricInfo {
    readonly name: string;
    readonly displayName?: string;
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
 *      - 'in', 'notIn' for a value is in or not in the thresholds, or 'between' (greater than or equal to Thresholds[0] AND less than or equal Thresholds[1]),
 *          or 'outside' (negation of 'between', less than Thresholds[0] OR greater than Thresholds[1]).
 * The Thresholds define in-alert threshold(s) for the period. 'between' and 'outside' operators require 2 thresholds. 'equal' and 'notEqual' operators require 1 (or more) threshold(s). Other operators accept only 1 threshold.
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


/**
 * Location type for devices, modules, etc...
 */
export enum LocationType {
    INDOOR = 'indoor',          // IPS
    OUTDOOR = 'outdoor'         // GPS
}


/**
 * Position info for positioning position system
 * TODO
 */
export interface IPSPosition {
}



/**
 * Position info for outdoor positioning system
 */
export interface GPSPosition {
    readonly latitude: number;
    readonly longitude: number;
    readonly altitude: number;
}



/** ************************   ENTITIES DEFINITION BEGIN   ************************* */
export enum MetricType {
    RAW = 'raw',
    DERIVED = 'derived'
}


/**
 * Module types other then SmartModuleType that are also supported by entities
 */
export enum EntityModuleType {
    HOME_APP_PROXY = 'home_app_proxy',
}


export interface EntityDataStoreConfiguration {
    readonly moduleType: SmartModuleType | EntityModuleType;
    readonly moduleInstanceId: string;
    readonly bulkDataLabel: string;
}


/**
 * Type guard function to check if an object is a DataStoreConfiguration
 */
export const isDataStoreConfiguration = (obj: unknown): obj is EntityDataStoreConfiguration => {
    const object = obj as EntityDataStoreConfiguration;
    return [...Object.values(SmartModuleType), ...Object.values(EntityModuleType)].includes(object.moduleType)
        && (typeof object.moduleInstanceId === 'string' && object.moduleInstanceId.length > 0)
        && (typeof object.bulkDataLabel === 'string' && object.bulkDataLabel.length > 0);
};


export interface EntityMetricsDefinition {
    readonly metricsDefinitionId: string;
    readonly metricsType: MetricType;
    readonly tagMetrics: readonly TagMetricInfo[];
    readonly numericMetrics: readonly NumericMetricInfo[];
    readonly dataStoreConfiguration: EntityDataStoreConfiguration;
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
        && isDataStoreConfiguration(object.dataStoreConfiguration);
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
    readonly metricsDefinitions: readonly EntityMetricsDefinition[];
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
         && (object.metricsDefinitions && object.metricsDefinitions.find((metricDef) => {
             return !isEntityMetricsDefinition(metricDef);
         }) === undefined)
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
    readonly metrics: readonly {
        readonly metricsDefinitionId: string;
        readonly metricsId: string;
    }[];
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

/** ************************   ENTITIES DEFINITION END    ************************* */



/**
 * This is base interface for all AppSettings. Each type of MODE app internal or end-user e.g. Ritz, Console, SensorCloud, etc... will have
 * its own app settings therefore this interface is empty and only be used as a placeholder for specific app settings.
 * An AppSettings is an object containing configuration for the app. Some app settings are static e.g. app settings in env files. Some app settings
 * are dynamic and can change at anytime. This interface are for those dynamic app settings. These settings will be loaded from the back end on
 * app load and these settings can be changed without having to rebuild and redeploy the app.
 */
export interface AppSettings {
}


/**
 * These are the list of error code. Note that these error code ARE NOT error code returned by the backend.
 * These are frontend error code. Sometime backend returns the same error code for many different kind of
 * error. To be able to show more descriptive error messages, we will use the backend error code + error message
 * and map them to a more specific error code.
 */
export enum ApiErrorCode {
    // generic errors shared by multiple APIs
    INCORRECT_PASSWORD = 'INCORRECT_PASSWORD',                  // Forbidden error because login password is invalid
    PASSWORD_TOO_SHORT = 'PASSWORD_TOO_SHORT',                  // Forbidden because password is too short
    PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',                    // The password is too weak
    UNKNOWN_EMAIL = 'UNKNOWN_EMAIL',                            // Forbidden error because login email does not exist
    EMAIL_IN_USE = 'EMAIL_IN_USE',                              // Email is already used
    UNAUTHENTICATED_CLIENT = 'UNAUTHENTICATED_CLIENT',          // user is not logged in
    INVALID_AUTH_CODE = 'INVALID_AUTH_CODE',                    // The activate code for activating 2FA is invalid
    AUTHORIZATION_REQUIRED = 'AUTHORIZATION_REQUIRED',          // The user is not authorized to access the user API
    EXCEEDED_MAX_HOMES = 'EXCEEDED_MAX_HOMES',                  // The user can't create new home for user because limit reached
    INVALID_PHONE_NUMBER = 'INVALID_PHONE_NUMBER',              // The phone number provided is invalid
    INVALID_EMAIL = 'INVALID_EMAIL',                            // The email entered is invalid
    MEMBER_EXISTS = 'MEMBER_EXISTS',                            // The member trying to add is already existed in the home
    DEVICE_NOT_CLAIMABLE = 'DEVICE_NOT_CLAIMABLE',              // The user tried to add a device to a home that is not in claim mode
    USER_EXISTS = 'USER_EXISTS',                                // user is already existed
    USER_EXISTS_UNVERIFIED = 'USER_EXISTS_UNVERIFIED',          // user is already existed but not verified
    DEVICE_ALREADY_IN_HOME = 'DEVICE_ALREADY_IN_HOME',          // The user tried to add a device which is already added to the home
    MEMBERS_ONLY = 'MEMBERS_ONLY',                              // The user's session to access the user account has expired
    LAST_OWNER = 'LAST_OWNER',                                  // The user trying remove the only member in a home
    BLOCKING_LOG_REQUEST = 'BLOCKING_LOG_REQUEST',              // Log request can't be created (probably because there is already a pending request)
    DEVICE_OFFLINE = 'DEVICE_OFFLINE',                          // Can't send command to device because it is offline
    EMAIL_DOMAIN_DENIED = 'EMAIL_DOMAIN_DENIED',                // The user tried to log in with external service using an unsupported email domain
    DATABASE_ERROR = 'DATABASE_ERROR',                          // A database error occurred
    PERMISSION_DENIED = 'PERMISSION_DENIED',                    // The user lacks permission to perform the operation
    INSUFFICIENT_AUTH = 'INSUFFICIENT_AUTH',                    // The user lacks sufficient authorization

    // Ritz-specific API errors
    ACCOUNT_OWNER_ONLY = 'ACCOUNT_OWNER_ONLY',                  // agent is not the owner of the resource he is trying to get
    ALREADY_VERIFIED = 'ALREADY_VERIFIED',                      // agent try to verify account that is already verified
    AGENT_EXISTS = 'AGENT_EXISTS',                              // Agent already exists
    AGENT_ONLY = 'AGENT_ONLY',                                  // Agent is unauthenticated edge case
    AGENT_NOT_FOUND = 'AGENT_NOT_FOUND',                        // Agent not found
    VERIFIED_AGENT_ONLY = 'VERIFIED_AGENT_ONLY',                // The agent is not allowed because he has not verified his account
    ADMIN_AGENTS_ONLY = 'ADMIN_AGENTS_ONLY',                    // Logged in user is not an agent
    INVALID_AGENT_ROLE = 'INVALID_AGENT_ROLE',                  // The agent has an insufficient role to access the desired resources
    INVALID_AGENT_ID = 'INVALID_AGENT_ID',                      // Invalid agent ID
    AGENT_UNVERIFIED = 'AGENT_UNVERIFIED',                      // Agent exists but is unverified
    INVALID_TOKEN = 'INVALID_TOKEN',                            // Token is invalid
    PROJECT_AGENTS_ONLY = 'PROJECT_AGENTS_ONLY',                // Agent is somehow accessing something beyond their own scope
    LAST_AGENT = 'LAST_AGENT',                                  // This is a special error where we are removing the agents from the db, but there's one left, so we don't remove him/her

    // ROBOT CLOUD API errors
    MODE_API_ACCESS_DENIED = 'MODE_API_ACCESS_DENIED',
    INVALID_PARAMETER = 'INVALID_PARAMETER',
    REQUEST_STILL_OUTSTANDING = 'REQUEST_STILL_OUTSTANDING',    // the request is not complete really
    REQUEST_INCOMPLETE = 'REQUEST_INCOMPLETE',                  // the request is not complete really
    ACTION_MISMATCH = 'ACTION_MISMATCH',                        // the action passed does not match the action of the document
    UNSUPPORTED_ACTION = 'UNSUPPORTED_ACTION',                  // the action is not supported by RCAPI
    INVALID_FILE_NAME = 'INVALID_FILE_NAME',                    // UI passes an empty name during a C2D create request
    RESULT_ALREADY_SET = 'RESULT_ALREADY_SET',

    // MCRMT-specific API errors
    CONTRACT_HAS_PROJECTS = 'CONTRACT_HAS_PROJECTS',            // The contract has a project associated already
    CUSTOMER_HAS_CONTRACTS = 'CUSTOMER_HAS_CONTRACTS',          // The customer has a contract associated already
    END_DATE_REQUIRED = 'END_DATE_REQUIRED',                    // An end date is required
    INVALID_DATE_DIFF = 'INVALID_DATE_DIFF',                    // A start date is after an end date
    INVALID_BILLING_TYPE = 'INVALID_BILLING_TYPE',              // The billing type is invalid
    INVALID_DAY_OF_MONTH = 'INVALID_DAY_OF_MONTH',              // A day for a particular month doesn't exist
    INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',                  // The date range is invalid
    OPERATOR_NOT_FOUND = 'OPERATOR_NOT_FOUND',                  // The operator doesn't exist
    CUSTOMER_NOT_FOUND = 'CUSTOMER_NOT_FOUND',                  // The customer doesn't exist
    CONTRACT_NOT_FOUND = 'CONTRACT_NOT_FOUND',                  // The customer doesn't exist
    TASK_NOT_FOUND = 'TASK_NOT_FOUND',
    BILLING_ACCOUNT_NOT_FOUND = 'BILLING_ACCOUNT_NOT_FOUND',    // The billing account doesn't exist
    BILL_NOT_FOUND = 'BILL_NOT_FOUND',                          // The bill doesn't exist
    PROJECT_NOT_FOUND = 'PROJECT_NOT_FOUND',                    // The project doesn't exist
    INVALID_PROJECT_THEME = 'INVALID_PROJECT_THEME',            // The theme for the project is invalid
    DEVELOPER_NOT_FOUND = 'DEVELOPER_NOT_FOUND',                // The developer doesn't exist

    // errors reasons created by frontend
    FORBIDDEN = 'FORBIDDEN',                                    // Generic forbidden error if we don't know the specific reason
    NETWORK_ERROR = 'NETWORK_ERROR',                            // CORS error
    INVALID_RESPONSE = 'INVALID_RESPONSE',                      // No response data from backend or response data is not as expected.
    NOT_FOUND = 'NOT_FOUND',                                    // Generic 404 error, Not found
    UNKNOWN = 'UNKNOWN',
}


/**
 * Interface for API call errors object. We will convert all API call errors into this interface
 * so it is easier to use them.
 */
export class ApiError extends Error {

    // The front end error code
    public code: string;

    // Status # from backend e.g. 404, 403, 500, etc...
    public status: number;

    /**
     * @param code - The front end error code, not the same as the response status returned by the backend
     * @param message - The error message. This message should only be used internally to look at errors, not for displaying to agent
     */
    constructor (code: string, status: number, message?: string) {
        super(message);
        this.status = status;
        this.code = code;
    }
}


/**
 * Parse the range data we get from api call response header. The value will be in this format '0-9/210'
 * 0-9 is the start and end indices of the first and last items returned
 * 210 is the total number of item
 * When there are 0 items, the header will be like this "* /0". For this case, we should return 0 for all values.
 */
export const parseDataRange = (range: string | undefined | null): DataRange | undefined => {
    if (range) {
    // We will first split the range string by / to get ['0-9', 210] and then split '0-9' by '-'
    // and then combine them into an array of 3 numbers, start, end, and total
        const [start, end, total] = range.split('/').map((part: string, index: number) => {
            if (index === 0 && part === '*') {
                return ['0', '0'];
            }
            return index === 0 ? part.split('-') : part;
        }).flat();

        // Then return the Range object with the parsed values
        return {
            start: Number(start),
            end  : Number(end),
            total: Number(total),
        };
    }
    return undefined;
};



/**
 * Convert a JSON object to FormData
 * @param dataJSON
 * @returns
 */
export const createFormData = (dataJSON: object): FormData => {
    const formData = new FormData();
    Object.keys(dataJSON).forEach(((key) => {
        formData.append(key, dataJSON[key]);
    }));
    return formData;
};
