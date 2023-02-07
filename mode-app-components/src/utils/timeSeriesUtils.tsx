import {
    TimeSeriesData, NumericMetricInfo, TagMetricInfo, TimeSeriesCollectionData, TimeSeriesCollectionRawData, MetricInfo,
} from '@moderepo/mode-apis';
import {
    useEffect, useState,
} from 'react';
import moment from 'moment';
import {
    BaseListCompDataItem,
} from '../componentInterfaces';
import {
    Time,
} from './constants';


/**
 * The 2 type of time series MODE platform support
 */
export enum TimeSeriesType {
    SIMPLE = 'Simple',
    COLLECTION = 'Collection'
}


/**
 * The 2 type of time series value we can request from TSDB, raw or aggregated values
 */
export enum TimeSeriesValueType {
    RAW = 'Raw',
    AGGREGATED = 'Aggregated'
}

/**
 * Define a set of time span type. NOTE: We will use the same name as 'moment' library uses so that we can easily do calculation on them.
 */
export enum TimeSpan {
    MINUTE = 'minute',
    HOUR = 'hour',
    DAY = 'day',
    WEEK = 'week',
    MONTH = 'month',
    YEAR = 'year',
}

/**
 * The millisecond values of each time span
 */
export const TimeSpanInMilliSeconds = Object.freeze({
    [TimeSpan.YEAR]  : Time.YEAR_IN_MS,
    [TimeSpan.MONTH] : Time.MONTH_IN_MS,
    [TimeSpan.WEEK]  : Time.WEEK_IN_MS,
    [TimeSpan.DAY]   : Time.DAY_IN_MS,
    [TimeSpan.HOUR]  : Time.HOUR_IN_MS,
    [TimeSpan.MINUTE]: Time.MINUTE_IN_MS,
});


// Define TimeSeries time unit
export type TSTimeUnit = 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';


/**
 * Interface for time series data interval e.g. 1 Day, 15 Minutes, 10 Hour, etc...
 */
export interface TimeSeriesDataInterval {
    readonly timeUnit: TSTimeUnit;
    readonly value: number;
}



/**
 * Interface for single series 1 data point. Each data point will have a date and a value.
 */
export interface DataPoint <T extends number | string> {
    readonly dateValue: number;     // the date in milliseconds
    readonly dateString: string;    // the date in ISO format
    readonly value: T | null;
}


/**
 * Interface for 1 data point for multiple series that have the same timestamp. Unlike DataPoint, this structure is used for combining multiple
 * series data point values for the SAME TIMESTAMP into 1 Object. This can optimize the data storage because we don't need to make copies of the
 * timestamp for each series.
 * This data structure is needed because we need to display multiple series data in a tabular view and multiple series in the same chart. It is
 * easier to use the data if they are combined.
 *
 * Here is an example data
 *
 *      {
 *          date: '2020-03-25 12:25:00',
 *          values: {
 *              temperature: 80,
 *              pressure: 34,
 *              humidity: 123,
 *              state: 'on'
 *          }
 *      }
 */
export interface MultiSeriesDataPoint<T extends number | string> {
    // There will be only 1 date value for all series data point
    readonly date: Date;                // the date object
    readonly dateValue: number;         // the date's value in milliseconds, use for sorting
    readonly dateString?: string;       // the date's value as string, use for display

    readonly values: {
        [metricName: string]: T | null;
    }
}



/**
 * Interface for 1 chart data point of multiple metrics including Numeric and Tag Metrics and. Each data point contains 1 date value and 1 or
 * more values for each metric e.g.
 *      {
 *          dataPointTimestamp: 1636480800000,
 *          temperature: 53,
 *          pressure: 24,
 *          battery: 100
 *          error: "200",
 *          state: "success",
 *      }
 */
export interface MultiMetricsDataPoint {
    readonly dataPointTimestamp: number;
    [metricId: string]: number | string | null;
}



/**
 * A multi-series data points for a collection which has separate MultiSeriesDataPoint for numericMetrics and tagMetrics
 */
export interface CollectionMultiSeriesDataPoint {
    readonly numericMetrics: MultiSeriesDataPoint<number>[],
    readonly tagMetrics: MultiSeriesDataPoint<string>[],
}



/**
 * This is a data structure to keep track of time series associated with any numeric metric.
 * This structure is GENERIC and it has 2 types
 * T1 is the type of metric it stores, it can be NumericMetricInfo | TagMetricInfo
 * T2 is the type of data that will be stored for chartableMetrics. It can be a single array of NumericMetricInfo or double array
 */
export interface GlobalTimeSeriesInfo<T extends readonly (NumericMetricInfo | TagMetricInfo)[] | readonly (NumericMetricInfo|TagMetricInfo)[][]>{
    // The set of metrics for which we have time series for. Not all metrics have time series so this list
    // DOES NOT include metrics that don't have time series data.
    readonly numericMetrics?: readonly NumericMetricInfo[] | undefined;
    readonly tagMetrics?: readonly TagMetricInfo[] | undefined;


    // The set of metrics that can be displayed as chart. Some metric data are meaningless when displayed as chart e.g. location data, so we
    // need a separate list of metrics that can be displayed as chart. This set should be a subset of 'allMetrics'
    readonly chartableMetrics?: T;


    // This is the begin and end date of all the time series. Not all time series will have the same begin/end date
    // because some metrics might be turned off initially. This object contain the date of the very first data and
    // the date of the very last data of one of the series. We will use this date as the xAxis min/max for ALL charts
    // to keep them in sync.
    // NOTE: these values are rounded to the nearest date. 'start' will be rounded down to the current date midnight and 'end' will be rounded up
    // to the next day midnight.
    readonly dateRange: {
        readonly start: number;
        readonly end: number;
    }

    // This is the time series' actual start/end time
    readonly actualDateRange: {
        readonly start: number;
        readonly end: number;
    }
}



/**
 * Get the time series data resolution e.g. 1 Month, 1 Day, 5 Hours, 15 Minutes, etc.... base on the timeSeriesData
 */
export const getTimeSeriesDataInterval = (timeSeriesData: TimeSeriesData): TimeSeriesDataInterval => {
    const { resolution, data } = timeSeriesData;

    if (resolution) {
        if (resolution.includes('year')) {
            return {
                timeUnit: 'year',
                value   : Number(resolution.substring(0, resolution.indexOf('year'))),
            };
        } if (resolution.includes('month')) {
            return {
                timeUnit: 'month',
                value   : Number(resolution.substring(0, resolution.indexOf('month'))),
            };
        } if (resolution.includes('day')) {
            return {
                timeUnit: 'day',
                value   : Number(resolution.substring(0, resolution.indexOf('day'))),
            };
        } if (resolution.includes('hour')) {
            return {
                timeUnit: 'hour',
                value   : Number(resolution.substring(0, resolution.indexOf('hour'))),
            };
        } if (resolution.includes('min')) {
            return {
                timeUnit: 'minute',
                value   : Number(resolution.substring(0, resolution.indexOf('min'))),
            };
        } if (resolution.includes('sec')) {
            return {
                timeUnit: 'second',
                value   : Number(resolution.substring(0, resolution.indexOf('sec'))),
            };
        }
    }

    // try to get resolution from the data
    if (data) {
        const shortestInterval = data.reduce((min: number, [date]: [string, number], index: number) => {
            if (index > 0 && date && data[index - 1]) {
                // get the diff between this current data point's date and the previous point's data and see
                // if it is smaller than shortestInterval
                return Math.min(Date.parse(date) - Date.parse((data[index - 1][0])), min);
            }
            return min;
        }, Number.MAX_SAFE_INTEGER);

        if (shortestInterval !== Number.MAX_SAFE_INTEGER) {
            return {
                timeUnit: 'second',
                value   : shortestInterval / 1000,
            };
        }
    }

    return {
        timeUnit: 'second',
        value   : 1,
    };
};



/**
 * Merge an Map of time series metric data into 1 array of MultiSeriesDataPoint e.g.
 *
 * from
 *      {
 *          temperature: {data:[{'2020-03-10', 70}, {'2020-03-11', 68}, {'2020-03-12', 69}, {'2020-03-13', 74}, {'2020-03-14', 69}]}
 *          pressure: {data:[{'2020-03-10', 34}, {'2020-03-11', 22}, {'2020-03-13', 39}]}
 *          humidity: {data:[{'2020-03-10', 0.134}, {'2020-03-11', 0.43}, {'2020-03-12', 0.64}, {'2020-03-13', 0.23}]}
 *      }
 *
 * to
 *      [
 *          {date:'2020-03-10', values:{temperature:70, pressure:34, humidity:0.134}},
 *          {date:'2020-03-11', values:{temperature:68, pressure:22, humidity:0.43}},
 *          {date:'2020-03-12', values:{temperature:69, humidity:0.64}},
 *          {date:'2020-03-13', values:{temperature:74, pressure:39, humidity:0.23}},
 *          {date:'2020-03-14', values:{temperature:69}},
 *      ]
 *
 * NOTE: it is possible for data from different series not to have the same data at the same date e.g. on '2020-03-14', we don't have 'pressure'
 * or 'humidity' data.
 *
 * @param data
 */
export const mergeMetricDataToMultiMetricDataPoints = <T extends number | string>(data: {
    [metricName: string]: readonly DataPoint<T>[];
}): MultiSeriesDataPoint<T>[] => {
    /**
     * Build a list of all the possible data point dates. We will use a map instead of an Array for now so that we can
     * look up the object by date
     *
     * So 'dataMap' = {
     *         '2020-03-10': {date:'2020-03-10', values:{temperature:70, pressure:34, humidity:0.134}},
     *         '2020-03-11': {date:'2020-03-11', values:{temperature:68, pressure:22, humidity:0.43}},
     *         '2020-03-12': {date:'2020-03-12', values:{temperature:69, humidity:0.64}},
     *         '2020-03-13': {date:'2020-03-13', values:{temperature:74, pressure:39, humidity:0.23}},
     *         '2020-03-14': {date:'2020-03-14', values:{temperature:69}},
     *    }
     */
    const dataMap = Object.entries(data).reduce((
        result: {[dateStr: string]: MultiSeriesDataPoint<T>},
        [metricName, dataPoints],
    ): {[dateStr: string]: MultiSeriesDataPoint<T>} => {

        // go through all the data points in this time series data and add the data points to the result
        dataPoints.forEach((dataPoint: DataPoint<T>) => {
            if (!result[dataPoint.dateString]) {
                // this date does not exist in the result yet, add it to the result and initialize it with the data point's date
                // eslint-disable-next-line no-param-reassign
                result[dataPoint.dateString] = {
                    date     : moment(dataPoint.dateString).toDate(),
                    dateValue: moment(dataPoint.dateString).valueOf(),
                    values   : {
                        [metricName]: dataPoint.value,
                    },
                };
            } else {
                // There is already another a point exist for the current date, add this series value to the result
                // eslint-disable-next-line no-param-reassign
                result[dataPoint.dateString] = {
                    date     : moment(dataPoint.dateString).toDate(),
                    dateValue: result[dataPoint.dateString].dateValue,
                    values   : {
                        ...result[dataPoint.dateString].values,
                        [metricName]: dataPoint.value,
                    },
                };
            }
        });

        return result;
    }, {
    });

    // Convert the data map to data array and sort them by date
    const dataArray = (Object.values(dataMap) as MultiSeriesDataPoint<T>[]).sort(
        (data1: MultiSeriesDataPoint<T>, data2: MultiSeriesDataPoint<T>): number => {
            if (data1.dateValue > data2.dateValue) {
                return 1;
            }
            if (data1.dateValue < data2.dateValue) {
                return -1;
            }
            return 0;
        },
    );

    return dataArray;
};


/**
 * Custom hook to merge a Map of time series metric data into 1 array of MultiSeriesDataPoint e.g.
 * This function does the same things as the mergeMetricDataToMultiMetricDataPoints function because it calls mergeMetricDataToMultiMetricDataPoints
 * to handle the merge logic. The only different is that this function is a HOOK so it can be used like a hook.
 *
 * from
 *      {
 *          temperature: {data:[{'2020-03-10', 70}, {'2020-03-11', 68}, {'2020-03-12', 69}, {'2020-03-13', 74}, {'2020-03-14', 69}]}
 *          pressure: {data:[{'2020-03-10', 34}, {'2020-03-11', 22}, {'2020-03-13', 39}]}
 *          humidity: {data:[{'2020-03-10', 0.134}, {'2020-03-11', 0.43}, {'2020-03-12', 0.64}, {'2020-03-13', 0.23}]}
 *      }
 *
 * to
 *      [
 *          {date:'2020-03-10', values:{temperature:70, pressure:34, humidity:0.134}},
 *          {date:'2020-03-11', values:{temperature:68, pressure:22, humidity:0.43}},
 *          {date:'2020-03-12', values:{temperature:69, humidity:0.64}},
 *          {date:'2020-03-13', values:{temperature:74, pressure:39, humidity:0.23}},
 *          {date:'2020-03-14', values:{temperature:69}},
 *      ]
 *
 * NOTE: it is possible for data from different series not to have the same data at the same date e.g. on '2020-03-14', we don't have 'pressure'
 * or 'humidity' data.
 *
 */
export const useMergeCachedMetricDataToMultiMetricDataPoints = (
    cachedMetricData: {
        readonly numericMetrics?: {
            readonly [metricValueName: string]: readonly DataPoint <number>[];
        };
        readonly tagMetrics?: {
            readonly [metricName: string]: readonly DataPoint <string>[];
        };
    },
): CollectionMultiSeriesDataPoint | undefined => {

    const [data, setData] = useState<CollectionMultiSeriesDataPoint>();

    useEffect(() => {
        setData({
            numericMetrics: mergeMetricDataToMultiMetricDataPoints<number>(cachedMetricData.numericMetrics || {
            }),
            tagMetrics: mergeMetricDataToMultiMetricDataPoints<string>(cachedMetricData.tagMetrics || {
            }),
        });
    }, [cachedMetricData]);

    return data;
};



/**
 * Custom hook to manage the list of series per chart. Given an array of metrics and a flag whether to combine them, return a DOUBLE array of metrics
 * E.g.
 *      Input: ["temperature", "pressure", "battery", "speed"]
 *
 *      Output: If combineSeries === true, there will only be 1 chart that display all metrics
 *              [
 *                  ["temperature", "pressure", "battery", "speed"]
 *              ]
 *
 *      Output: If combineSeries === false, we will display 1 metric per chart
 *              [
 *                  ["temperature"],
 *                  ["pressure"],
 *                  ["battery"],
 *                  ["speed"]
 *              ]
 */
export const useRebuildMetricsPerChartArray = <T extends NumericMetricInfo | TagMetricInfo>(
    metrics: readonly T[],
    combineSeries: boolean,
    excludedMetricsNames?: readonly string[] |undefined,
) => {
    const [seriesPerChart, setSeriesPerChart] = useState<T[][]>([]);

    useEffect(() => {
        const filteredMetrics = excludedMetricsNames ? metrics.filter((metric: T): boolean => {
            return !excludedMetricsNames.includes(metric.name);
        }) : metrics;

        if (filteredMetrics.length > 0) {
            if (combineSeries) {
                setSeriesPerChart([
                    [...filteredMetrics],
                ]);
            } else {
                setSeriesPerChart(
                    filteredMetrics.map((metric: T): T[] => {
                        return [metric];
                    }),
                );
            }
        } else {
            // no selected metrics so no series per chart
            setSeriesPerChart([]);
        }
    }, [metrics, combineSeries, excludedMetricsNames]);

    return seriesPerChart;
};



/**
 * Convert TimeSeries original collection data to a map of metricName => DataPoints[]. For example
 * Input
 *      collectionData = {
 *          data: [
 *              ["2021-01-22T18:02:45Z", 0, 4, "1", "1.2.3.4"]
 *              ["2021-01-22T18:02:46Z", 4, 6, "6", "1.2.3.5"]
 *              ["2021-01-22T18:02:47Z", 1, 1, "14", "1.2.3.6"]
 *          ]
 *      }
 *
 * Output
 *      {
 *          numericMetric: {
 *              connection: [
 *                  {date: "2021-01-22T18:02:45Z", value: 0},
 *                  {date: "2021-01-22T18:02:46Z", value: 4},
 *                  {date: "2021-01-22T18:02:47Z", value: 1}
 *              ],
 *              battery: [
 *                  {date: "2021-01-22T18:02:45Z", value: 4},
 *                  {date: "2021-01-22T18:02:46Z", value: 6},
 *                  {date: "2021-01-22T18:02:47Z", value: 1}
 *              ],
 *          },
 *          tagMetric: {
 *              state: [
 *                  {date: "2021-01-22T18:02:45Z", value: "1"},
 *                  {date: "2021-01-22T18:02:46Z", value: "6"},
 *                  {date: "2021-01-22T18:02:47Z", value: "14"}
 *              ],
 *              version: [
 *                  {date: "2021-01-22T18:02:45Z", value: "1.2.3.4"},
 *                  {date: "2021-01-22T18:02:46Z", value: "1.2.3.5"},
 *                  {date: "2021-01-22T18:02:47Z", value: "1.2.3.6"}
 *              ],
 *          }
 *      }
 * @param collectionData
 * @param metricNames
 */
interface ResultDataType {
    readonly numericMetrics: {
        readonly [metricName: string]: DataPoint<number>[];
    };
    readonly tagMetrics: {
        readonly [metricName: string]: DataPoint<string>[];
    };
}
export const convertCollectionDataToMetricsDataPoints = (
    collectionData: TimeSeriesCollectionData | TimeSeriesCollectionRawData,
    valueNames: readonly string[],
    tagNames?: readonly string[] | undefined,
): ResultDataType => {

    // initialize the result data with empty arrays
    const resultDataInit: ResultDataType = {
        numericMetrics: valueNames.reduce((
            result: {
                readonly [valueName: string]: DataPoint<number>[];
            },
            valueName: string,
        ) => {
            return {
                ...result,
                [valueName]: [],
            };
        }, {
        }),
        tagMetrics: (tagNames || []).reduce((
            result: {
                readonly [tagName: string]: DataPoint<string>[];
            },
            tagName: string,
        ) => {
            return {
                ...result,
                [tagName]: [],
            };
        }, {
        }),
    };

    // Convert collectionData.data, a double array of values, into a map of metricName => DataPoint[]
    const rows = collectionData.data;
    const resultData = rows.reduce((
        result: ResultDataType,
        rowValues: readonly (string | number | null)[],
    ): ResultDataType => {
        // first element is the date of the data point
        const dataPointDate: string = rowValues[0] as string;

        // Backend return values for the metrics in this order, value for valueNames and then value for tagNames
        [...valueNames, ...(tagNames || [])].forEach((name: string, index: number) => {
            // the value at index i + 1 of rowValues will be the value for metric name at index i
            const dataPointValue: number | string | null = rowValues[index + 1];

            if (valueNames.includes(name)) {
                // Add the dataPointValue to numericMetric[name]
                result.numericMetrics[name].push({
                    dateString: dataPointDate,
                    dateValue : Date.parse(dataPointDate),
                    value     : dataPointValue,
                } as DataPoint<number>);
            } else {
                result.tagMetrics[name].push({
                    dateString: dataPointDate,
                    dateValue : Date.parse(dataPointDate),
                    value     : dataPointValue,
                } as DataPoint<string>);
            }
        });

        return result;
    }, resultDataInit);

    return resultData;
};



/**
 * Convert data resolution in string format to a value in milliseconds. These are the different resolution that the backend will return
 * Res5Seconds  = "5sec"
 * Res15Seconds = "15sec"
 * Res1Minute   = "1min"
 * Res10Minutes = "10min"
 * Res1Hour     = "1hour"
 * Res1Day      = "1day"
 * Res1Week     = "1week"
 * Res1Month    = "1month"
 *
 * For example:
 *      '5sec' => 5000
 *      '15sec' => 15000
 *      '1min' => 60,000
 *      '10min' => 600,000
 * @param resolution
 */
export const resolutionToMilliseconds = (resolution: string): number => {
    // first, break the resolution to amount and unit
    const amount = parseInt(resolution, 10);
    const unit = resolution.substring(amount.toString().length);

    // Get the number of milliseconds for the unit e.g. 'sec' => 1000, 'min' => 60000, 'hour' => 3600000 etc...
    const unitsInMilliseconds = ((u: string) => {
        if (u === 'year') {
            return Time.YEAR_IN_MS;
        }
        if (u === 'month') {
            return Time.MONTH_IN_MS;
        }
        if (u === 'week') {
            return Time.WEEK_IN_MS;
        }
        if (u === 'day') {
            return Time.DAY_IN_MS;
        }
        if (u === 'hour') {
            return Time.HOUR_IN_MS;
        }
        if (u === 'min') {
            return Time.MINUTE_IN_MS;
        }
        if (u === 'sec') {
            return Time.SECOND_IN_MS;
        }
        return 0;
    })(unit);

    return amount * unitsInMilliseconds;
};


// Sort NumericMetricInfo by displayName or valueName if displayName is not available
export const sortMetrics = <T extends MetricInfo>(metrics: T[]): T[] => {
    return metrics.sort((metric1: T, metric2: T): number => {
        const name1 = (metric1.displayName || metric1.name).toLowerCase();
        const name2 = (metric2.displayName || metric2.name).toLowerCase();
        if (name1 < name2) {
            return -1;
        }
        if (name1 > name2) {
            return 1;
        }
        return 0;
    });
};


/**
 * Given a timeSpan, return the data resolution that TSDB back end uses
 *  "5sec"     15 minutes > timeSpan >= 5 minutes
 *  "15sec"    1 hour > timeSpan >= 15 minutes -- bucket size: 15 seconds
 *  "1min"     12 hours > timeSpan >= 1 hour -- bucket size: 1 minute
 *  "10min"    5 days > timeSpan >= 12 hours -- bucket size: 10 minutes
 *  "1hour"    28 days > timeSpan >= 5 days -- bucket size: 1 hour
 *  "1day"     1 year > timeSpan >= 28 days -- bucket size: 1 day
 *  "1week"    5 years > timeSpan >= 1 year -- bucket size: 1 week
 *  "1month"   timeSpan >= 5 years -- bucket size: 1 month
 */
export const getTimeSpanResolutionInMs = (timeSpan: TimeSpan): number => {
    if (timeSpan === TimeSpan.MINUTE) {
        return Time.SECOND_IN_MS * 5;
    }
    if (timeSpan === TimeSpan.HOUR) {
        return Time.SECOND_IN_MS * 15;
    }
    if (timeSpan === TimeSpan.DAY) {
        return Time.MINUTE_IN_MS * 10;
    }
    if (timeSpan === TimeSpan.WEEK) {
        return Time.HOUR_IN_MS;
    }
    if (timeSpan === TimeSpan.MONTH) {
        return Time.DAY_IN_MS;
    }
    if (timeSpan === TimeSpan.YEAR) {
        return Time.WEEK_IN_MS;
    }
    return Time.SECOND_IN_MS * 5;
};
