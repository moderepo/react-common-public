/* eslint-disable camelcase */

import {
    RequestMethod, PaginationDataSet, DATA_RANGE_HEADER_KEY, parseDataRange, NumericMetricInfo, TagMetricInfo, LocationType, GatewayDefinition,
} from '@moderepo/mode-apis-base';
import {
    AppProxyAPI, CustomProjectSettings,
} from './AppProxyAPI';



/**
 * How to robot communicate with MODE cloud, direct or through a gateway
 */
export enum RobotCommunicationType {
    DIRECT = 'direct',
    GATEWAY = 'gateway',
}

export interface RobotDefinition {
    readonly robotClass: string;
    readonly modelId: string
    readonly vendor?: string;
    readonly name: string;
    readonly description: string;
    readonly icon: string;
    readonly image: string;
    readonly locationType?: LocationType;
    readonly hasCamera: boolean;
    readonly numericMetrics: readonly NumericMetricInfo[];
    readonly tagMetrics?: readonly TagMetricInfo[] | undefined;
    readonly modeCommunicationType: RobotCommunicationType;
}


/**
 * The list of known numeric metric types. We need a list of these metric type so that we can create more specific feature for them.
 * NOTE: NumericMetricType is NOT the same as metrics' valueName. For example, a NumericMetricType can be 'motor_speed' and a robot can have more
 * than 1 metrics of this type and they can have valueNames like 'wheel_motor_speed', 'arm_motor_speed', 'head_motor_speed'.
 * NumericMetricType will be standard (hopefully) but metrics' valueName can be anything the robot manufacturer want to call. Therefore we can only
 * define constants for NumericMetricType but not metric value names.
 */
export enum RCNumericMetricType {
    BATTERY_LEVEL = 'battery_level',
    BATTERY_LIFE = 'battery_life',
    CONNECTION = 'connection',
    SPEED = 'speed',
    ACCELERATION = 'acceleration',
    RMF = 'rmf',
    NETWORK = 'network',
    RADAR = 'radar',
    LATITUDE = 'latitude',
    LONGITUDE = 'longitude',
    ALTITUDE = 'altitude',
    FLOOR = 'floor',
    WEIGHT = 'weight',
    DOOR = 'door',
    MOTOR_LIFE = 'motor_life'
}


/**
 * Most Metrics' valueNames are not standard EXCEPT for these metrics. We need to standardize these valueNames so that we can use them in the app.
 * If they are not standardized, we won't know how to use them. So below are the list of standardized metrics' value names.
 */
export enum RCNumericMetricValueName {
    LATITUDE = 'gps_lat',
    LONGITUDE = 'gps_lng',
    ALTITUDE = 'gps_alt',
}


/**
 * This is the interface for 1 data point that will published to TSDB by each device/robot. Device will continuously take measurement of the
 * device components e.g. battery, gps location, speed, etc... and publish the values to TSDB. Different type of device/robot will publish different
 * set of values. Therefore, this interface defines only the most common properties that all devices have, RobotSensorData. Each device can publish
 * other sensor data as needed.
 */
export interface RCNumericMetricDataPoint {
    readonly timestamp: string;
    readonly timestampValue: number;            // numeric value of the timestamp for sorting
    readonly values: {                          // The values for each numeric metric. This will just be a map of metricValueName => metricValue
        readonly [metricValueName: string]: number | undefined | null;
    }
}


/**
 * Interface for 1 data point for all tag metric values that have the same timestamp
 */
export interface RCTagMetricDataPoint {
    readonly timestamp: string;
    readonly timestampValue: number;        // numeric value of the timestamp for sorting
    readonly values: {                      // The values for each tag metric. This will just be a map of tagName => tagValue
        readonly [tagName: string]: string | undefined | null;
    };
}


/**
 * Base interface for all TicketSystemSettings
 */
export interface TicketSystemSettings {}

/**
 * System settings fields for Salesforce
 */
export interface SalesforceSettings extends TicketSystemSettings {
    readonly clientId: string;
    readonly clientSecret: string;
    readonly username: string;
    readonly password: string;
    readonly mapping?: {
        readonly sObject: string;
        readonly description: string;
        readonly severity: string;
        readonly originValue: string;
    },
}

export interface AsanaSettings extends TicketSystemSettings {
}

export interface JiraSettings extends TicketSystemSettings {
}

export interface SupportedTicketSystems {
    readonly salesForceSettings: SalesforceSettings;
    readonly asanaSettings: AsanaSettings;
    readonly jiraSettings: JiraSettings;
}


export interface SlackSettings {
    readonly botUserAccessToken: string;
    readonly channels: readonly {
        readonly name: string;
        readonly channelId: string;
    }[];
}

export interface EditableSupportedTicketSystems {
    readonly salesForceSettings: {
        readonly clientId: string;
        readonly clientSecret: string;
        readonly username: string;
        readonly password: string;
        readonly mapping: {
            readonly sObject?: string;
            readonly description?: string;
            readonly severity?: string;
            readonly originValue?: string;
        }
    }
    readonly asanaSettings?: object
    readonly jiraSettings?: object
}

export interface RCProjectSettings extends CustomProjectSettings {
    readonly projectId: number;
    readonly projectApiKey: string;
    readonly tsdbSmartModuleId: string;
    readonly videoSmartModuleId: string;
    readonly supportedTicketSystems: SupportedTicketSystems;
    readonly slackSettings?: SlackSettings | undefined;
    readonly createdAgentId: number;
    readonly createdAt: string;
    readonly updatedAgentId: number;
    readonly updatedAt: string;
}


export interface UpdatableRCProjectSettings {
    readonly projectApiKey?: string | undefined;
    readonly tsdbSmartModuleId?: string |undefined;
    readonly videoSmartModuleId?: string | undefined;
    readonly supportedTicketSystems?: EditableSupportedTicketSystems | undefined;
    readonly slackSettings?: SlackSettings | undefined;
}


export enum MonitorActionType {
    CREATE_ISSUE = 'Issue',
    SEND_EMAIL = 'Email',
    CREATE_TICKET = 'Ticket',
    SLACK_MESSAGE = 'Slack',
}



/**
 * Monitor action params is just an Object of name/value pairs
 */
export interface MonitorActionParams {
    [name: string]: any;
}


const MONITOR_SEVERITY_MINOR: number = 1000;
const MONITOR_SEVERITY_WARN: number = 6000;
const MONITOR_SEVERITY_CRITICAL: number = 11000;

/**
 * Set of possible severity level a monitor can have
 */
export enum MonitorSeverity {
    MINOR = MONITOR_SEVERITY_MINOR,
    WARN = MONITOR_SEVERITY_WARN,
    CRITICAL = MONITOR_SEVERITY_CRITICAL,
}


/**
 * Device's heath is based on Monitor's severity. For example, if a device has a monitor with CRITICAL severity then the robot's health is in critical
 * condition. Therefore, we should use the same value as MonitorSeverity for RobotHealthCondition enum so that we can easily compare them.
 */
export enum RobotHealthCondition {
    UNKNOWN = -1,
    NORMAL = 0,
    MINOR = MONITOR_SEVERITY_MINOR,
    WARN = MONITOR_SEVERITY_WARN,
    CRITICAL = MONITOR_SEVERITY_CRITICAL,
}



export enum TicketSystemType {
    SALESFORCE = 'SalesForce',
    ASANA = 'Asana',
    JIRA = 'Jira',
}



/**
 * The monitor params for Send email monitor action. To send an email when an alert happen, we will need these parameters
 */
export interface SendEmailMonitorActionParams extends MonitorActionParams {
    readonly email: string;
    readonly subject: string;
    readonly body: string;
}


/**
 * The monitor recovery params for send email monitor action. When the monitor is recovered, we will send email to the same recipient
 * with these params.
 */
export interface SendEmailMonitorActionRecoveryParams extends MonitorActionParams {
    readonly subject: string;
    readonly body: string;
}



/**
 * The monitor params for create issue monitor action. To create an when an alert happen, we will need these parameters
 */
export interface CreateIssueMonitorActionParams extends MonitorActionParams {
    readonly description: string;
}


/**
 * The monitor recovery params for create issue monitor action. When the alert is recovered, the issue will be updated with these params
 */
export interface CreateIssueMonitorActionRecoveryParams extends MonitorActionParams {
    readonly comment: string;
}


/**
 * The monitor recovery params for create ticket action. When the alert is recovered, the issue will be updated with these params
 */
export interface CreateTicketMonitorActionRecoveryParams extends MonitorActionParams {
    // TODO - Define the list of params required for this recover action
}


/**
 * The monitor params for create ticket monitor action. To create a ticket when an alert happen, we will need these parameters
 */
export interface CreateTicketMonitorActionParams extends MonitorActionParams {
    readonly systemType: TicketSystemType;

    // We don't have a specific list of params for each system. Each system will probably require a different
    // set of params for creating tickets
    readonly parameters: {
        [key: string]: any
    };
}


/**
 * The params for posting slack message monitor action. To post a message to Slack when an alert happen, we will need these parameters
 */
export interface SlackMessageMonitorActionParams extends MonitorActionParams {
    readonly channelId: string;
    readonly message: string;
    readonly iconEmoji?: string | undefined;
    readonly username?: string | undefined;
}


/**
 * The params for posting slack message monitor action. To post a message to Slack when an alert recover, we will need these parameters
 */
export interface SlackMessageMonitorActionRecoveryParams extends MonitorActionParams {
    readonly message: string;
    readonly iconEmoji?: string | undefined;
    readonly username?: string | undefined;
}


/**
 * The base class of all monitor action. All monitor action will need a 'type' and some 'parameters'. What type or parameters are required will
 * depend on specific monitor
 */
export interface MonitorAction {
    readonly type: MonitorActionType;
    readonly parameters: MonitorActionParams
    readonly recoveryParameters?: MonitorActionParams | undefined;
}


/**
 * A monitor action for sending email.
 */
export interface SendEmailMonitorAction extends MonitorAction {
    readonly type: MonitorActionType.SEND_EMAIL,
    readonly parameters: SendEmailMonitorActionParams;
    readonly recoveryParameters?: SendEmailMonitorActionRecoveryParams | undefined;
}


/**
 * An monitor action for creating an Issue
 */
export interface CreateIssueMonitorAction extends MonitorAction {
    readonly type: MonitorActionType.CREATE_ISSUE,
    readonly parameters: CreateIssueMonitorActionParams;
    readonly recoveryParameters?: CreateIssueMonitorActionRecoveryParams | undefined;
}


/**
 * An monitor action for creating a Ticket
 */
export interface CreateTicketMonitorAction extends MonitorAction {
    readonly type: MonitorActionType.CREATE_TICKET,
    readonly parameters: CreateTicketMonitorActionParams;
    readonly recoveryParameters?: CreateTicketMonitorActionRecoveryParams | undefined;
}


/**
 * An monitor action for posting a message on Slack
 */
export interface SlackMessageMonitorAction extends MonitorAction {
    readonly type: MonitorActionType.SLACK_MESSAGE,
    readonly parameters: SlackMessageMonitorActionParams;
    readonly recoveryParameters?: SlackMessageMonitorActionRecoveryParams | undefined;
}



export enum ComparisonOperator {
    LESS_THAN = 'lt',
    LESS_THAN_OR_EQUAL = 'le',
    EQUAL = 'eq',
    GREATER_THAN_OR_EQUAL = 'ge',
    GREATER_THAN = 'gt',
}


export enum LogicalOperator {
    AND = 'and',
    OR = 'or',
}


/**
 * A sensor measurement expression that resolve to true/false. Here are some example expressions
 *
 * expression = battery_level < 5
 * expression = weight > 100
 */
export interface MeasurementCondition {
    readonly measurement: {
        readonly valueName: string;
    };
    readonly operator: ComparisonOperator;
    readonly value: number;
}



export enum MonitorConditionThresholdType {
    CONTINUOUS_COUNT = 'continuousCount',
    DURATION_COUNT = 'durationCount',
}

export interface MonitorConditionThresholdParams {
}

export interface ContinuousCountThresholdParams extends MonitorConditionThresholdParams {
    readonly count: number;
}

export interface MovingAverageThresholdParams extends MonitorConditionThresholdParams {
    readonly count: number;
    readonly duration: number;
}

/**
 * The MonitorConditionThreshold base type
 */
export interface MonitorConditionThreshold {
    readonly type: MonitorConditionThresholdType;
    readonly parameters: MonitorConditionThresholdParams;
}

export interface ContinuousCountThreshold extends MonitorConditionThreshold {
    readonly type: MonitorConditionThresholdType.CONTINUOUS_COUNT;
    readonly parameters: ContinuousCountThresholdParams;
}

export interface MovingAverageThreshold extends MonitorConditionThreshold {
    readonly type: MonitorConditionThresholdType.DURATION_COUNT;
    readonly parameters: MovingAverageThresholdParams;
}



/**
 * A condition that need to be satisfied to trigger an alert. An monitor condition can have 1 or 2 boolean expression joined by a
 * logical operator e.g.
 *
 * condition = leftExpression
 * condition = leftExpression && rightExpression
 * condition = leftExpression || rightExpression
 *
 */
export interface MonitorCondition {
    readonly left: MeasurementCondition;
    readonly operator?: LogicalOperator;
    readonly right?: MeasurementCondition;
    readonly threshold: ContinuousCountThreshold | MovingAverageThreshold;
}



export enum MonitorTargetType {
    ROBOT_CLASS = 'RobotClass',
    ROBOT_ID = 'RobotId'
}



export enum MissingDataTreatment {
    SATISFIED = 'satisfied',
    UNSATISFIED = 'unsatisfied',
    IGNORED = 'ignored'
}


/**
 * A structure to define the rule on when/how an Issue should be generated
 */
export interface Monitor {
    readonly id: number;
    readonly name: string;
    readonly description: string;
    readonly severity: MonitorSeverity;
    readonly projectId: number;
    readonly targetType: MonitorTargetType;
    readonly targetRobotId?: string;
    readonly targetRobotClass?: string;
    readonly targetHomeId?: number;
    readonly condition: MonitorCondition;
    readonly treatMissingDataAs: MissingDataTreatment;
    readonly sampleInterval: number;
    readonly actions: readonly MonitorAction[];
    readonly createdAgentId: number;
    readonly createdAt: string;
    readonly updatedAgentId: number;
    readonly updatedAt: string;
    readonly disabled: boolean;
}


/**
 * The set up monitor fields that can be updated.
 */
export interface EditableMonitorData {
    readonly name?: string;
    readonly description?: string;
    readonly severity?: MonitorSeverity,
    readonly targetType?: MonitorTargetType;
    readonly targetRobotClass?: string | undefined;        // undefined if MonitorTargetType is RobotId
    readonly targetRobotId?: string | undefined;           // Undefined if MonitorTargetType is RobotClass
    readonly targetHomeId?: number;
    readonly condition?: MonitorCondition;
    readonly treatMissingDataAs?: MissingDataTreatment;
    readonly sampleInterval?: number;
    readonly actions?: readonly MonitorAction[];
    readonly disabled?: boolean;
}



/**
 * The condition value that triggered the alert and caused an issue to be generated.
 */
export interface IssueConditionValue {
    readonly collectionId: string;
    readonly valueName: string;
    readonly value?: number;
    readonly timestamp: string;
}



/**
 * An issue object.
 */
export interface Issue {
    readonly id: number;
    readonly projectId: number;
    readonly deviceId?: number | undefined;
    readonly robotId: string;
    readonly homeId: number;
    readonly alertMetadata: Monitor;
    readonly alertConditionId?: number;
    readonly conditionValues?: readonly IssueConditionValue[] | undefined;
    readonly severity: MonitorSeverity;
    readonly description: string;
    readonly ticketLink?: string;
    readonly createdAgentId?: number;
    readonly createdAt: string;
    readonly resolvedAgentId?: number;
    readonly resolvedAt?: string;
}


/**
 * Fetch issues API has a lot of filter options. So instead of defining this list in multiple places, we will create an Interface for these
 * filters so that it is easier to use and make changes in the future.
 */
// TODO - Make skip/limit optional
export interface FetchIssueFilters {
    readonly skip: number;
    readonly limit: number;
    readonly alertConditionId?: number;
    readonly homeId?: number;
    readonly deviceId?: number;
    readonly robotId?: string;
    readonly resolved?: boolean;
    readonly severity?: number;
    readonly createdAgentId?: number;
    readonly createdAt?: string;
    readonly resolvedAgentId?: number;
    readonly resolvedAt?: string;
}


/**
 * Fetch Robots API has a lot of filter options. So instead of defining this list in multiple places, we will create an Interface for these
 * filters so that it is easier to use and make changes in the future.
 */
// TODO - Make skip/limit optional
export interface FetchRobotFilters {
    readonly skip: number;
    readonly limit: number;
    readonly homeId?: number;
    readonly deviceId?: number
    readonly robotClasses?: string;
}


export interface Comment {
    readonly id: number;
    readonly projectId: number;
    readonly issueId: number;
    readonly message: string;
    readonly agentId: number;
    readonly createdAt: string;
    readonly sysGenerated: boolean;
}


export interface AlertStatus {
    readonly id: number;
    readonly severity: MonitorSeverity;
    readonly alertConditionId: number;
    readonly name: string;                  // The name of the Monitor that this AlertStatus belonged to
    readonly description: string;           // The description of the Monitor that this AlertStatus belonged to
    readonly createdCondition: MonitorCondition;
    readonly createdAt: string;
}


/**
 * This is the interface for a Device's health status data. This contains information about the device's health condition, not online/offline
 * status. The "alertStatuses" will contain all the Monitor conditions, tied to the device, that are satisfied.
 */
export interface RobotStatus {
    readonly projectId: number;
    readonly robotId: string;
    readonly robotClass: string;
    readonly homeId: number;
    readonly alertStatuses: readonly AlertStatus[];
}


export interface RobotInfo {
    readonly id: string;
    readonly projectId: number;
    readonly homeId: number;
    readonly deviceId?: number | null | undefined;
    readonly robotClass: string;
    readonly driverName?: string | undefined,
    readonly name?: string | undefined;
    readonly overrideRobotDefinition?: RobotDefinition | undefined;
    readonly createdAt: string;
    readonly updatedAt?: string;
    readonly status?: RobotStatus | undefined;
}



/* -------------------------------  BEGIN MODELS FOR FILE REQUEST FEATURE  ---------------------------------------- */

export enum FileRequestStatus {
    INITIATED = 'initiated',
    PENDING = 'pending',
    RECEIVING = 'receiving',
    SUCCEEDED = 'succeeded',
    WARNING = 'warning',
    FAILED = 'failed',
    TIME_OUT = 'timed_out',
    CANCELLING = 'cancelling',
    CANCELED = 'canceled',
    NOT_FOUND = 'not_found',
}


export enum FileRequestTarget {
    ROBOT = 'robot',
    DEVICE = 'device',
    CONTROL_SERVER = 'control_server',
    CLOUD = 'cloud',
}


export enum FileRequestAction {
    UPLOAD_TO_ROBOT = 'cloud_to_robot',
    UPLOAD_TO_DEVICE = 'cloud_to_device',
    UPLOAD_TO_CONTROL_SERVER = 'cloud_to_control_server',
    DOWNLOAD_FROM_ROBOT = 'robot_to_cloud',
    DOWNLOAD_FROM_DEVICE = 'device_to_cloud',
    DOWNLOAD_FROM_CONTROL_SERVER = 'control_server_to_cloud',
    CANCEL = 'cancel',
}


export interface FileRequestResult {
    readonly resultType: FileRequestAction;
}


export interface DownloadFileRequestResult extends FileRequestResult {
    readonly resultType: FileRequestAction.DOWNLOAD_FROM_DEVICE
    | FileRequestAction.DOWNLOAD_FROM_CONTROL_SERVER
    | FileRequestAction.DOWNLOAD_FROM_ROBOT;
    readonly fileSetSize: number;
    readonly fileSetChecksum: string;
}


export interface UploadFileRequestResult extends FileRequestResult {
    readonly resultType: FileRequestAction.UPLOAD_TO_DEVICE | FileRequestAction.UPLOAD_TO_CONTROL_SERVER | FileRequestAction.UPLOAD_TO_ROBOT;
}


export interface FileRequest {
    readonly id: number;
    readonly homeId: number;
    readonly deviceId: number;
    readonly robotId?: string | undefined;
    readonly target: FileRequestTarget;
    readonly action: FileRequestAction;
    readonly status: FileRequestStatus;
    readonly errorMessage?: string | undefined;
    readonly results?: FileRequestResult | undefined;
    readonly createdAt: string;
    readonly updatedAt: string;
    readonly expirationDate: string;
}


/**
 * Type guard function to check if the given object is a FileRequest
 * @param object
 * @returns
 */
export const isFileRequest = (object: unknown): object is FileRequest => {
    const request = object as FileRequest;
    return request && typeof request.id === 'number' && typeof request.homeId === 'number' && typeof request.deviceId === 'number'
        && Object.values(FileRequestTarget).includes(request.target)
        && Object.values(FileRequestAction).includes(request.action)
        && Object.values(FileRequestStatus).includes(request.status)
        && typeof request.createdAt === 'string'
        && typeof request.updatedAt === 'string';
};


export interface DownloadFileRequest extends FileRequest {
    readonly action: FileRequestAction.DOWNLOAD_FROM_DEVICE | FileRequestAction.DOWNLOAD_FROM_CONTROL_SERVER | FileRequestAction.DOWNLOAD_FROM_ROBOT;

    readonly results?: DownloadFileRequestResult | undefined;

    // Additional data we passed to the backend when we created the request
    readonly parameters: {
        readonly fileType: string;
        readonly fetchFileParameters: {
            readonly begin: string;
            readonly end: string;
        };
    };
}


/**
 * Type guard function to check if the given object is a DownloadFileRequest
 * @param object
 * @returns
 */
export const isDownloadFileRequest = (object: unknown): object is DownloadFileRequest => {
    const request = object as DownloadFileRequest;
    return request && isFileRequest(request)
        && (request.action === FileRequestAction.DOWNLOAD_FROM_DEVICE
                || request.action === FileRequestAction.DOWNLOAD_FROM_CONTROL_SERVER
                || request.action === FileRequestAction.DOWNLOAD_FROM_ROBOT)
        && request.parameters
        && typeof request.parameters.fileType === 'string'
        && request.parameters.fetchFileParameters
        && typeof request.parameters.fetchFileParameters.begin === 'string'
        && typeof request.parameters.fetchFileParameters.end === 'string';
};


export interface UploadFileRequest extends FileRequest {
    readonly action: FileRequestAction.UPLOAD_TO_DEVICE | FileRequestAction.UPLOAD_TO_CONTROL_SERVER | FileRequestAction.UPLOAD_TO_ROBOT;
    readonly results?: UploadFileRequestResult | undefined;

    // Additional data we passed to the backend when we created the request
    readonly parameters: {
        readonly fileType?: string | undefined;
        readonly fileName: string;
        readonly fileSetSize: number;
        readonly fileSetChecksum: string;
    };
}


/**
 * Type guard function to check if the given object is a UploadFileRequest
 * @param object
 * @returns
 */
export const isUploadFileRequest = (object: unknown): object is UploadFileRequest => {
    const request = object as UploadFileRequest;
    return request && isFileRequest(request)
        && (request.action === FileRequestAction.UPLOAD_TO_DEVICE
                || request.action === FileRequestAction.UPLOAD_TO_CONTROL_SERVER
                || request.action === FileRequestAction.UPLOAD_TO_ROBOT)
        && request.parameters
        && (request.parameters.fileType === undefined || typeof request.parameters.fileType === 'string')
        && typeof request.parameters.fileName === 'string'
        && typeof request.parameters.fileSetSize === 'number'
        && typeof request.parameters.fileSetChecksum === 'string';
};



/**
 * The filters that can be used when fetching for file download/upload requests
 */
// TODO - Make skip/limit optional
export interface FetchFileRequestFilters {
    readonly limit: number;
    readonly skip: number;
    readonly deviceId?: number | undefined;
    readonly robotId?: string | undefined;
    readonly target?: FileRequestTarget | undefined;
    readonly action?: FileRequestAction | undefined;
    readonly status?: FileRequestStatus | undefined;
    readonly createdBefore?: string | undefined;
    readonly createdAfter?: string | undefined;
}


/**
 * The interface for the response data returned by the Create UPLOAD file request
 */
export interface CreateUploadFileRequestResponse {
    // The ID of the new file request
    readonly id: number;

    // The Upload S3 URL which the caller need to call to upload the file from browser to S3
    readonly uploadUrl: string;
}
/* -------------------------------  END MODELS FOR FILE REQUEST FEATURE  ---------------------------------------- */



/**
 * This is the class used for making API call to Robot Cloud server. Robot Cloud server uses App Proxy therefore we will be making the RC API call
 * through Maze, AppAPI.
 */
export class RobotCloudAPI extends AppProxyAPI {



    // Singleton instance of RobotCloud API.
    private static rcInstance: RobotCloudAPI;



    /**
     * Return an Instance of RobotCloudAPI. This is what dev should be using to get an instance of RobotCloudAPI
     * and use it to make API call.
     */
    public static getInstance (): RobotCloudAPI {
        if (!RobotCloudAPI.rcInstance) {
            RobotCloudAPI.rcInstance = new RobotCloudAPI();
        }
        return RobotCloudAPI.rcInstance;
    }


    /**
     * Load all robot definitions for a specific project
     * @param projectId
     */
    public async getRobotCatalog (projectId: number): Promise<readonly RobotDefinition[]> {
        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/robotDefinitions`);
        if (response.data instanceof Array) {
            return response.data as readonly RobotDefinition[];
        }
        return [];
    }


    /**
     * TODO - Remove this function because it shouldn't be done by Ritz. This should be done by some other tools
     *
     * Add RobotDefinition
     * @param projectId
     * @param robotDef
     */
    public async createRobotDefinition (projectId: number, robotDef: RobotDefinition): Promise<void> {
        await this.sendRequest(RequestMethod.POST, `projects/${projectId}/appProxy/rcp/robotDefinitions`, robotDef);
    }



    /**
     * TODO - Remove this function because it shouldn't be done by Ritz. This should be done by some other tools
     *
     * Update RobotDefinition
     * @param projectId
     * @param robotClass
     * @param robotDef
     */
    public async updateRobotDefinition (projectId: number, robotClass: string, robotDef: RobotDefinition): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `projects/${projectId}/appProxy/rcp/robotDefinitions/${robotClass}`, robotDef);
    }



    /**
     * Get the list of Monitors created for a project
     * @param projectId
     * @param skip
     * @param limit
     */
    // TODO - Make skip/limit optional
    public async getMonitors (projectId: number, skip: number, limit: number, filters?: {
        readonly robotClass?: string;
        readonly robotId?: number
    }): Promise<PaginationDataSet<Monitor>> {

        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/alertConditions`, {
            limit, skip, ...filters,
        });

        if (response.data instanceof Array) {
            return {
                range: parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]),
                items: response.data as readonly Monitor[],
            };
        }
        return {
            range: {
                start: 0, end: 0, total: 0,
            },
            items: [],
        };
    }


    /**
     * Get 1 Monitor by id
     * @param projectId
     * @param id
     */
    public async getMonitor (projectId: number, id: number): Promise<Monitor> {
        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/alertConditions/${id}`);
        return response.data as Monitor;
    }


    public async createMonitor (projectId: number, agentId: number, data: EditableMonitorData): Promise<{alertConditionId: number}> {
        const response = await this.sendRequest(RequestMethod.POST, `projects/${projectId}/appProxy/rcp/alertConditions`, {
            ...data,
            agentId,
            projectId,
        });

        return response.data;
    }


    public async updateMonitor (projectId: number, agentId: number, monitorId: number, data: EditableMonitorData): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `projects/${projectId}/appProxy/rcp/alertConditions/${monitorId}`, {
            ...data,
            agentId,
            projectId,
        });
    }


    /**
     * Delete a monitor by id
     * @param projectId
     * @param agentId
     * @param id
     */
    public async deleteMonitor (projectId: number, id: number): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `projects/${projectId}/appProxy/rcp/alertConditions/${id}`);
    }



    /**
     * Get the list of Issues created for a project
     * @param projectId
     * @param filters - The search filters for Issues
     */
    public async getIssues (projectId: number, filters: FetchIssueFilters): Promise<PaginationDataSet<Issue>> {
        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/issues`, filters);

        if (response.data instanceof Array) {
            return {
                range: parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]),
                items: response.data as readonly Issue[],
            };
        }
        return {
            range: {
                start: 0, end: 0, total: 0,
            },
            items: [],
        };
    }


    /**
     * Get 1 Issue by id
     * @param projectId
     * @param id
     */
    public async getIssue (projectId: number, id: number): Promise<Issue> {
        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/issues/${id}`);
        return response.data as Issue;
    }


    /**
     * Create an Issue for the specified home. NOTE: homeId is not part of the Issue data therefore it is not included in the data object.
     */
    public async createIssue (projectId: number, agentId: number, data: {
        homeId: number,
        deviceId: number | undefined,
        robotId: string;
        severity: MonitorSeverity;
        description: string;
        ticketLink?: string | undefined;
    }): Promise<number> {

        const response = await this.sendRequest(RequestMethod.POST, `projects/${projectId}/appProxy/rcp/agents/${agentId}/issues`, {
            homeId     : data.homeId,
            deviceId   : data.deviceId,
            robotId    : data.robotId,
            severity   : data.severity,
            description: data.description,
            ticketLink : data.ticketLink,
            resolvedAt : null,
        });

        return response.data;
    }



    /**
     * Update an Issue
     * @param projectId
     * @param agentId
     * @param issueId
     * @param data
     */
    public async updateIssue (projectId: number, agentId: number, issueId: number, data: {
        description?: string | undefined,
        severity?: MonitorSeverity | undefined,
        ticketLink?: string | undefined,
        resolvedAgentId?: number | undefined,
        unresolved?: boolean | undefined,
    }): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `projects/${projectId}/appProxy/rcp/issues/${issueId}`, {
            description    : data.description,
            severity       : data.severity,
            ticketLink     : data.ticketLink,
            resolvedAgentId: data.resolvedAgentId,
            resolvedAt     : data.resolvedAgentId !== undefined ? (new Date()).toISOString() : undefined,  // TODO - remove this when backend is fixed
            unresolved     : data.unresolved,
            agentId,
            projectId,
        });
    }


    /**
     * Delete an issue by id
     */
    public async deleteIssue (projectId: number, id: number): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `projects/${projectId}/appProxy/rcp/issues/${id}`);
    }



    /**
     * Get all Comments belonged to a specific issue
     * @param projectId
     * @param issueId
     */
    public async getAllIssueComments (projectId: number, issueId: number): Promise<PaginationDataSet<Comment>> {
        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/issues/${issueId}/comments`);
        if (response.data instanceof Array) {
            return {
                range: parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]),
                items: response.data as readonly Comment[],
            };
        }
        return {
            range: {
                start: 0, end: 0, total: 0,
            },
            items: [],
        };
    }



    /**
     * Get 1 Comment from a specific issue
     * @param projectId - The id of the project the issue belonged to
     * @param issueId - The id of the issue the comment belonged to
     * @param commentId - The id of the comment to fetch
     */
    public async getIssueComment (projectId: number, issueId: number, commentId: number): Promise<Comment> {
        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/issues/${issueId}/comments/${commentId}`);
        return response.data as Comment;
    }


    /**
     * Add a comment to an issue
     * @param projectId - The id of the project the issue belonged to
     * @param issueId - The id of the issue the comment belonged to
     * @param agentId - The id of the agent that make the comment
     * @param message - The message for the comment
     */
    public async addCommentForIssue (projectId: number, issueId: number, agentId: number, message: string): Promise<void> {
        await this.sendRequest(RequestMethod.POST, `projects/${projectId}/appProxy/rcp/issues/${issueId}/comments`, {
            agentId, message,
        });
    }


    /**
     * Update a comment for an issue
     * @param projectId - The id of the project the issue belonged to
     * @param issueId - The id of the issue the comment belonged to
     * @param commentId - The id of the comment to update
     * @param message - The updated message
     */
    public async updateCommentForIssue (projectId: number, issueId: number, commentId: number, message: string): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `projects/${projectId}/appProxy/rcp/issues/${issueId}/comments/${commentId}`, {
            message,
        });
    }


    /**
     * Delete a comment from an issue
     * @param projectId - The id of the project the issue belonged to
     * @param issueId - The id of the issue the comment belonged to
     * @param commentId - The id of the comment to delete
     */
    public async deleteCommentFromIssue (projectId: number, issueId: number, commentId: number): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `projects/${projectId}/appProxy/rcp/issues/${issueId}/comments/${commentId}`);
    }



    /**
     * Get RobotCloud project settings
     * @param projectId
     */
    public async getProjectSettings (projectId: number): Promise<RCProjectSettings> {
        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/settings`);
        return response.data as RCProjectSettings;
    }


    /**
     * Update RobotCloud ProjectSettings
     * @param projectId
     * @param settings
     */
    public async updateProjectSettings (projectId: number, settings: UpdatableRCProjectSettings): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `projects/${projectId}/appProxy/rcp/settings`, settings);
    }


    /**
     * Get a device's health status
     * @param homeId
     * @param robotId
     */
    public async getRobotStatus (homeId: number, robotId: string): Promise<RobotStatus> {
        const response = await this.sendRequest(RequestMethod.GET, `homes/${homeId}/appProxy/rcp/devices/${robotId}/robotStatus`);
        return response.data as RobotStatus;
    }


    /**
     * Get a device's health status for a specified list of devices
     * @param homeId
     * @param robotIds
     */
    public async getRobotStatusesByIds (homeId: number, robotIds: readonly string[]): Promise<readonly RobotStatus[]> {
        const response = await this.sendRequest(RequestMethod.GET, `homes/${homeId}/appProxy/rcp/robotStatuses`, {
            robotIds: `${robotIds.join(',')}`,
        });
        return response.data as RobotStatus[];
    }



    /**
     * Get the list of robots created for a project
     * @param projectId
     * @param skip
     * @param limit
     */
    public async getRobots (projectId: number, filters: FetchRobotFilters): Promise<PaginationDataSet<RobotInfo>> {
        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/robots`, filters);


        // if there is data returned, check to see if it is NEW data format or old data format
        // If old format, response.data is an array of RobotInfo
        // If new format, response.data is an array of objects which contains Robot and Status
        const formattedData = response.data
            ? response.data.map((data: any) => {
                if (data.robot) {
                    // new format, data is an object that contain robot and status. We will combine them into 1 RobotInfo object by placing
                    // the "status" object inside of RobotInfo object
                    return {
                        ...data.robot,
                        status: data.status,
                    };
                }
                return data;    // old format, data IS a RobotInfo
            })
            : [];   // Make sure it is an empty array if there is no robot

        return {
            range: parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]),
            items: formattedData as readonly RobotInfo[],
        };
    }


    /**
     * Get 1 Robot by id
     * @param homeId
     * @param id
     */
    public async getRobotById (homeId: number, id: string): Promise<RobotInfo> {
        const response = await this.sendRequest(RequestMethod.GET, `homes/${homeId}/appProxy/rcp/robots/${id}`);

        // if there is data returned, check to see if it is NEW data format or old data format
        // If old format, response.data is a RobotInfo object
        // If new format, response.data is an objects which contains Robot and Status
        const formattedData = response.data?.robot
            ? {
                ...response.data.robot,
                status: response.data.status,
            }
            : response.data;

        return formattedData as RobotInfo;
    }


    /**
     * Create a Robot with the specified robotData and add it to the given homeId
     * @param homeId
     * @param robotData
     */
    public async createRobot (homeId: number, robotData: {
        readonly id: string;
        readonly robotClass: string;
        readonly driverName?: string;
        readonly deviceId?: number,
        readonly name?: string | undefined;
        readonly overrideRobotDefinition?: RobotDefinition | undefined;
    }): Promise<RobotInfo> {
        const response = await this.sendRequest(RequestMethod.POST, `homes/${homeId}/appProxy/rcp/robots`, {
            ...robotData, homeId,
        });
        return response.data as RobotInfo;
    }


    /**
     * Update a Robot
     * @param homeId
     * @param robotId
     * @param robotData
     */
    public async updateRobot (homeId: number, robotId: string, robotData: {
        readonly deviceId?: number | null | undefined;
        readonly name?: string | null | undefined;
        readonly driverName?: string | null | undefined;
        readonly overrideRobotDefinition?: RobotDefinition | null | undefined;
    }): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `homes/${homeId}/appProxy/rcp/robots/${robotId}`, robotData);
    }


    /**
     * Delete a Robot
     * @param homeId
     * @param robotId
     */
    public async deleteRobot (homeId: number, robotId: string): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `homes/${homeId}/appProxy/rcp/robots/${robotId}`);
    }


    /**
     * Load all Gateway definitions for a specific project
     * @param projectId
     */
    public async getGatewayCatalog (projectId: number): Promise<readonly GatewayDefinition[]> {
        const response = await this.sendRequest(RequestMethod.GET, `projects/${projectId}/appProxy/rcp/deviceDefinitions`);
        return response.data as GatewayDefinition[];
    }



    /**
     * Get ONE file request by request ID. This can be used for fetching both file Download or Upload requests
     * @param homeId
     * @param requestId
     * @returns
     */
    public async getFileRequestById (homeId: number, requestId: number): Promise<FileRequest> {
        const response = await this.sendRequest(RequestMethod.GET, `homes/${homeId}/appProxy/rcp/fileProcessor/requests/${requestId}`);
        return response.data as FileRequest;
    }


    /**
     * Get ALL file requests filtered by the specified filters
     * @param homeId
     * @param filters
     * @returns
     */
    public async getAllFileRequests (homeId: number, filters: FetchFileRequestFilters): Promise<PaginationDataSet<FileRequest>> {
        const response = await this.sendRequest(RequestMethod.GET, `homes/${homeId}/appProxy/rcp/fileProcessor/requests`, filters);

        if (response.data instanceof Array) {
            return {
                range: parseDataRange(response.headers[DATA_RANGE_HEADER_KEY]),
                items: response.data as readonly FileRequest[],
            };
        }
        return {
            range: {
                start: 0, end: 0, total: 0,
            },
            items: [],
        };
    }


    /**
     * Get the download URL for a DOWNLOAD file transfer request. Once a download file request is ready and the file is pushed to S3, the agent
     * can make a request to get the download link and start downloading the file.
     * NOTE: this link has an expiration time so it can not be cached and reused for a very long time. Maybe 1 day max.
     * @param homeId
     * @param requestId
     * @returns
     */
    public async getDownloadFileRequestDownloadURL (homeId: number, requestId: number): Promise<string> {
        const response = await this.sendRequest(RequestMethod.GET, `homes/${homeId}/appProxy/rcp/fileProcessor/requests/${requestId}/d2c`);
        return response.data as string;
    }



    /**
     * Create a request to UPLOAD a file to a DEVICE or CONTROL SERVER. This will only create a request and return a URL to S3 which the
     * caller need to call to upload the file to. This API does not upload any file.
     * @param homeId
     * @param deviceId
     * @returns
     */
    public async createUploadFileRequest (
        homeId: number, deviceId: number, fileName: string,
        useCustomDriver: boolean,
        action: FileRequestAction.UPLOAD_TO_DEVICE| FileRequestAction.UPLOAD_TO_CONTROL_SERVER,
        target: FileRequestTarget.DEVICE | FileRequestTarget.CONTROL_SERVER,
    ): Promise<CreateUploadFileRequestResponse> {
        const response = await this.sendRequest(RequestMethod.POST, `homes/${homeId}/appProxy/rcp/fileProcessor/requests`, {
            homeId,
            deviceId,
            target,
            action,
            fileName,
            useCustomDriver,
        });
        return response.data as CreateUploadFileRequestResponse;
    }


    /**
     * Create a request to UPLOAD a file to a DEVICE. This will only create a request and return a URL to S3 which the caller need to call
     * to upload the file to. This API does not upload any file.
     * @param homeId
     * @param deviceId
     * @returns
     */
    public async createUploadFileToDeviceRequest (
        homeId: number, deviceId: number, fileName: string, useCustomDriver: boolean,
    ): Promise<CreateUploadFileRequestResponse> {
        return this.createUploadFileRequest(
            homeId, deviceId, fileName, useCustomDriver, FileRequestAction.UPLOAD_TO_DEVICE, FileRequestTarget.DEVICE,
        );
    }


    /**
     * Create a request to UPLOAD a file to a CONTROL SERVER. This will only create a request and return a URL to S3 which the caller need to call
     * to upload the file to. This API does not upload any file.
     * @param homeId
     * @param deviceId
     * @returns
     */
    public async createUploadFileToControlServerRequest (
        homeId: number, deviceId: number, fileName: string, useCustomDriver: boolean,
    ): Promise<CreateUploadFileRequestResponse> {
        return this.createUploadFileRequest(
            homeId, deviceId, fileName, useCustomDriver, FileRequestAction.UPLOAD_TO_CONTROL_SERVER, FileRequestTarget.CONTROL_SERVER,
        );
    }


    /**
     * Create a request to UPLOAD a file to all ROBOTS. This will only create a request and return a URL to S3 which the caller need to call
     * to upload the file to. This API does not upload any file.
     * @param homeId
     * @param deviceId
     * @returns
     */
    public async createUploadFileToRobotsRequest (
        homeId: number, deviceId: number, fileName: string, useCustomDriver: boolean,
    ): Promise<CreateUploadFileRequestResponse> {
        const response = await this.sendRequest(RequestMethod.POST, `homes/${homeId}/appProxy/rcp/fileProcessor/requests`, {
            homeId,
            deviceId,
            target: FileRequestTarget.ROBOT,
            action: FileRequestAction.UPLOAD_TO_ROBOT,
            fileName,
            useCustomDriver,
        });
        return response.data as CreateUploadFileRequestResponse;
    }



    /**
     * Once a file is uploaded to S3 successfully from frontend, call this API to update the file upload request's status and metadata. This
     * will notify the backend that the file is already uploaded S3 and now it can start download that file to the DEVICE or CONTROL SERVER
     * @param homeId
     * @param requestId
     * @param params
     */
    public async updateUploadFileRequestMetadata (
        homeId: number, requestId: number,
        params: {
            readonly fileType: string,
            readonly fileSetSize: number,
            readonly fileSetChecksum?: string | undefined;
        },
        action: FileRequestAction.UPLOAD_TO_DEVICE | FileRequestAction.UPLOAD_TO_CONTROL_SERVER,
    ): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `homes/${homeId}/appProxy/rcp/fileProcessor/requests/${requestId}/c2d-browser`, {
            status    : FileRequestStatus.PENDING,
            action,
            parameters: {
                ...params,
            },
        });
    }


    /**
     * Once a file is uploaded to S3 successfully from frontend, call this API to update the file upload request's status and metadata. This
     * will notify the backend that the file is already uploaded S3 and now it can start download that file to the DEVICE
     * @param homeId
     * @param requestId
     * @param params
     */
    public async updateUploadFileToDeviceRequestMetadata (homeId: number, requestId: number, params: {
        readonly fileType: string,
        readonly fileSetSize: number,
        readonly fileSetChecksum?: string | undefined;
    }): Promise<void> {
        return this.updateUploadFileRequestMetadata(homeId, requestId, params, FileRequestAction.UPLOAD_TO_DEVICE);
    }


    /**
     * Once a file is uploaded to S3 successfully from frontend, call this API to update the file upload request's status and metadata. This
     * will notify the backend that the file is already uploaded S3 and now it can start download that file to the CONTROL SERVER
     * @param homeId
     * @param requestId
     * @param params
     */
    public async updateUploadFileToControlServerRequestMetadata (homeId: number, requestId: number, params: {
        readonly fileType: string,
        readonly fileSetSize: number,
        readonly fileSetChecksum?: string | undefined;
    }): Promise<void> {
        return this.updateUploadFileRequestMetadata(homeId, requestId, params, FileRequestAction.UPLOAD_TO_CONTROL_SERVER);
    }



    /**
     * Once a file is uploaded to S3 successfully from frontend, call this API to update the file upload request's status and metadata. This
     * will notify the backend that the file is already uploaded S3 and now it can start download that file to the ROBOTS
     * @param homeId
     * @param requestId
     * @param params
     */
    public async updateUploadFileToRobotsRequestMetadata (homeId: number, requestId: number, robotId: string, params: {
        readonly fileType: string,
        readonly fileSetSize: number,
        readonly fileSetChecksum?: string | undefined;
    }): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `homes/${homeId}/appProxy/rcp/fileProcessor/requests/${requestId}/c2d-browser`, {
            status    : FileRequestStatus.PENDING,
            action    : FileRequestAction.UPLOAD_TO_ROBOT,
            robotId,
            parameters: {
                ...params,
            },
        });
    }



    /**
     * Create a request to DOWNLOAD a file from a DEVICE or CONTROL SERVER
     * @param homeId
     * @param deviceId
     * @param fileType
     * @returns
     */
    public async createDownloadFileRequest (
        homeId: number,
        deviceId: number,
        fileType: string,
        startDate: string,
        endDate: string,
        useCustomDriver: boolean,
        action: FileRequestAction.DOWNLOAD_FROM_DEVICE | FileRequestAction.DOWNLOAD_FROM_CONTROL_SERVER,
    ): Promise<any> {
        const response = await this.sendRequest(RequestMethod.POST, `homes/${homeId}/appProxy/rcp/fileProcessor/requests`, {
            homeId,
            deviceId,
            target    : FileRequestTarget.CLOUD,
            action,
            useCustomDriver,
            parameters: {
                fileType,
                fetchFileParameters: {
                    begin: startDate,
                    end  : endDate,
                },
            },
        });
        return response;
    }


    /**
     * Create a request to DOWNLOAD a file from a DEVICE
     * @param homeId
     * @param deviceId
     * @param fileType
     * @param fetchFileParameters
     * @returns
     */
    public async createDownloadFileFromDeviceRequest (
        homeId: number,
        deviceId: number,
        fileType: string,
        startDate: string,
        endDate: string,
        useCustomDriver: boolean,
    ): Promise<any> {
        return this.createDownloadFileRequest(
            homeId, deviceId, fileType, startDate, endDate, useCustomDriver, FileRequestAction.DOWNLOAD_FROM_DEVICE,
        );
    }


    /**
     * Create a request to DOWNLOAD a file from a CONTROL SERVER
     * @param homeId
     * @param deviceId
     * @param fileType
     * @param fetchFileParameters
     * @returns
     */
    public async createDownloadFileFromControlServerRequest (
        homeId: number,
        deviceId: number,
        fileType: string,
        startDate: string,
        endDate: string,
        useCustomDriver: boolean,
    ): Promise<any> {
        return this.createDownloadFileRequest(
            homeId, deviceId, fileType, startDate, endDate, useCustomDriver, FileRequestAction.DOWNLOAD_FROM_CONTROL_SERVER,
        );
    }


    /**
     * Create a request to DOWNLOAD file from a ROBOT
     * @param homeId
     * @param deviceId
     * @param robotId
     * @param fileType
     * @param fetchFileParameters
     * @returns
     */
    public async createDownloadFileFromRobotRequest (
        homeId: number,
        deviceId: number,
        robotId: string,
        fileType: string,
        startDate: string,
        endDate: string,
        useCustomDriver: boolean,
    ): Promise<FileRequest> {
        const response = await this.sendRequest(RequestMethod.POST, `homes/${homeId}/appProxy/rcp/fileProcessor/requests`, {
            homeId,
            deviceId,
            robotId,
            target    : FileRequestTarget.CLOUD,
            action    : FileRequestAction.DOWNLOAD_FROM_ROBOT,
            useCustomDriver,
            parameters: {
                fileType,
                fetchFileParameters: {
                    begin: startDate,
                    end  : endDate,
                },
            },
        });
        return response.data as FileRequest;
    }



    /**
     * To cancel only UPLOAD file to Control Server/Robot requests which are in INITIATED status. These are the requests which require the frontend
     * to upload the file to S3 first and the user decided to cancel it before uploading the file to S3. But once the file is already uploaded
     * to S3 and the frontend already called 'updateUploadFileToControlServerRequestMetadata' to notify the backend, and backend is uploading the
     * files to the control server or robot, then don't use this API to cancel the request, use the 'cancelPendingFileRequest' function.
     * @param homeId
     * @param requestId
     */
    public async cancelInitiatedFileUploadRequest (homeId: number, requestId: number): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `homes/${homeId}/appProxy/rcp/fileProcessor/requests/${requestId}/c2d-browser`, {
            status: FileRequestStatus.CANCELLING,
        });
    }



    /**
     * To cancel any request that is in PENDING status. This can be used for Download/Upload requests to Control server/Robot.
     * @param homeId
     * @param requestId
     */
    public async cancelPendingFileRequest (homeId: number, requestId: number): Promise<void> {
        await this.sendRequest(RequestMethod.PATCH, `homes/${homeId}/appProxy/rcp/fileProcessor/requests/${requestId}/start-cancel`);
    }


    /**
     * To delete a NON PENDING request. This can be used for Download/Upload requests to Control Server/Robot.
     * @param homeId
     * @param requestId
     */
    public async deleteFileRequest (homeId: number, requestId: number): Promise<void> {
        await this.sendRequest(RequestMethod.DELETE, `homes/${homeId}/appProxy/rcp/fileProcessor/requests/${requestId}`);
    }
}
