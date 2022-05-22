import React, {
    useState, useCallback,
} from 'react';
import {
    FormControl, InputLabel, FormHelperText, makeStyles, Select, TextField, Theme,
} from '@material-ui/core';
import clsx from 'clsx';


const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
            display      : 'flex',
            flexDirection: 'row',
            alignItems   : 'center',
            width        : '100%',
            flexWrap     : 'wrap',
        },

        countryCodeInput: {
            marginRight: theme.spacing(2),
        },

        phoneNumberInput: {
            flex: 1,
        },

        inputHelpText: {
            flexBasis: '100%',
        },

        phoneInputFieldInputWrapper: {
            width     : '100%',
            display   : 'flex',
            alignItems: 'center',
            position  : 'relative',
        },

        phoneInputFieldCountrySelect: {
            position      : 'absolute',
            zIndex        : 2,
            width         : '7em',
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'flex-end',
        },

        phoneInputFieldCountrySelectToggler: {
            whiteSpace            : 'nowrap',
            '& .MuiButton-endIcon': {
                margin: 0,
            },
        },

        phoneInputFieldPhoneInput: {
            position  : 'relative',
            zIndex    : 1,
            marginLeft: theme.spacing(0),
            '& input' : {
                marginLeft: '7em',
            },
        },

    };

}, {
    name: 'PhoneNumberInput',
});



export interface CountryDialCodeOption {
    readonly name: string;
    readonly dialCode: string;
}


/**
 * Given a phone number including country dial code, parse it and return the country and phone number separately
 * For example: given '+1 4151234567', return [US_Country, '4151234567']
 * Given '+81123456789', return [Japan_Country, '123456789']
 */
export const parsePhoneNumber = (
    countryListJson: readonly CountryDialCodeOption[] | undefined, phone: string,
): [CountryDialCodeOption | undefined, string | undefined] => {
    if (countryListJson && phone.startsWith('+')) {
        // try to break the number into 2 parts, the country code + the phone number
        const parts = phone.split(' ');
        if (parts.length >= 2) {
            // We have have 2 or more parts. This mean the first part will be the country code and the second part is the phone number
            const country = Object.values(countryListJson).find((c: any): boolean => {
                return c.phone.dialCode === parts[0];
            });
            if (country) {
                // We found the country for the phone number's country code, now return that country and the phone number without the code
                return [country as CountryDialCodeOption, parts[1]];
            }
        } else {
            // The phone number DOES NOT contain space as separator. We will try to guess the country by matching the first few digits
            // of the phone number to one of the countries' dial code
            // Try matching the first 4 digits of the phone number to the countries' phone format first. If success then return that
            // matched country. If not then try matching the first 3 digit and so on.
            for (let i = 5; i > 0; i -= 1) {
                const code = phone.substr(0, i);
                const phoneNumber = phone.substring(i);

                const country = Object.values(countryListJson).find((c: CountryDialCodeOption): boolean => {
                    return c.dialCode === code;
                });
                if (country) {
                // We found the country for the phone number's country code, now return that country and the phone number without the code
                    return [country as CountryDialCodeOption, phoneNumber];
                }
            }
        }
    }

    // If the number doesn't starts with '+' so it is not a valid phone number
    return [undefined, undefined];
};


export interface PhoneNumberInputFieldProps {
    readonly className?: string;
    readonly countries?: readonly CountryDialCodeOption[] | undefined;
    readonly defaultCountry?: CountryDialCodeOption | undefined;
    readonly variant?: 'filled' | 'standard' | 'outlined' | undefined;
    readonly required?: boolean;
    readonly fullWidth?: boolean;
    readonly autoFocus?: boolean;
    readonly labels?: {
        readonly country: string;
        readonly phoneNumber: string;
    };
    readonly InputLabelProps?: any;
    readonly inputProps: any;
    readonly error?: boolean;
    readonly helperText?: string;
    readonly value?: string | undefined;
    readonly onKeyPress?: (event: React.KeyboardEvent)=> void;
    readonly onKeyDown?: (event: React.KeyboardEvent)=> void;
    readonly onKeyUp?: (event: React.KeyboardEvent)=> void;
    readonly onChange?: (phoneNumber: string)=> void;
}



/**
 * Custom input field for phone number input. For phone number input, the user needs to include country dial code which
 * is not easy for the user so we created this component to make it easier for the user. This component lets the user
 * select one of a country from the list, instead of entering the country dial code, and then enter the local phone number.
 * The end result will be a combination of the country dial code of the country the user selected + the local phone number.
 */
export const PhoneNumberInputField = (props: PhoneNumberInputFieldProps) => {
    const classes = useStyle();


    // When there is a default value provided, it might contains country code so we need to find out which country it is
    // and update the selectedCountry accordingly
    const [defaultCountry, defaultValue] = props.value ? parsePhoneNumber(props.countries, props.value) : [undefined, undefined];

    const [countryCodeInput, setCountryCodeInput] = useState<string | undefined>(
        defaultCountry?.dialCode || props.defaultCountry?.dialCode,
    );
    const [phoneNumberInput, setPhoneNumberInput] = useState(defaultValue || props.value);


    const { onChange } = props;


    const onKeyUp = useCallback((event: React.KeyboardEvent) => {
        if (props.onKeyUp) {
            props.onKeyUp(event);
        }
    }, [props]);


    const onKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (props.onKeyDown) {
            props.onKeyDown(event);
        }
    }, [props]);


    const onKeyPress = useCallback((event: React.KeyboardEvent) => {
        if (props.onKeyPress) {
            props.onKeyPress(event);
        }
    }, [props]);


    const onCountryChange = useCallback((event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const countryCode = event.target.value as string;
        setCountryCodeInput(countryCode);

        // Get the user's phone number input and return the number including the country code
        // However, if the phone number is empty, return an empty string, don't return just the country code
        const newNumber = phoneNumberInput ? `${countryCode} ${phoneNumberInput}` : '';

        if (onChange) {
            onChange(newNumber);
        }
    }, [setCountryCodeInput, onChange, phoneNumberInput]);


    const onPhoneNumberChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setPhoneNumberInput(value);

        const newNumber = value ? `${countryCodeInput} ${value}` : '';

        // On phone number changed, combine it with the country code and dispatch onChange event with the new number
        if (onChange) {
            onChange(newNumber);
        }
    }, [setPhoneNumberInput, onChange, countryCodeInput]);


    return (
        <FormControl
            fullWidth={props.fullWidth}
            required={props.required}
            className={clsx(classes.root, props.className)}
            error={props.error}
        >
            {props.countries && (
                <FormControl
                    className={classes.countryCodeInput}
                    variant={props.variant}
                    error={props.error}
                >
                    <InputLabel shrink={props.InputLabelProps?.shrink}>
                        {props.labels?.country}
                    </InputLabel>
                    <Select
                        native
                        value={countryCodeInput || ''}
                        onChange={onCountryChange}
                        inputProps={{
                        }}
                    >
                        {props.countries.map((country: CountryDialCodeOption): JSX.Element => {
                            return (
                                <option
                                    key={country.name}
                                    value={country.dialCode}
                                >
                                    {`${country.name} ${country.dialCode}`}
                                </option>
                            );
                        })}
                    </Select>
                </FormControl>
            )}
            <TextField
                className={classes.phoneNumberInput}
                type="tel"
                variant={props.variant}
                label={props.labels?.phoneNumber}
                InputLabelProps={props.InputLabelProps ? props.InputLabelProps : undefined}
                {...(props.inputProps ? props.inputProps : {
                })}
                autoFocus={props.autoFocus}
                value={phoneNumberInput}
                error={props.error}
                onKeyPress={onKeyPress}
                onKeyDown={onKeyDown}
                onKeyUp={onKeyUp}
                onChange={onPhoneNumberChange}
            />

            {props.helperText && (
                <FormHelperText className={classes.inputHelpText}>
                    {props.helperText}
                </FormHelperText>
            )}
        </FormControl>
    );
};
