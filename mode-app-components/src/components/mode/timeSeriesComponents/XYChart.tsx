import React, {
    useEffect, useRef,
    useCallback,
    useMemo,
} from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import clsx from 'clsx';
import moment from 'moment/moment';
import {
    NumericMetricInfo,
} from '@moderepo/mode-apis';
import {
    useTheme,
} from '@material-ui/core';
import {
    MultiSeriesDataPoint, Time,
} from '../../../utils';
import {
    ModeTheme,
} from '../../../themes';
import {
    AvgMinMaxChartSettings, ChartBulletShape, chartDateFormatByDataResolution, chartDefaultColors, chartDefaultCursorStroke,
    chartDefaultGridStroke, chartFullDateFormat, ChartSeriesStyle, ChartSettings, chartShortDateFormat, chartCircleBullet, getChartSeriesStyle,
    XYChartType,
} from '.';



/**
 * Create line at the bullet point for the AVG/MIN/MAX chart
 */
const createMinMaxLine = (
    metric: NumericMetricInfo,
    series: am4charts.LineSeries,
    valueAxis: am4charts.ValueAxis,
    minDataFieldPostfix?: string | undefined,
    maxDataFieldPostfix?: string | undefined,
): am4core.Sprite => {

    const minMaxLine = series.bullets.create(am4charts.ErrorBullet) as am4charts.Bullet;
    minMaxLine.isDynamic = true;
    minMaxLine.strokeWidth = 1;

    // adapter adjusts height of a bullet
    minMaxLine.adapter.add('pixelHeight', (pixelHeight, target) => {
        const { dataItem } = target;
  
        if (dataItem instanceof am4charts.LineSeriesDataItem) {
            const chartData = dataItem.dataContext;
            const dataFileName = metric.name;

            const value = dataItem.valueY;
            const maxValue = chartData[`${dataFileName}${maxDataFieldPostfix ?? '_max'}`] ?? value;
            const minValue = chartData[`${dataFileName}${minDataFieldPostfix ?? '_min'}`] ?? value;

            const maxDiffValue = value + (maxValue - value);
            const maxDiffValuePx = valueAxis.valueToPoint(maxDiffValue).y || 0;
  
            const minDiffValue = value - (value - minValue);
            const minDiffValuePx = valueAxis.valueToPoint(minDiffValue).y || 0;
  
            const height = Math.abs(maxDiffValuePx - minDiffValuePx);
            return height;
        }
        return pixelHeight;
    });

    // adapter to move the min/max line accordingly
    minMaxLine.adapter.add('dy', (dy, target) => {
        const { dataItem } = target;
  
        if (dataItem instanceof am4charts.LineSeriesDataItem) {
            const chartData = dataItem.dataContext;
            const dataFileName = metric.name;

            const value = dataItem.valueY;
            const maxValue = chartData[`${dataFileName}${maxDataFieldPostfix ?? '_max'}`] ?? value;
            const minValue = chartData[`${dataFileName}${minDataFieldPostfix ?? '_min'}`] ?? value;

            const maxDiffValue = value + (maxValue - value);
            const maxDiffValuePx = valueAxis.valueToPoint(maxDiffValue).y || 0;
  
            const minDiffValue = value - (value - minValue);
            const minDiffValuePx = valueAxis.valueToPoint(minDiffValue).y || 0;
  
            const valuePx = valueAxis.valueToPoint(value).y || 0;
            return (maxDiffValuePx - valuePx) / 2 - (valuePx - minDiffValuePx) / 2;
        }
        return dy;
    });

    return minMaxLine;
};



/**
 * Create a Bullet for the chart
 */
const createChartBullet = (seriesStyle: ChartSeriesStyle): am4charts.Bullet => {

    const interfaceColors = new am4core.InterfaceColorSet();

    const bullet = new am4charts.Bullet();
    bullet.width = seriesStyle.bullet.size;
    bullet.height = seriesStyle.bullet.size;

    const bulletShape = (() => {
        switch (seriesStyle.bullet.shape) {
            case ChartBulletShape.TRIANGLE: {
                const bulletShape = bullet.createChild(am4core.Triangle);
                bullet.horizontalCenter = 'middle';
                bullet.verticalCenter = 'middle';
                return bulletShape;
            }
    
            case ChartBulletShape.RECTANGLE: {
                const bulletShape = bullet.createChild(am4core.Rectangle);
                bullet.horizontalCenter = 'middle';
                bullet.verticalCenter = 'middle';
                return bulletShape;
            }
    
            case ChartBulletShape.CIRCLE:
            default: {
                return bullet.createChild(am4core.Circle);
            }
        }
    })();

    bulletShape.stroke = interfaceColors.getFor('background');
    bulletShape.fill = seriesStyle.color;
    bulletShape.strokeWidth = 1;
    bulletShape.width = seriesStyle.bullet.size;
    bulletShape.height = seriesStyle.bullet.size;

    return bullet;
};



const getDateKey = (index: number): string => {
    return `date_${index}`;
};



// Create a value (Y) axes/series for the chart
const createAxisAndSeries = (options: {
    readonly chart: am4charts.XYChart;
    readonly chartType: XYChartType | undefined;
    readonly metric: NumericMetricInfo;
    readonly hasMultipleSeries: boolean;
    readonly seriesCount: number;
    readonly seriesIndex: number;
    readonly opposite: boolean;
    readonly yAxisRange?: {
        readonly min?: number | undefined;
        readonly max?: number | undefined;
    } | undefined;
    readonly yAxesRangeMarkers?: XYChartProps['yAxesRangeMarkers'];
    readonly shareYAxis?: boolean | undefined;
    readonly dateAxis?: am4charts.DateAxis | undefined;
    readonly dateAxisDataField: string;
    readonly avgMinMaxChartSettings?: AvgMinMaxChartSettings | undefined,
    readonly chartColors: readonly am4core.Color[],
    readonly gridStroke: am4core.Color,
}) => {
    const {
        chart, chartType, metric, hasMultipleSeries, seriesCount, seriesIndex, opposite, yAxisRange,
        shareYAxis, dateAxis, dateAxisDataField, chartColors, gridStroke, yAxesRangeMarkers,
    } = options;

    const avgMinMaxChartSettings: AvgMinMaxChartSettings = options.avgMinMaxChartSettings || {
        avgLabel: 'Avg', minLabel: 'Min', maxLabel: 'Max', minDataFieldPostfix: '_min', maxDataFieldPostfix: '_max',
    };

    const valueAxis = (() => {
        // If syncYAxes or if we have not create a yAxes yet then create 1
        const yAxis = chart.yAxes.getIndex(0) as am4charts.ValueAxis;
        if (!shareYAxis || !yAxis) {
            const newYAxis = chart.yAxes.push(new am4charts.ValueAxis());

            if (metric.unit) {
                newYAxis.renderer.labels.template.adapter.add('text', (text: string | undefined) => {
                    if (text && metric.unit) {
                        return `${text} ${metric.unit}`;
                    }
                    return text;
                });
            }
            return newYAxis;
        }
        return yAxis;
    })();

    if (chart.yAxes.indexOf(valueAxis) !== 0 && !shareYAxis) {
        // Sync all the OTHER series's Y axes with the FIRST Y axis
        valueAxis.syncWithAxis = chart.yAxes.getIndex(0) as any;
    }
    if (valueAxis.tooltip) {
        valueAxis.tooltip.disabled = true;
    }

    if (yAxisRange?.min !== undefined) {
        valueAxis.min = yAxisRange.min;
    }

    if (yAxisRange?.max !== undefined) {
        valueAxis.max = yAxisRange.max;
    }

    // Give the valueAxis some padding but only if range is not provided
    if (!(yAxisRange?.min || yAxisRange?.max)) {
        valueAxis.extraMin = 0.05;
        valueAxis.extraMax = 0.05;
    }

    const series = (() => {
        if (chartType === XYChartType.BAR) {
            return chart.series.push(new am4charts.ColumnSeries());
        }
        return chart.series.push(new am4charts.LineSeries());
    })();

    series.zIndex = seriesCount - seriesIndex;
    series.dataFields.dateX = dateAxisDataField;
    series.dataFields.valueY = metric.name;

    // Pick a random style
    const seriesStyle = hasMultipleSeries
        ? getChartSeriesStyle(chartColors, seriesIndex)
        : getChartSeriesStyle(chartColors, 0);

    series.yAxis = valueAxis;
    if (dateAxis) {
        series.xAxis = dateAxis;
    }
    series.name = metric.displayName || metric.name;
    series.showOnInit = false;


    const tooltipFormat = (() => {
        if (chartType === XYChartType.AVG_MIN_MAX) {
            const { avgLabel, minLabel, maxLabel, minDataFieldPostfix, maxDataFieldPostfix } = avgMinMaxChartSettings;

            if (hasMultipleSeries) {
                return `[fontSize:18px; bold]{name}[/]
                    ${maxLabel}: {${metric.name + maxDataFieldPostfix}}
                    ${avgLabel}: {valueY}
                    ${minLabel}: {${metric.name + minDataFieldPostfix}}`;
            }
            return `${maxLabel}: {${metric.name + maxDataFieldPostfix}}
                ${avgLabel}: {valueY}
                ${minLabel}: {${metric.name + minDataFieldPostfix}}`;
        }
        if (hasMultipleSeries) {
            return '{name}: [bold]{valueY}[/]';
        }
        return '[bold]{valueY}[/]';
    })();

    series.tooltipText = tooltipFormat;
    if (series.tooltip) {
        series.tooltip.getFillFromObject = false;
        series.tooltip.background.fill = seriesStyle.color;
    }


    if (series instanceof am4charts.LineSeries) {
        series.tensionX = 1;
        const hasBullets = chartType !== XYChartType.AREA;

        if (chartType === XYChartType.SCATTER) {
            series.stroke = seriesStyle.color;
            series.strokeWidth = 0;
            series.strokeOpacity = 0;
        } else {
            series.stroke = seriesStyle.color;
            series.strokeWidth = 2;
            series.strokeOpacity = 1;
        }
        if (chartType === XYChartType.AREA) {
            series.fill = seriesStyle.color;
            series.fillOpacity = 0.1;
        }

        if (hasBullets) {
            if (chartType === XYChartType.AVG_MIN_MAX) {
                // create custom bullets with min/max bar
                series.bullets.push(createMinMaxLine(
                    metric, series, valueAxis, avgMinMaxChartSettings.minDataFieldPostfix, avgMinMaxChartSettings.maxDataFieldPostfix,
                ));
                series.bullets.push(createChartBullet({
                    ...seriesStyle,
                    bullet: chartCircleBullet,
                }));
            } else {
                // Create simple bullets
                series.bullets.push(createChartBullet(seriesStyle));
            }
        }
    } else if (series instanceof am4charts.ColumnSeries) {
        series.fill = seriesStyle.color;
        series.stroke = seriesStyle.color;
        series.strokeWidth = 0;
    }


    if (yAxisRange?.min !== undefined) {
        valueAxis.extraMin = 0.01;
    }
    if (yAxisRange?.min !== undefined) {
        valueAxis.extraMax = 0.01;
    }

    // Style the valueAxis vertical line, make it the same as the series style
    valueAxis.renderer.line.strokeOpacity = 1;
    valueAxis.renderer.line.strokeWidth = 2;
    valueAxis.renderer.line.stroke = series.stroke;
    valueAxis.renderer.labels.template.fill = series.stroke;
    if (!shareYAxis) {
        valueAxis.renderer.opposite = opposite;
    }
    valueAxis.renderer.grid.template.strokeOpacity = 1;
    valueAxis.renderer.grid.template.strokeWidth = 1;
    valueAxis.renderer.grid.template.stroke = am4core.color(gridStroke);

    // Draw yAxes ranges
    if (yAxesRangeMarkers && yAxesRangeMarkers.length > 0) {
        yAxesRangeMarkers.forEach((marker) => {
            if (marker) {
                const range = valueAxis.axisRanges.create();
                range.value = marker.min;
                range.endValue = marker.max;
                if (marker.strokeColor !== undefined) {
                    range.grid.stroke = am4core.color(marker.strokeColor);
                }
                range.grid.strokeOpacity = marker.strokeOpacity ?? 0.3;
                if (marker.strokeWidth !== undefined) {
                    range.grid.strokeWidth = marker.strokeWidth;
                }
                if (marker.fillColor !== undefined) {
                    range.axisFill.fill = am4core.color(marker.fillColor);
                }
                range.axisFill.fillOpacity = marker.fillOpacity ?? 0.2;
            }
        });
    }
};


export type DataPointArrayType = readonly MultiSeriesDataPoint<number>[];
export type MultiDataPointArrayType = readonly DataPointArrayType[];


const isDataPointArrayType = (obj: unknown): obj is DataPointArrayType => {
    const array = obj as DataPointArrayType;
    return array instanceof Array && (array.length <= 0 || array[0].date !== undefined);
};

export type ChartDateRange = {
    readonly start?: number | undefined;
    readonly end?: number | undefined;
    readonly resolution?: number | undefined;
}

const isChartDateRange = (obj: unknown): obj is ChartDateRange => {
    const dateRange = obj as ChartDateRange;
    return dateRange && typeof dateRange === 'object' && !(dateRange instanceof Array)
        && ((!dateRange.start || typeof dateRange.start === 'number')
            || (!dateRange.end || typeof dateRange.start === 'number')
            || (!dateRange.resolution || typeof dateRange.resolution === 'number')
        );
};


export interface YAxisRangeMarker {
    readonly min: number;
    readonly max: number;
    readonly strokeColor?: string | undefined;
    readonly strokeWidth?: number | undefined;
    readonly strokeOpacity?: number | undefined;
    readonly fillColor?: string | undefined;
    readonly fillOpacity?: number | undefined;
}


export interface XYChartProps extends ChartSettings {
    readonly chartId: string;

    readonly dataPoints: DataPointArrayType | MultiDataPointArrayType;

    // dataPoints contains data for many series. However, we don't need to show them all in this chart.
    // This 'displayMetrics' array is used for specifying which series we need to display in the chart.
    readonly displayMetrics: readonly NumericMetricInfo[];

    readonly chartType?: XYChartType | undefined;               // The default will be LINE Chart

    // The data field of the min/max data to use for AvgMinMax charts. E.g. if series data field is 'temperature' then the min/max
    // data will be `temperature${minDataFieldPostfix}` to `temperature${maxDataFieldPostfix}`
    readonly avgMinMaxChartSettings?: AvgMinMaxChartSettings | undefined;

    // Whether or not each series has its own X Axis. Default is true if not specified or not set to false. If false, the chart SHOULD NOT
    // have too many series because it will be a lot of xAxes
    readonly shareXAxis?: boolean | undefined;

    // Whether or not each series has its own Y Axis. Default is false if not specified or not set to true. If false, the chart SHOULD NOT
    // have too many series because it will be a lot of yAxes
    readonly shareYAxis?: boolean | undefined;

    readonly showYAxes?: boolean | undefined;
    readonly showCursorAt?: number | undefined;         // The position (timestamp) on the X axis where we want to show a cursor
    readonly showLegends?: boolean;                     // default is true
    readonly showBullets?: boolean;
    readonly disableZoom?: boolean;

    // Either 1 date range or an array of date ranges, 1 for each x axis
    readonly dateRange?: ChartDateRange | readonly ChartDateRange[] | undefined;

    readonly yAxesRange?: {
        readonly [metricName: string]: {
            readonly min?: number | undefined;
            readonly max?: number | undefined;
        } | undefined;
    } | undefined;

    readonly yAxesRangeMarkers?: readonly (YAxisRangeMarker | undefined)[] | undefined;
}



export const XYChart: React.FC<XYChartProps> = (props: XYChartProps) => {

    const { onChartZoomAndPan, onChartClick } = props;
    const chartRef = useRef<am4charts.XYChart>();

    // Get the chart color from the theme. If colors are not defined, use the predefined set of colors
    const theme: ModeTheme = useTheme();
    const { chartColors, gridStroke, cursorStroke } = useMemo(() => {
        if (theme && theme.palette.chart && theme.palette.chart.series.length > 0) {
            return {
                chartColors: theme.palette.chart.series.map((colorString) => {
                    return am4core.color(colorString);
                }),
                gridStroke  : am4core.color(theme.palette.chart.gridStroke),
                cursorStroke: am4core.color(theme.palette.chart.cursorStroke),
            };
        }
        return {
            chartColors : chartDefaultColors,
            gridStroke  : chartDefaultGridStroke,
            cursorStroke: chartDefaultCursorStroke,
        };
    }, [theme]);


    // For debugging chart re-rendering
    const chartIdRef = useRef<string>();
    const showYAxesRef = useRef<boolean | undefined>();
    const shareXAxisRef = useRef<boolean | undefined>();
    const shareYAxisRef = useRef<boolean | undefined>();
    const showCursorAtRef = useRef<number | undefined>();
    const displayMetricsRef = useRef<readonly NumericMetricInfo[]>();
    const chartTypeRef = useRef<XYChartType>();
    const showBulletsRef = useRef<boolean>();
    const showLegendsRef = useRef<boolean>();
    const disableZoomRef = useRef<boolean | undefined>();
    const localeRef = useRef<string | undefined>();
    const onChartZoomAndPanRef = useRef<(event: any)=> void>();
    const onChartClickRef = useRef<(event: any)=> void>();
    const dataPointsRef = useRef<DataPointArrayType | MultiDataPointArrayType>();
    const dateRangeRef = useRef<ChartDateRange | readonly ChartDateRange[] | undefined>();
    const exportSettingsRef = useRef<ChartSettings['exportSettings']>();
    const yAxesRangeRef = useRef<XYChartProps['yAxesRange'] | undefined>();
    const yAxesRangeMarkersRef = useRef<XYChartProps['yAxesRangeMarkers'] | undefined>();
    const avgMinMaxChartSettingsRef = useRef<AvgMinMaxChartSettings | undefined>();


    /**
     * X Axes' selectionextremeschanged handler
     */
    const zoomPanHandler = useCallback((event: any) => {
        const chart = chartRef.current as am4charts.XYChart;
        if (onChartZoomAndPan && chart && !chart.isDisposed()) {
            const start = moment(event.target.minZoomed).valueOf();
            const end = moment(event.target.maxZoomed).valueOf();
            onChartZoomAndPan(start, end);
        }
    }, [onChartZoomAndPan]);


    /**
     * On chart click handler
     */
    const clickHandler = useCallback((event: any) => {
        const chart = chartRef.current as am4charts.XYChart;
        if (onChartClick && chart && !chart.isDisposed()) {
            const point = event.spritePoint;                            // get the point the user clicked in pixel
            for (let i = 0; i < chart.xAxes.length; i += 1) {
                const dateAxis = chart.xAxes.getIndex(i) as am4charts.DateAxis;
                const timestamp = Math.floor(dateAxis.xToValue(point.x));   // convert the point to timestamp in millisecond
                onChartClick(timestamp);
            }
        }
    }, [onChartClick]);



    // This useEffect is used for cleaning up Chart when component unmounted
    useEffect(() => {
        // Return cleanup function
        return () => {
            const chart = chartRef.current as am4charts.XYChart;
            if (chart && !chart.isDisposed()) {
                // console.log('dispose chart');

                // unsubscribe to data axis's events
                for (let i = 0; i < chart.xAxes.length; i += 1) {
                    (chart.xAxes.getIndex(i) as am4charts.DateAxis).events.off('selectionextremeschanged');
                }
                chart.events.off('ready');
                chart.plotContainer.events.off('hit');

                // dispose chart
                chart.dispose();
                chartRef.current = undefined;
            }
        };
    }, []);



    /**
     * This useEffect is used for creating/updating the chart. This useEffect depends on a lot of props and when each props change, this useEffect
     * will be called. So, it will be very slow if we were to re-create the chart every time this useEffect is called. We can't remove any of the
     * dependencies because the chart needs all the dependencies. So to solve this problem, we will keep a reference of the PREVIOUS prop values.
     * Each time this useEffect is called, we will compare the new prop values with the previous to determine which props changed. Some props
     * will always require a new chart to be created e.g. chartId and displayedSeries when they are changed. Some props does not which mean we can
     * just update the chart's properties when component props changed.
     */
    useEffect(() => {

        // console.log('Chart useEffect');

        // props.displayMetrics is an Object so sometime comparing displayMetricsRef.current with props.displayMetrics returns true because
        // the pointer changed even though the contents are the same. So we will stringify them and compare the strings instead.
        const previousDisplayMetricsStringified = JSON.stringify(displayMetricsRef.current);
        const newDisplayMetricsStringified = JSON.stringify(props.displayMetrics);


        let chart = chartRef.current as am4charts.XYChart;

        // Dispose and create new charts can be slow therefore we don't want to create new chart every time one of the props change. Only
        // some of the props requires recreating a new chart so this is the conditions which require creating a new chart.
        const createNewChart: boolean = chartIdRef.current !== props.chartId || chartTypeRef.current !== props.chartType;

        if (!chart || createNewChart) {

            if (chart && !chart.isDisposed()) {
                // Dispose old chart first
                // console.log('dispose chart');

                // unsubscribe to data axis's events
                for (let i = 0; i < chart.xAxes.length; i += 1) {
                    (chart.xAxes.getIndex(i) as am4charts.DateAxis).events.off('selectionextremeschanged');
                }

                chart.events.off('ready');
                chart.plotContainer.events.off('hit');

                // dispose chart
                chart.dispose();
                chartRef.current = undefined;
            }

            // create new Chart
            // console.log('create chart', props.chartId);
            chart = am4core.create(props.chartId, am4charts.XYChart);
            chartRef.current = chart;
            chart.dateFormatter.dateFormat = chartFullDateFormat;
            chart.plotContainer.background.stroke = am4core.color(theme.palette.chart.gridStroke);

            // add cursor
            chart.cursor = new am4charts.XYCursor();
            chart.cursor.lineX.strokeWidth = 2;
            chart.cursor.lineY.disabled = true;
            chart.cursor.opacity = 1;
            chart.cursor.lineX.stroke = cursorStroke;
        }



        if (createNewChart || exportSettingsRef.current !== props.exportSettings) {
            // exportSettings changed, update the chart.exportingMenu
            if (props.exportSettings) {
                if (!chart.exporting.menu) {
                    chart.exporting.menu = new am4core.ExportMenu();
                }
                if (props.exportSettings.align) {
                    chart.exporting.menu.align = props.exportSettings.align;
                }
                if (props.exportSettings.verticalAlign) {
                    chart.exporting.menu.verticalAlign = props.exportSettings.verticalAlign;
                }
                if (props.exportSettings.items) {
                    chart.exporting.menu.items = props.exportSettings.items;
                }
            } else if (!props.exportSettings && chart.exporting.menu) {
                if (chart.exporting.menu) {
                    chart.exporting.menu.dispose();
                }
            }
        }


        // data resolution changed, we need to update the dateAxis's tooltip date format accordingly
        const createXAxes = createNewChart || shareXAxisRef.current !== props.shareXAxis
                                || previousDisplayMetricsStringified !== newDisplayMetricsStringified;
        if (createXAxes) {
            // dispose previous xAxes
            while (chart.xAxes.length > 0) {
                chart.xAxes.removeIndex(0).dispose();
            }

            // Create X axis if there isn't one created yet
            // Default is always Share X Axes unless it is specifically set to false. If it is false then we will create 1 x axis for each metric
            const numberOfXAxes = props.shareXAxis === false ? props.displayMetrics.length : 1;
            for (let i = 0; i < numberOfXAxes; i += 1) {
                const dateAxis = chart.xAxes.push(new am4charts.DateAxis());
                dateAxis.renderer.grid.template.strokeOpacity = 1;
                dateAxis.renderer.grid.template.strokeWidth = 1;
                dateAxis.renderer.grid.template.stroke = gridStroke;
                dateAxis.renderer.labels.template.disabled = i > 0;
                dateAxis.renderer.labels.template.fill = am4core.color(theme.palette.text.primary);

                if (props.shareXAxis !== false) {
                    dateAxis.renderer.minGridDistance = 100;
                    dateAxis.dateFormats.setKey('day', chartShortDateFormat);                 // The value displayed in each tick
                    dateAxis.periodChangeDateFormats.setKey('day', chartShortDateFormat);     // The first value
                }
            }
        }


        // If we recreated X Axes or if the onChartZoomAndPan handler changed, we
        if (createXAxes || onChartZoomAndPanRef.current !== zoomPanHandler) {
            // unsubscribe to data axis's events
            for (let i = 0; i < chart.xAxes.length; i += 1) {
                (chart.xAxes.getIndex(i) as am4charts.DateAxis).events.off('selectionextremeschanged');
            }

            // subscribe to data axis's events
            for (let i = 0; i < chart.xAxes.length; i += 1) {
                (chart.xAxes.getIndex(i) as am4charts.DateAxis).events.on('selectionextremeschanged', zoomPanHandler);
            }
        }


        // If we just created a new chart and the container has a onChartClick event handler, listen to the 'hit' event on the chart's plot area
        // and dispatch an event when it is clicked.
        if (createNewChart || onChartClickRef.current !== clickHandler) {
            chart.plotContainer.events.off('hit');
            chart.plotContainer.events.on('hit', clickHandler);
        }


        // data resolution changed, we need to update the dateAxis's tooltip date format accordingly
        if (createXAxes || JSON.stringify(dateRangeRef.current) !== JSON.stringify(props.dateRange)) {

            // Default, show full date/time
            for (let i = 0; i < chart.xAxes.length; i += 1) {
                const dateAxis = chart.xAxes.getIndex(i) as am4charts.DateAxis;
                dateAxis.tooltipDateFormat = chartDateFormatByDataResolution.short;

                // We will assume props.dateRange is either 1 date range for all xAxes or 1 per xAxis
                const dateRange = isChartDateRange(props.dateRange) ? props.dateRange : props.dateRange?.[i];
                if (dateRange) {
                    if (dateRange.start && dateRange.end) {
                        dateAxis.min = dateRange.start;
                        dateAxis.max = dateRange.end;
                        dateAxis.strictMinMax = true;
                        // console.log((dateRange.end - dateRange.start) / Time.DAY_IN_MS)
                    }
                    if (dateRange.resolution) {
                        if (dateRange.resolution >= Time.MONTH_IN_MS) {
                            dateAxis.tooltipDateFormat = chartDateFormatByDataResolution.extraLong;
                        } else if (dateRange.resolution >= Time.DAY_IN_MS) {
                            dateAxis.tooltipDateFormat = chartDateFormatByDataResolution.long;
                        } else if (dateRange.resolution >= Time.MINUTE_IN_MS) {
                            dateAxis.tooltipDateFormat = chartDateFormatByDataResolution.medium;
                        }
                    }
                }
            }
        }


        // If we just created a new chart or if locale changed, update chart date formatter locale
        if (createNewChart || localeRef.current !== props.locale) {
            if (props.locale) {
                chart.dateFormatter.intlLocales = props.locale;
            }
        }


        // If we are creating new chart or if showCursorAt props changed, update chart's cursor
        if ((createNewChart || showCursorAtRef.current !== props.showCursorAt) && props.showCursorAt !== undefined) {
            // Create cursor at the specified location, props.showCursorAt
            for (let i = 0; i < chart.xAxes.length; i += 1) {
                const dateAxis = chart.xAxes.getIndex(i) as am4charts.DateAxis;
                const point = dateAxis.valueToPoint(props.showCursorAt) || 0;
                chart.cursor.triggerMove(point, 'soft');
            }
        }


        if (createNewChart || disableZoomRef.current !== props.disableZoom) {
            if (props.disableZoom) {
                chart.cursor.behavior = 'none';
            } else {
                chart.cursor.behavior = 'zoomX';
            }
        }

        // We need to check this in other places so make it a variable that we can reuse
        const createNewSeries = createNewChart || previousDisplayMetricsStringified !== newDisplayMetricsStringified
            || chartTypeRef.current !== props.chartType || JSON.stringify(yAxesRangeRef.current) !== JSON.stringify(props.yAxesRange)
            || JSON.stringify(yAxesRangeMarkersRef.current) !== JSON.stringify(props.yAxesRangeMarkers)
            || shareYAxisRef.current !== props.shareYAxis
            || JSON.stringify(avgMinMaxChartSettingsRef.current) !== JSON.stringify(props.avgMinMaxChartSettings);

        // if we just created a new chart or if the set of metrics to be displayed changed, recreate metrics
        if (createNewSeries) {

            // remove the current series and yAxes first
            while (chart.series.length > 0) {
                chart.series.removeIndex(0).dispose();
            }

            while (chart.yAxes.length > 0) {
                chart.yAxes.removeIndex(0).dispose();
            }

            
            // Create value axes and series for each metrics
            props.displayMetrics.forEach((metric: NumericMetricInfo, index: number) => {
                const dateAxis = props.shareXAxis === false ? chart.xAxes.getIndex(index) as am4charts.DateAxis : undefined;

                // The field name in the data that is used for date axis value
                const dateAxisDataField = getDateKey(props.shareXAxis === false ? index : 0);

                createAxisAndSeries({
                    chart,
                    chartType             : props.chartType,
                    metric,
                    hasMultipleSeries     : props.displayMetrics.length > 1,
                    seriesCount           : props.displayMetrics.length,
                    seriesIndex           : index,
                    opposite              : index % 2 !== 0,
                    yAxisRange            : props.yAxesRange?.[metric.name],
                    shareYAxis            : props.shareYAxis,
                    yAxesRangeMarkers     : props.yAxesRangeMarkers,
                    dateAxis,
                    dateAxisDataField,
                    avgMinMaxChartSettings: props.avgMinMaxChartSettings,
                    chartColors,
                    gridStroke,
                });
            });
        }


        if (createNewSeries || showYAxesRef.current !== props.showYAxes) {
            for (let i = 0; i < chart.yAxes.length; i += 1) {
                const yAxis = chart.yAxes.getIndex(i);
                if (yAxis) {
                    yAxis.renderer.labels.template.disabled = !props.showYAxes;
                }
            }
        }


        // if we just created a new chart or if show legends option changed, update legends visibility
        if (createNewChart || showLegendsRef.current !== props.showLegends) {
            if (props.showLegends && !chart.legend) {
                // create legend if there isn't one
                chart.legend = new am4charts.Legend();
                chart.legend.labels.template.fill = am4core.color(theme.palette.text.primary);
            } else if (!props.showLegends && chart.legend) {
                // dispose legend if there is one
                chart.legend.dispose();
            }
        }


        // if we just created a new chart or if show bullets option changed, update bullets visibility
        if (createNewSeries || showBulletsRef.current !== props.showBullets) {
            const showBullets = props.showBullets === true || props.chartType === XYChartType.SCATTER || props.chartType === XYChartType.AVG_MIN_MAX;
            for (let i = 0; i < chart.series.length; i += 1) {
                const series = chart.series.values[i];
                const bullet = series.bullets.getIndex(0);
                if (bullet) {
                    bullet.disabled = !showBullets;
                }
                series.invalidate();
            }
        }


        // if we just created a new chart or the data changed, replace chart's data with new data
        if (createNewChart || dataPointsRef.current !== props.dataPoints || shareXAxisRef.current !== props.shareXAxis) {
            // changing data will trigger zoom/pan events which will trigger another data update and cause an infinite loop.
            // so before we make changes to the data, we will disable dateAxis event. Once data is rendered, we re-enable the event.
            for (let i = 0; i < chart.xAxes.length; i += 1) {
                const dateAxis = chart.xAxes.getIndex(i) as am4charts.DateAxis;
                dateAxis.events.disable();
                chart.events.on('datavalidated', () => {
                    dateAxis.events.enable();
                    chart.events.off('datavalidated');
                });
            }

            const dataPointArray = isDataPointArrayType(props.dataPoints) ? [props.dataPoints] : props.dataPoints;
            chart.data = dataPointArray.map((data, index) => {
                const dateAxisDataField = getDateKey(props.shareXAxis === false ? index : 0);
                return data.map((dataPoint: MultiSeriesDataPoint<number>) => {
                    return {
                        [dateAxisDataField]: dataPoint.date,
                        ...dataPoint.values,
                    };
                });
            }).flat();
        }



        // console.log('End useEffect');


        chartIdRef.current = props.chartId;
        showYAxesRef.current = props.showYAxes;
        shareXAxisRef.current = props.shareXAxis;
        shareYAxisRef.current = props.shareYAxis;
        showCursorAtRef.current = props.showCursorAt;
        displayMetricsRef.current = props.displayMetrics;
        chartTypeRef.current = props.chartType;
        showBulletsRef.current = props.showBullets;
        showLegendsRef.current = props.showLegends || false;
        localeRef.current = props.locale;
        disableZoomRef.current = props.disableZoom;
        onChartZoomAndPanRef.current = zoomPanHandler;
        onChartClickRef.current = clickHandler;
        dataPointsRef.current = props.dataPoints;
        dateRangeRef.current = props.dateRange;
        exportSettingsRef.current = props.exportSettings;
        yAxesRangeRef.current = props.yAxesRange;
        yAxesRangeMarkersRef.current = props.yAxesRangeMarkers;
        avgMinMaxChartSettingsRef.current = props.avgMinMaxChartSettings;

    }, [props.chartId, props.dataPoints, props.displayMetrics, props.showBullets, props.showLegends, props.locale, props.showCursorAt,
        props.showYAxes, props.dateRange, onChartZoomAndPan, onChartClick, props.disableZoom, props.chartType, props.exportSettings,
        props.yAxesRange, props.shareYAxis, props.shareXAxis, props.avgMinMaxChartSettings, zoomPanHandler, clickHandler, chartColors,
        props.yAxesRangeMarkers, cursorStroke, gridStroke, theme]);



    return (
        <div id={props.chartId} className={clsx(props.className)} />
    );
};
