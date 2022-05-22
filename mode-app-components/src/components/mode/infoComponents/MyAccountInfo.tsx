import React, {
    useCallback,
} from 'react';
import {
    Paper, Button, makeStyles, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    usePropValue, inputStateSetterHelper, FontIcon, BaseMyAccountInfoProps,
} from '../../..';
import {
    useModeFormStyle, useModePanelStyle,
} from '../../../style';
import {
    InfoCompPanelHeader,
} from '../compPanelHeader';
import {
    ModeInfoCompTextInputField,
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
    name: 'MyAccountInfo', index: 1,
});



/**
 * This is a DUMB component used for displaying My Account info. This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const MyAccountInfo: React.FC<BaseMyAccountInfoProps> = (props: BaseMyAccountInfoProps) => {
    const [nameInput, setNameInput] = usePropValue<string | undefined>(props.fields.name?.value);
    const [emailInput, setEmailInput] = usePropValue<string | undefined>(props.fields.email?.value);
    const [phoneNumberInput, setPhoneNumberInput] = usePropValue<string | undefined>(props.fields.phoneNumber?.value);
    const [passwordInput, setPasswordInput] = usePropValue<string | undefined>(props.fields.password?.value);
    const [confirmPasswordInput, setConfirmPasswordInput] = usePropValue<string | undefined>(props.fields.confirmPassword?.value);


    /**
     * On input change handler for all the inputs. When an input change, call the onInputChangeHelper and pass it the setter functions
     * for all inputs. The helper function will call the setter function accordingly based on the input name.
     */
    const onInputChange = useCallback((inputName: string, value: any) => {
        inputStateSetterHelper(inputName, value, {
            name           : setNameInput,
            email          : setEmailInput,
            phoneNumber    : setPhoneNumberInput,
            password       : setPasswordInput,
            confirmPassword: setConfirmPasswordInput,
        });
    }, [setNameInput, setPasswordInput, setConfirmPasswordInput, setEmailInput, setPhoneNumberInput]);



    const panelClasses = useModePanelStyle();
    const formClasses = useModeFormStyle();
    const classes = useStyle();


    /**
     * On cancel edit, we need to reverse all the input back to the original values
     */
    const reverseFormInput = useCallback(() => {
        setNameInput(props.fields.name?.value);
        setEmailInput(props.fields.email?.value);
        setPhoneNumberInput(props.fields.phoneNumber?.value);
        setPasswordInput(props.fields.password?.value);
        setConfirmPasswordInput(props.fields.confirmPassword?.value);
    }, [props, setNameInput, setPasswordInput, setConfirmPasswordInput, setEmailInput, setPhoneNumberInput]);


    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (props.actions?.saveUpdate) {
            props.actions.saveUpdate.onClick({
                name           : nameInput?.trim(),
                password       : passwordInput?.trim(),
                confirmPassword: confirmPasswordInput?.trim(),
            });
        }

        return false;
    }, [props, nameInput, passwordInput, confirmPasswordInput]);



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
                    <div className={clsx(formClasses.formInputGroup)}>
                        {props.fields.verified && (
                            <ModeInfoCompTextInputField
                                className={clsx(
                                    `${formClasses.formInputField}`, classes.statusInputField,
                                    props.fields.verified.value ? 'verified' : 'not-verified',
                                )}
                                fieldName="verified"
                                compProps={props}
                                inputProps={props.fields.verified}
                                inputValue={props.fields.verified.displayValue ?? props.fields.verified.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.id && (
                            <ModeInfoCompTextInputField
                                className={clsx(formClasses.formInputField)}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.id}
                                fieldName="id"
                                inputValue={props.fields.id.displayValue ?? props.fields.id.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.name && (
                            <ModeInfoCompTextInputField
                                className={clsx(formClasses.formInputField)}
                                compProps={props}
                                inputProps={props.fields.name}
                                fieldName="name"
                                inputValue={props.fields.name.editable ? nameInput : props.fields.name.displayValue ?? props.fields.name.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.email && (
                            <ModeInfoCompTextInputField
                                className={clsx(formClasses.formInputField)}
                                inputType="email"
                                compProps={props}
                                inputProps={props.fields.email}
                                fieldName="email"
                                inputValue={props.fields.email.editable ? emailInput : props.fields.email.displayValue ?? props.fields.email.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.password && (
                            <ModeInfoCompTextInputField
                                className={clsx(formClasses.formInputField)}
                                inputType="password"
                                compProps={props}
                                inputProps={props.fields.password}
                                fieldName="password"
                                inputValue={props.fields.password.editable
                                    ? passwordInput : props.fields.password.displayValue ?? props.fields.password.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.confirmPassword && (
                            <ModeInfoCompTextInputField
                                className={clsx(formClasses.formInputField)}
                                inputType="password"
                                compProps={props}
                                inputProps={props.fields.confirmPassword}
                                fieldName="confirmPassword"
                                inputValue={props.fields.confirmPassword.editable
                                    ? confirmPasswordInput : props.fields.confirmPassword.displayValue ?? props.fields.confirmPassword.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.phoneNumber && (
                            <ModeInfoCompTextInputField
                                className={clsx(formClasses.formInputField)}
                                inputType="tel"
                                compProps={props}
                                inputProps={props.fields.phoneNumber}
                                fieldName="phoneNumber"
                                inputValue={props.fields.phoneNumber.editable
                                    ? phoneNumberInput : props.fields.phoneNumber.displayValue ?? props.fields.phoneNumber.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.creationTime && (
                            <ModeInfoCompTextInputField
                                className={clsx(formClasses.formInputField)}
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
                                        startIcon={props.actions?.cancelEdit.icon
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
