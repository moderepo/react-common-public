/**
  * Interface for Language object
  */
export interface Language {
    readonly name: string;       // The user friendly name
    readonly shortName: string;  // The shorter version of the user-friendly name used for places where we don't have space to use the full name
    readonly code: string;       // The 2 characters language code
    readonly locale: string;     // The 4 characters language code + country code separated by _ e.g. en_US
    readonly locale2: string;    // The 4 characters language code + country code separated by - e.g. en-US
}


/**
 * This is the interface for the country information e.g. name, code, phone format, currency, etc...
 */
export interface CountryData {
    readonly name: string;
    readonly code2: string;                // 2 chars country code
    readonly code3: string;                // 3 chars country code
    readonly countryCode: string;          // numeric country code
    readonly iso3166: string;
    readonly region: string;
    readonly subRegion: string;
    readonly intermediateRegion: string;
    readonly regionCode: string;
    readonly subRegionCode: string;
    readonly intermediateRegionCode: string;
    readonly countryNameKey: string;
    readonly shortCountryNameKey: string;
    readonly phone: {
        readonly mask: string;
        readonly dialCode: string;
        readonly length: number;
        readonly fullMask: string;
        readonly fullLength: number;
    };
    readonly currency: {
        readonly name: string;
        readonly code: string;
        readonly units: number;
    };
}


/**
 * Interface for TimeZone definitions
 */
export interface TimeZone {
    readonly countryCode: string;
    readonly timeZone: string;
    readonly coordinates: string;
    readonly comments?: string | undefined;
}


/**
 * Split locale into 2 parts, language code and country code. E.g. from 'en-US' to ['en', 'US']
 * This function will work with both - and _ separator. Also, if locale does not contain country
 * code, this function will return the defaultCountryCode or an empty string if defaultCountryCode is
 * not provided. Country code will never be null or undefined.
 */
export const splitLocale = (locale: string, defaultCountryCode?: string): [string, string] => {
    const localeSeparator = locale.indexOf('-') >= 0 ? '-' : '_';
    const parts = locale.split(localeSeparator);
    return [parts[0], parts[1] ? parts[1] : defaultCountryCode || ''];
};


/**
 * Given a language code, find the Language from the list of supported languages that matches the given language code.
 */
export const getLanguageByCode = (supportedLanguages: readonly Language[], locale: string | undefined | null): Language | undefined => {
    if (locale) {
        // NOTE - some locale use - and some use _ to separate language code and country code
        const languageCode = splitLocale(locale)[0].toLowerCase();
        return supportedLanguages.find((language: Language) => {
            return language.code === languageCode;
        });
    }

    return undefined;
};
