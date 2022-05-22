import deepmerge from 'deepmerge';
import {
    createModePalette,
    createModeTheme, modeDefaultChartColorPalette, ModePalette, modeThemeBase,
} from './ModeThemeBase';


/**
 * This is the MUI Default theme which DOES NOT override any of MUI's style. We just need to create a theme constants so that we can reference it
 */


/**
 * The color palette for the ModeDefaultTheme
 */
const palette: ModePalette = createModePalette({
    chart: modeDefaultChartColorPalette,
});

export const muiThemeDefault = createModeTheme(deepmerge(modeThemeBase, {
    palette,
}));
