import {
    createTheme, Theme, ThemeOptions,
} from '@material-ui/core/styles';
import createPalette, {
    Palette, PaletteOptions,
} from '@material-ui/core/styles/createPalette';


export interface ModeChartThemeColorSettings {
    readonly color: string;
    readonly contrastText?: string | undefined;
}


/**
 * Interface for ModePalette which extends MaterialUI Palette
 */
export interface ModePalette extends Palette {
    // An array of color string
    readonly chart: {
        readonly series: readonly ModeChartThemeColorSettings[];
        readonly gridStroke: string;
        readonly cursorStroke: string;
    };
}


export const modeDefaultChartColorPalette: ModePalette['chart'] = {
    series: [
        {
            color: '#d45087',
        },
        {
            color: '#3366d6',
        },
        {
            color: '#70ce5b',
        },
        {
            color: '#ff7c43',
        },
        {
            color: '#7d8491',
        },
        {
            color: '#003f5c',
        },
        {
            color: '#a05195',
        },
        {
            color: '#c86bfa',
        },
        {
            color: '#3fa34d',
        },
        {
            color: '#ffc43d',
        },
        {
            color: '#706677',
        },
        {
            color: '#1a659e',
        },
        {
            color: '#fb1f77',
        },
        {
            color: '#4361ee',
        },
        {
            color: '#2fb39c',
        },
        {
            color: '#ccbd46',
        },
        {
            color: '#a384b9',
        },
        {
            color: '#5ca1c7',
        },
    ],
    gridStroke  : '#eeeeee',
    cursorStroke: '#000000',
};


const modeBaseChartColorPalette = {
    series      : [],
    gridStroke  : '#eeeeee',
    cursorStroke: '#000000',
};


export const defaultMapTilesURL: string = 'https://api.maptiler.com/maps/streets/256/{z}/{x}/{y}.png';



/**
 * Interface for ModeTheme which extends MaterialUI Palette
 */
export interface ModeTheme extends Theme {
    readonly palette: ModePalette;
    readonly mapTilesURL: string;
}

export interface ModePaletteOptions extends PaletteOptions {
    // An array of color string
    readonly chart?: {
        readonly series?: readonly ModeChartThemeColorSettings[] | undefined;
        readonly gridStroke?: string | undefined;
        readonly cursorStroke?: string | undefined;
    } | undefined;
}

export interface ModeThemeOptions extends ThemeOptions {
    readonly palette?: ModePaletteOptions;
    readonly mapTilesURL?: string | undefined;
}

export const createModePalette = (paletteOptions: ModePaletteOptions): ModePalette => {
    const palette = createPalette(paletteOptions);
    return {
        ...palette,
        chart: paletteOptions.chart
            ? {
                series      : paletteOptions.chart.series ?? modeBaseChartColorPalette.series,
                gridStroke  : paletteOptions.chart.gridStroke ?? modeBaseChartColorPalette.gridStroke,
                cursorStroke: paletteOptions.chart.cursorStroke ?? modeBaseChartColorPalette.cursorStroke,
            }
            : modeBaseChartColorPalette,
    };
};

export const createModeTheme = (options?: ModeThemeOptions, ...args: object[]): ModeTheme => {
    const theme = createTheme(options, args);
    return {
        ...theme,
        palette: {
            ...theme.palette,
            chart: options?.palette?.chart
                ? {
                    series      : options?.palette?.chart.series ?? modeBaseChartColorPalette.series,
                    gridStroke  : options?.palette?.chart.gridStroke ?? modeBaseChartColorPalette.gridStroke,
                    cursorStroke: options?.palette?.chart.cursorStroke ?? modeBaseChartColorPalette.cursorStroke,
                }
                : modeBaseChartColorPalette,
        },
        mapTilesURL: options?.mapTilesURL ?? defaultMapTilesURL,
    };
};



/**
 * This is where we define the BASE theme setting for Mode by overriding the default Material UI theme.
 * This should only include overrides that we want to apply to all other themes. For specific theme
 * override, please add to one of the other theme files.
 * See https://material-ui.com/customization/default-theme/ for the list of props you can override
 */

export const modeThemeBase = createModeTheme({
    spacing  : 10,
    overrides: {
        // Override the Month/Date display style in the header. The font size is too big therefore we need to reduce the font-size.
        MuiPickersToolbarText: {
            toolbarTxt: {
                '&.MuiTypography-h4': {
                    fontSize  : '1.7rem',
                    whiteSpace: 'nowrap',
                },
            },
        },
    } as any,
});
