import React, {
    useCallback,
} from 'react';
import {
    Paper, Button, makeStyles, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    MemberRole,
} from '@moderepo/mode-apis';
import {
    useModePanelStyle, useModeFormStyle, usePropValue, inputStateSetterHelper, FontIcon, PhoneNumberInputField,
    BaseHomeMemberInfoProps, CountryDialCodeOption,
} from '../../..';
import {
    InfoCompPanelHeader,
} from '../compPanelHeader';
import {
    ModeInfoCompSelectInputField, ModeInfoCompTextInputField,
} from '../..';



const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
        },

        statusInputField: {
            '& input': {
                fontWeight: 'bold',
            },
            '&.verified': {
                '& input': {
                    color: theme.palette.success.main,
                },
            },

            '&.not-verified': {
                '& input': {
                    color: theme.palette.error.main,
                },
            },
        },

    };
}, {
    name: 'HomeMemberInfo', index: 1,
});


/**
 * For this HomeMemberInfo, we will also need 'countryDialCodeOptions', and 'defaultCountryOption', and some 'texts' settings because this
 * component uses PhoneNumber input field. Therefore, this component will extends the BaseMemberInfoProps and add additional props.
 */
export interface HomeMemberInfoProps extends BaseHomeMemberInfoProps {
    // Country code Options for phoneNumber input. This is only used if phone number is editable and if we want to give the user a more user friendly
    // way to provide country code by selecting a country from a list instead of manually enter the number.
    readonly countryDialCodeOptions?: readonly CountryDialCodeOption[] | undefined;

    // Default country to select for phoneNumber input. Only required if phone number is editable
    readonly defaultCountryOption?: CountryDialCodeOption | undefined;

    // Country Select input label
    readonly texts?: {
        readonly country: string;
    } | undefined;
}


/**
 * This is a DUMB component used for displaying Home member info. This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const HomeMemberInfo: React.FC<HomeMemberInfoProps> = (props: HomeMemberInfoProps) => {
    const [emailInput, setEmailInput] = usePropValue<string | undefined>(props.fields.email?.value);
    const [phoneNumberInput, setPhoneNumberInput] = usePropValue<string | undefined>(props.fields.phoneNumber?.value);
    const [roleInput, setRoleInput] = usePropValue<MemberRole | undefined>(props.fields.role?.value);


    /**
     * On input change handler for all the inputs. When an input change, call the onInputChangeHelper and pass it the setter functions
     * for all inputs. The helper function will call the setter function accordingly based on the input name.
     */
    const onInputChange = useCallback((inputName: string, value: any) => {
        inputStateSetterHelper(inputName, value, {
            email      : setEmailInput,
            phoneNumber: setPhoneNumberInput,
            role       : setRoleInput,
        });
    }, [setEmailInput, setPhoneNumberInput, setRoleInput]);



    const panelClasses = useModePanelStyle();
    const formClasses = useModeFormStyle();
    const classes = useStyle();


    /**
     * On cancel edit, we need to reverse all the input back to the original values
     */
    const reverseFormInput = useCallback(() => {
        setEmailInput(props.fields.email?.value);
        setPhoneNumberInput(props.fields.phoneNumber?.value);
        setRoleInput(props.fields.role?.value);
    }, [props, setEmailInput, setPhoneNumberInput, setRoleInput]);


    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (props.actions?.saveUpdate) {
            props.actions.saveUpdate.onClick({
                email      : emailInput?.trim(),
                phoneNumber: phoneNumberInput?.trim(),
                role       : roleInput,
            });
        }

        return false;
    }, [props, emailInput, phoneNumberInput, roleInput]);



    const onPhoneNumberChange = useCallback((newPhoneNumber: string) => {
        onInputChange('phoneNumber', newPhoneNumber);
        if (props.onFormInputChange) {
            props.onFormInputChange('phoneNumber', newPhoneNumber);
        }
    }, [props, onInputChange]);


    return (
        <Paper
            elevation={2}
            className={clsx(panelClasses.root, props.className, classes.root,
                props.showCustomActionOnHover && 'show-custom-action-on-hover')}
        >
            <InfoCompPanelHeader {...props} />
            <div className={clsx(panelClasses.panelContent)}>
                <form
                    className={clsx(formClasses.root, props.formProps?.className)}
                    noValidate
                    autoComplete="on"
                    method="POST"
                    onSubmit={onFormSubmit}
                >
                    <div className={formClasses.formInputGroup}>
                        {props.fields.verified && (
                            <ModeInfoCompTextInputField
                                className={clsx(`${formClasses.formInputField}`, classes.statusInputField,
                                    props.fields.verified.value ? 'verified' : 'not-verified')}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.verified}
                                fieldName="verified"
                                inputValue={props.fields.verified.displayValue ?? props.fields.verified.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.userId && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.userId}
                                fieldName="userId"
                                inputValue={props.fields.userId.displayValue ?? props.fields.userId.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.name && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.name}
                                fieldName="name"
                                inputValue={props.fields.name.displayValue ?? props.fields.name.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.email && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="email"
                                compProps={props}
                                inputProps={props.fields.email}
                                fieldName="email"
                                inputValue={props.fields.email.editable ? emailInput : props.fields.email.displayValue ?? props.fields.email.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.phoneNumber && !props.isEditing && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="tel"
                                compProps={props}
                                inputProps={props.fields.phoneNumber}
                                fieldName="phoneNumber"
                                inputValue={props.fields.phoneNumber.editable
                                    ? phoneNumberInput
                                    : props.fields.phoneNumber.displayValue || props.fields.phoneNumber.value}
                                onInputChange={onInputChange}
                            />
                        )}

                        {props.fields.phoneNumber && props.isEditing && props.fields.phoneNumber.editable && (
                            <PhoneNumberInputField
                                className={formClasses.formInputField}
                                countries={props.countryDialCodeOptions}
                                defaultCountry={props.defaultCountryOption}
                                variant="standard"
                                required
                                fullWidth
                                labels={{
                                    country    : props.texts?.country || '',
                                    phoneNumber: props.fields.phoneNumber.label,
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputProps={{
                                }}
                                value={props.fields.phoneNumber.value}
                                error={Boolean(props.fields.phoneNumber.error)}
                                helperText={props.fields.phoneNumber.error || ''}
                                onChange={onPhoneNumberChange}
                            />
                        )}
                        
                        {props.fields.role && (
                            <ModeInfoCompSelectInputField
                                className={formClasses.formInputField}
                                compProps={props}
                                inputProps={props.fields.role}
                                fieldName="role"
                                inputValue={props.fields.role.editable ? roleInput : props.fields.role.displayValue ?? props.fields.role.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.creationTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.creationTime}
                                fieldName="creationTime"
                                inputValue={props.fields.creationTime.displayValue ?? props.fields.creationTime.value}
                                onInputChange={onInputChange}
                            />
                        )}
                    </div>

                    {props.isEditing && props.actions && (
                        <div className={clsx(formClasses.formActionContainer)}>
                            <div />
                            <div>
                                {props.actions?.cancelEdit && (
                                    <Button
                                        className={clsx(formClasses.formActionButton)}
                                        size="small"
                                        startIcon={props.actions.cancelEdit.icon
                                            ? <FontIcon iconName={props.actions.cancelEdit.icon} />
                                            : undefined}
                                        onClick={() => {
                                            reverseFormInput();
                                            if (props.actions?.cancelEdit) {
                                                props.actions.cancelEdit.onClick();
                                            }
                                        }}
                                    >
                                        {props.actions.cancelEdit.label}
                                    </Button>
                                )}
                                {props.actions?.saveUpdate && (
                                    <Button
                                        className={clsx(formClasses.formActionButton)}
                                        variant="contained"
                                        color="primary"
                                        type="submit"
                                        size="small"
                                        startIcon={props.actions.saveUpdate.icon
                                            ? <FontIcon iconName={props.actions.saveUpdate.icon} />
                                            : undefined}
                                    >
                                        {props.actions.saveUpdate.label}
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </form>
            </div>

        </Paper>
    );

};
