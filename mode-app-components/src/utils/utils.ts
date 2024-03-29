import {
    MemberRole,
} from '@moderepo/mode-apis';
import {
    ModeThemeType,
} from '../themes';



/**
 * Capitalize the given string e.g. from "this is a test" to "This Is A Test".
 * Note that this function will trim words that has multiple spaces in between.
 * If we need to keep the spacing in the future, we will need to revise this function.
 */
export const capitalizeAll = (sentence: string): string => {
    return sentence.split(' ').map((word: string): string => {
        return `${word.substring(0, 1).toUpperCase()}${word.substring(1)}`;
    }).join(' ');
};


/**
 * Capitalize the given string e.g. from "this is a test" to "This is a test".
 */
export const capitalizeFirst = (sentence: string): string => {
    return `${sentence.substring(0, 1).toUpperCase()}${sentence.substring(1)}`;
};


/**
 * Get the error message for the given error code. NOTE: this function will return the error message KEY which need to be translated, not
 * the actual error message. The key will follow this convention
 *      'error.message.[ERROR_CODE_IN_LOWERCASE]'
 *
 * So for error code 'EMAIL_NOT_FOUND', this function will return 'error.message.email_not_found' and there need to be a translation key
 * 'error.message.email_not_found' in the translation file or else the UI will be displaying the error message KEY instead of actual error message.
 *
 * @param code
 * @returns
 */
export const getErrorMessage = (code: string): string => {
    return `error.message.${code.toLowerCase()}`;
};


/**
 * Get the user's home member display role name
 */
export const getHomeMemberRoleName = (role: MemberRole): string => {
    const names = Object.freeze({
        [MemberRole.OWNER] : 'home_member_role.owner',
        [MemberRole.MEMBER]: 'home_member_role.member',
    });

    return names[role];
};



/**
 * User friendly name for themes. These will be used for displaying theme.
 */
export const getThemeName = (theme: string): string => {
    const ThemeName = Object.freeze({
        [ModeThemeType.DEFAULT]     : 'theme.default',
        [ModeThemeType.MODE_CLASSIC]: 'theme.mode_classic',
        [ModeThemeType.MODE_LIGHT]  : 'theme.mode_light',
        [ModeThemeType.MODE_DARK]   : 'theme.mode_dark',
    });
    return ThemeName[theme] || theme;
};



/**
 * Return the midnight date of the provided 'date'
 */
export const getMidnightDate = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
};



/**
 * Round a value to the specified decimal places
 * @param value
 * @param decimalPlaces
 */
export const roundValue = (value: number, decimalPlaces: number = 2): string => {
    if (value !== undefined) {
        if (value === Math.floor(value)) {
            return value.toString();
        }
        return value.toFixed(decimalPlaces);
    }
    return '0';
};



/**
 * Return a number formatter that can be use for rounding numbers. NOTE that this object can be reused multiple times. Don't need to create
 * a formatter each time we need to format a number.
 */
export const getNumberFormatter = (locale: string, decimalPlaces: number) => {
    return new Intl.NumberFormat(locale ?? 'en', {
        maximumFractionDigits: Math.max(0, Math.min(20, decimalPlaces)),
    });
};


/**
 * Return a Date formatter that can used for formatting Dates. NOTE that this object can be reused multiple times. Don't need to create
 * a formatter each time we need to format a date.
 *
 * @param format - Can be a shortcut format name e.g. 'full', 'compact', 'date', 'time' or an Intl.DateTimeFormatOptions object
 */
export const getDateTimeFormatter = (locale: string, format: 'full' | 'compact' | 'date' | 'time' | Intl.DateTimeFormatOptions) => {
    const options = ((): Intl.DateTimeFormatOptions => {
        if (typeof format === 'string') {
            const options: Intl.DateTimeFormatOptions = {
            };
            if (format === 'date' || format === 'compact' || format === 'full') {
                options.month = format === 'compact' ? '2-digit' : 'short';
                options.day = '2-digit';
                options.year = format === 'compact' ? '2-digit' : 'numeric';
                options.hour12 = false;
            }

            if (format === 'time' || format === 'compact' || format === 'full') {
                options.hour = '2-digit';
                options.minute = '2-digit';
                options.second = '2-digit';
                options.hour12 = false;
            }
            return options;
        }
        return format;
    })();

    return new Intl.DateTimeFormat(locale, options);
};
