/* eslint-disable max-len */
/* eslint-disable no-useless-escape */


// Months and years values will assume months are 30 days and years are 365 days. This is not
// accurate but it is good enough. If you need a correct value, don't use these constants.
export enum Time {
    SECOND_IN_SECS = 1,                                        // 1 second in seconds
    SECOND_IN_MS = 1000,                                        // 1 second in milliseconds
    MINUTE_IN_SECS = 60,                                        // 1 minute in seconds
    MINUTE_IN_MS = 60 * 1000,                                   // 1 minute in milliseconds
    HOUR_IN_SECS = 60 * 60,
    HOUR_IN_MS = 60 * 60 * 1000,
    DAY_IN_SECS = 60 * 60 * 24,
    DAY_IN_MS = 60 * 60 * 24 * 1000,
    WEEK_IN_SECS = 60 * 60 * 24 * 7,
    WEEK_IN_MS = 60 * 60 * 24 * 7 * 1000,
    MONTH_IN_SECS = 60 * 60 * 24 * 30,
    MONTH_IN_MS = 60 * 60 * 24 * 30 * 1000,
    YEAR_IN_SECS = 60 * 60 * 24 * 356,
    YEAR_IN_MS = 60 * 60 * 24 * 356 * 1000,
    DECADE_IN_SECS = 60 * 60 * 24 * 356 * 10,
    DECADE_IN_MS = 60 * 60 * 24 * 356 * 10 * 1000,
    CENTURY_IN_SECS = 60 * 60 * 24 * 356 * 100,
    CENTURY_IN_MS = 60 * 60 * 24 * 356 * 100 * 1000,
    MILLENNIUM_IN_SECS = 60 * 60 * 24 * 356 * 1000,
    MILLENNIUM_IN_MS = 60 * 60 * 24 * 356 * 1000 * 1000,
}



export enum TimeUnit {
    MILLISECOND = 'units.time.millisecond',
    MILLISECOND_ABBREV = 'units.time.millisecond_abbrev',
    SECOND = 'units.time.second',
    SECOND_ABBREV = 'units.time.second_abbrev',
    MINUTE = 'units.time.minute',
    MINUTE_ABBREV = 'units.time.minute_abbrev',
    HOUR = 'units.time.hour',
    HOUR_ABBREV = 'units.time.hour_abbrev',
    DAY = 'units.time.day',
    DAY_ABBREV = 'units.time.day_abbrev',
    WEEK = 'units.time.week',
    WEEK_ABBREV = 'units.time.week_abbrev',
    MONTH = 'units.time.month',
    MONTH_ABBREV = 'units.time.month_abbrev',
    YEAR = 'units.time.year',
    YEAR_ABBREV = 'units.time.year_abbrev',
}



export enum MemorySize {
    BYTE = 1,
    KILOBYTE = 1024,
    MEGABYTE = 1024 * 1024,
    GIGABYTE = 1024 * 1024 * 1024,
    TERABYTE = 1024 * 1024 * 1024 * 1024,
}


export enum MemorySizeUnit {
    BYTE = 'units.memory.byte',
    BYTE_ABBREV = 'units.memory.byte_abbrev',
    KILOBYTE = 'units.memory.kilobyte',
    KILOBYTE_ABBREV = 'units.memory.kilobyte_abbrev',
    MEGABYTE = 'units.memory.megabyte',
    MEGABYTE_ABBREV = 'units.memory.megabyte_abbrev',
    GIGABYTE = 'units.memory.gigabyte',
    GIGABYTE_ABBREV = 'units.memory.gigabyte_abbrev',
    TERABYTE = 'units.memory.terabyte',
    TERABYTE_ABBREV = 'units.memory.terabyte_abbrev',
}



// default TSDB smart module ID to use if one is not set
export const DEFAULT_TSDB_SMART_MODULE_ID: string = 'tsdb';

// Constants for the Preview Panel features
export const PREVIEW_ENTITY_PARAM_NAME: string = 'showEntity';     // The URL param name we will be using to specify that an entity is selected



export const NOTIFICATION_DURATION: number = 5000;
export const EMAIL_VALIDATION_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const DEVICE_CLAIM_MODE_DURATION = 30;      // The number of seconds to keep the device in claim mode. Since we are going this ourselves, we can kee it short

export const ITEMS_PER_PAGE_5: number = 5;
export const ITEMS_PER_PAGE_10: number = 10;
export const ITEMS_PER_PAGE_20: number = 20;
export const ITEMS_PER_PAGE_50: number = 50;
export const ITEMS_PER_PAGE_100: number = 100;
export const ITEMS_PER_PAGE_LIST: readonly number[] = [ITEMS_PER_PAGE_5, ITEMS_PER_PAGE_10, ITEMS_PER_PAGE_20, ITEMS_PER_PAGE_50, ITEMS_PER_PAGE_100];
export const PAGING_MIN_PAGES: number = 3;                              // Only enable First, Last, Page# actions if we have more than X pages

export const CLAIM_CODE_MIN_LENGTH: number = 16;
export const CLAIM_CODE_MAX_LENGTH: number = 100;
export const DEFAULT_LOG_DATE_RANGE: number = 1;                        // How many days to request for log data by default
export const DEFAULT_LOG_LIMIT: number = 200;                           // Max number of log entries we want backend to return

export const AUTH_KEY_EXPIRATION_CHECK_FREQ_IN_MS: number = 30000;      // How frequently to check for Project/User key for expiration


export const METRIC_VIEW_DEFAULT_TIME_RANGE = Time.DAY_IN_MS;           // The default time range in the time series metric view
export const METRIC_VIEW_MIN_TIME_RANGE = 30 * Time.MINUTE_IN_MS;       // The minimum time range the user can select from the date selector


export const BLANK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
