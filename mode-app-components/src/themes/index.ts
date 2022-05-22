import {
    Theme,
} from '@material-ui/core';
import {
    modeThemeClassic,
} from './ModeThemeClassic';
import {
    modeThemeDefault,
} from './ModeThemeDefault';
import {
    muiThemeDefault,
} from './MUIThemeDefault';
import {
    modeThemeLight,
    modeThemeDark,
} from './ModeThemeBizStack';


export * from './ModeThemeBase';
export * from './MUIThemeDefault';
export * from './ModeThemeClassic';
export * from './ModeThemeDefault';
export * from './ModeThemeBizStack';


export enum ModeThemeType {
    NONE = 'none',
    DEFAULT = '',
    MODE_CLASSIC = 'modeClassic',
    MODE_LIGHT = 'modeLight',
    MODE_DARK = 'modeDark',
}

export interface ModeThemeConfig {
    readonly type: ModeThemeType;           // theme type
    readonly theme: Theme;
}


export const modeSupportedThemes: {[type: string]: ModeThemeConfig} = Object.freeze({
    [ModeThemeType.NONE]: {
        type : ModeThemeType.NONE,
        theme: muiThemeDefault,
    } as ModeThemeConfig,
    [ModeThemeType.DEFAULT]: {
        type : ModeThemeType.DEFAULT,
        theme: modeThemeDefault,
    } as ModeThemeConfig,
    [ModeThemeType.MODE_CLASSIC]: {
        type : ModeThemeType.MODE_CLASSIC,
        theme: modeThemeClassic,
    } as ModeThemeConfig,
    [ModeThemeType.MODE_LIGHT]: {
        type : ModeThemeType.MODE_LIGHT,
        theme: modeThemeLight,
    } as ModeThemeConfig,
    [ModeThemeType.MODE_DARK]: {
        type : ModeThemeType.MODE_DARK,
        theme: modeThemeDark,
    } as ModeThemeConfig,
});
