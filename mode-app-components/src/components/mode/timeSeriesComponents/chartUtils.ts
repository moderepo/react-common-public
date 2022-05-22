import * as am4core from '@amcharts/amcharts4/core';
import {
    modeDefaultChartColorPalette,
} from '../../../themes';


export interface ChartSettings {
    readonly className?: string;
    readonly locale?: string;
    readonly exportSettings?: {
        // To customize the menu items. By default, we show all options provided by amchart
        readonly items?: am4core.IExportMenuItem[] | undefined;

        // to customize the location of the menu toggler button. The default will be top right corner
        readonly align?: am4core.Align | undefined;
        readonly verticalAlign?: am4core.VerticalAlign | undefined;
    } | undefined;
    readonly onChartZoomAndPan?: (startTS: number, endTS: number)=> void;
    readonly onChartClick?: (timestamp: number)=> void;
}


export interface AvgMinMaxChartSettings {
    readonly minDataFieldPostfix: string;
    readonly maxDataFieldPostfix: string;
    readonly avgLabel: string;
    readonly minLabel: string;
    readonly maxLabel: string;
}


export interface ChartMetricInfo {
    readonly color?: string | undefined;
}


export enum XYChartType {
    SCATTER = 'scatter',
    LINE = 'line',
    BAR = 'bar',
    AREA = 'area',
    AVG_MIN_MAX = 'avg/min/max'
}


export enum ChartBulletShape {
    TRIANGLE = 'triangle',
    RECTANGLE = 'rectangle',
    CIRCLE = 'circle',
}

export interface ChartBulletConfig {
    readonly shape: ChartBulletShape;
    readonly size: number;
}

export interface ChartSeriesStyle {
    readonly id: string;
    readonly bullet: ChartBulletConfig;
    readonly color: am4core.Color;
}

export const chartCircleBullet: ChartBulletConfig = {
    shape: ChartBulletShape.CIRCLE,
    size : 8,
};

export const chartTriangleBullet: ChartBulletConfig = {
    shape: ChartBulletShape.TRIANGLE,
    size : 8,
};

export const chartRectangleBullet: ChartBulletConfig = {
    shape: ChartBulletShape.RECTANGLE,
    size : 8,
};

/**
 * Predefined set of bullets
 */
export const chartPredefinedBullets: readonly ChartBulletConfig[] = [
    chartCircleBullet, chartTriangleBullet, chartRectangleBullet,
];


/**
 * Default predefined set of colors for series line and bullets. This is only used if a selected theme does not have
 * chart color set.
 */
export const chartDefaultColors = modeDefaultChartColorPalette.series.map((colorString) => {
    return am4core.color(colorString);
});

/**
 * Default chart grid and cursor color. This is only used if a selected theme does not have chart gridStroke or cursorStroke color set
 */
export const chartDefaultGridStroke = am4core.color(modeDefaultChartColorPalette.gridStroke);
export const chartDefaultCursorStroke = am4core.color(modeDefaultChartColorPalette.cursorStroke);



/**
 * Pick a style for a series. We will return an object containing a color and a bullet.
 * For picking color, we will pick a color from the chartColors array at the given `index`. If the index > chartColor.length, we will
 * wrap around and start from the beginning of the array
 */
export const getChartSeriesStyle = (chartColors: readonly am4core.Color[], index: number): ChartSeriesStyle => {
    if (chartColors.length > 0 && chartPredefinedBullets.length > 0) {
        const colorIndex = index % chartColors.length;
        const bulletIndex = index % chartPredefinedBullets.length;
        const color = chartColors[colorIndex];
        const bulletStyle = chartPredefinedBullets[bulletIndex];
        return {
            id    : `${bulletStyle.shape}-${color.hex}`,
            bullet: bulletStyle,
            color,
        };
    }

    const color = am4core.color('#000000');
    const bulletStyle = chartCircleBullet;
    return {
        id    : `${bulletStyle.shape}-${color.hex}`,
        bullet: bulletStyle,
        color,
    };
};


export const chartFullDateFormat: Intl.DateTimeFormatOptions = {
    year  : 'numeric',
    month : 'short',
    day   : '2-digit',
    hour  : '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
};


/**
 * Sometime when the data resolution is very long e.g. 1 data point per month, it is not necessary to show the data point's time stamp with all the
 * time details e.g. hh:mm:ss. So, we will have different date/time format for different data resolution.
 */
export const chartDateFormatByDataResolution = {
    short: {
        year  : 'numeric',
        month : 'short',
        day   : '2-digit',
        hour  : '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    } as Intl.DateTimeFormatOptions,
    medium: {
        year  : 'numeric',
        month : 'short',
        day   : '2-digit',
        hour  : '2-digit',
        minute: '2-digit',
        hour12: false,
    } as Intl.DateTimeFormatOptions,
    long: {
        year  : 'numeric',
        month : 'short',
        day   : '2-digit',
        hour12: false,
    } as Intl.DateTimeFormatOptions,
    extraLong: {
        year  : 'numeric',
        month : 'short',
        hour12: false,
    } as Intl.DateTimeFormatOptions,
};


export const chartShortDateFormat: Intl.DateTimeFormatOptions = {
    year  : 'numeric',
    month : '2-digit',
    day   : '2-digit',
    hour12: false,
};
