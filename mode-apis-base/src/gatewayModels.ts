/**
 * This file contains the interfaces for Gateway definition structure. GatewayDefinition is a GENERIC structure that contains
 * information about a gateway.
 * A Gateway type is a MODE's DeviceClass. We need a way to store metadata for Gateway types but the problem with a DeviceClass is
 * that it has only has 2 properties, id and description. Therefore, Gateway types will have a separate structure call GatewayDefinition
 * which contains all the information about a gateway and how it is configured.
 */


/**
 * Each gateway config prop can be one of these type.
 */
export enum ConfigParamType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
}


// Shortcut for config param value type so that we don't need to repeat this every where
export type ConfigParamValueType = string | number | boolean;


/**
 * The interface for Enum type of config fields options.
 */
export interface ConfigParamOption<T> {
    readonly label: string;
    readonly value: T;
}

/**
 * Base interface for all config params. Every config param MUST have these settings
 */
export interface ConfigParam<T extends ConfigParamValueType> {
    readonly key: string;
    readonly type: ConfigParamType;
    readonly label: string;
    readonly description: string;
    readonly required?: boolean;        // Default is TRUE unless specifically set to false
    readonly default?: T | undefined;   // The default value for this config. Each specific type need to specify the actual type of the value

    // Optional Options. This will add more restriction to what value the user can enter instead of entering any arbitrary value.
    // Use this if this config has a FIXED set of possible values the user can select from.
    readonly options?: readonly ConfigParamOption<T>[] | undefined;

    // This is to handle the case when a config param is only needed if another config param or params have specific value/s
    // This is an ARRAY of of config key/value because it can depends on multiple config values to be true
    // This Array specify the list of config params that ALL need to be true in order for this config to be visible
    readonly dependsOnAllParams?: readonly {
        readonly key: string;
        readonly value: unknown;  // This is type 'unknown' because it depends on the type of the param it depends on.
    }[],

    // This is also to handle the case when a config param is only needed if another config param or params have a specific value
    // The different between this and the 'dependsOnAllParams' is that only ONE of the configs need to have a specific values in order
    // for this config to be visible.
    readonly dependsOnOneParam?: readonly {
        readonly key: string;
        readonly value: unknown;  // This is type 'unknown' because it depends on the type of the param it depends on.
    }[]
}



/**
 * Config params for params of type string
 */
export interface StringConfigParam extends ConfigParam<string> {
    readonly type: ConfigParamType.STRING;
    readonly regex?: string | undefined;
    readonly minLength?: number | undefined;
    readonly maxLength?: number | undefined;
}

/**
 * Config params for params of type number
 */
export interface NumberConfigParam extends ConfigParam<number> {
    readonly type: ConfigParamType.NUMBER;
    readonly min?: number | undefined;
    readonly max?: number | undefined;
}


/**
 * Config params for params of type boolean
 */
export interface BooleanConfigParam extends ConfigParam<boolean> {
    readonly type: ConfigParamType.BOOLEAN;
}



export interface ConfigParamGroup {
    readonly key: string;
    readonly label: string;
    readonly params: readonly ConfigParam<ConfigParamValueType>[];      // Array of ConfigParams instead of Map so we can control the ordering
}


/**
 * A GatewayDriver specify which robot classes it can be used with
 */
export interface GatewayDriver {
    readonly driverName: string;
    readonly robotClasses: readonly string[];
}

export interface GatewayDefinition {
    readonly name?: string | undefined;
    readonly modelId: string;
    readonly deviceClass: string;
    readonly drivers: readonly GatewayDriver[];
    readonly configParams: {
        readonly paramGroups: readonly ConfigParamGroup[];
    }
    readonly createdAt: string;
    readonly updatedAt: string;
}



/**
 * The structure of ConfigData for the gateway will be an Object similar to the config schema, GatewayDefinition.configParams. It will be an Object
 * grouped by group key, instead of an array of group. And for each group, it will contains an Object of key/value where key is the configParam's
 * key and value is the user input value.
 *
 * For example
 *      configData = {
 *          controlServerParameters: {
 *              ipAddress: '127.0.0.1',
 *              port: 1234
 *          },
 *          anotherGroupParameters: {
 *              param1: 10,
 *              param2: 'severity',
 *              param3: true
 *          }
 *      }
 */
export interface GatewayConfigData {
    readonly [groupKey: string]: {
        readonly [configKey: string]: ConfigParamValueType | undefined;
    } | undefined;
}



/**
 * This is the interface for all Gateway config. This config is the result of the user inputs for the GatewayDefinition's configParams.
 * The GatewayDefinition's configParams define the set of properties a GatewayConfig need and the user will provide the value for those
 * params. When the user save the inputs for those params, the result will be this GatewayConfig.
 *
 * We are not using Gateway definition for any other project so we don't really know what
 * attribute a Gateway config has. Therefore we will keep this blank for now. We will add attribute to this structure once we start using
 * for other project and have better idea of what attribute each gateway config must have
 */
export interface GatewayConfig {
}


/**
 * Type guard to check if a config object is a GatewayConfig
 * @param config
 */
export const isGatewayConfig = (config: unknown): config is GatewayConfig => {
    return config !== undefined && typeof config === 'object';
};
