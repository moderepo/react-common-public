import React, {
    useCallback,
} from 'react';
import {
    Paper, Button, makeStyles, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    usePropValue, inputStateSetterHelper, useModePanelStyle, useModeFormStyle, FontIcon, BaseEntityField, BaseInfoCompActionsSet,
    BaseInfoCompSaveAction,
} from '../../..';
import {
    InfoCompPanelHeader,
} from '../compPanelHeader';
import {
    BaseInfoCompProps,
} from '../../../componentInterfaces';
import {
    ModeInfoCompTextInputField,
} from '../..';



const useStyle = makeStyles((theme: Theme) => {
    return {
        root: {
        },

        setPasswordMessage: {
            color  : theme.palette.error.main,
            padding: theme.spacing(2, 0),
        },
    };
}, {
    name: 'MyAccountPasswordInfo', index: 1,
});



/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface MyAccountPasswordInfoUpdatableInputs {
    readonly currentPassword?: string | undefined;
    readonly newPassword?: string | undefined;
    readonly confirmPassword?: string | undefined;
}


/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface MyAccountPasswordInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<MyAccountPasswordInfoUpdatableInputs>
}



/**
 * This is a Generic Component used for displaying Account Password info which also has an option for user to change password
 */
export interface MyAccountPasswordInfoProps extends BaseInfoCompProps {
    readonly fields: {
        readonly currentPassword?: BaseEntityField<string>;     // OPTIONAL because some user might not have setup password
        readonly newPassword: BaseEntityField<string>;
        readonly confirmPassword: BaseEntityField<string>;
    }

    readonly texts?: {
        readonly setPasswordMessage?: string | undefined;
    }

    readonly actions?: MyAccountPasswordInfoActionsSet | undefined;
}



/**
 * This is a DUMB component used for displaying logged in user account password info. This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const MyAccountPasswordInfo: React.FC<MyAccountPasswordInfoProps> = (
    props: MyAccountPasswordInfoProps,
) => {
    const [currentPasswordInput, setCurrentPasswordInput] = usePropValue<string | undefined>(undefined);
    const [newPasswordInput, setNewPasswordInput] = usePropValue<string | undefined>(undefined);
    const [confirmPasswordInput, setConfirmPasswordInput] = usePropValue<string | undefined>(undefined);


    /**
     * On input change handler for all the inputs. When an input change, call the onInputChangeHelper and pass it the setter functions
     * for all inputs. The helper function will call the setter function accordingly based on the input name.
     */
    const onInputChange = useCallback((inputName: string, value: any) => {
        inputStateSetterHelper(inputName, value, {
            currentPassword: setCurrentPasswordInput,
            newPassword    : setNewPasswordInput,
            confirmPassword: setConfirmPasswordInput,
        });
    }, [setCurrentPasswordInput, setNewPasswordInput, setConfirmPasswordInput]);



    const panelClasses = useModePanelStyle();
    const formClasses = useModeFormStyle();
    const classes = useStyle();


    /**
     * On cancel edit, we need to reverse all the input back to the original values
     */
    const reverseFormInput = useCallback(() => {
        setCurrentPasswordInput(undefined);
        setNewPasswordInput(undefined);
        setConfirmPasswordInput(undefined);
    }, [setCurrentPasswordInput, setNewPasswordInput, setConfirmPasswordInput]);


    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (props.actions?.saveUpdate) {
            props.actions.saveUpdate.onClick({
                currentPassword: currentPasswordInput?.trim(),
                newPassword    : newPasswordInput?.trim(),
                confirmPassword: confirmPasswordInput?.trim(),
            });
        }

        return false;
    }, [props, currentPasswordInput, newPasswordInput, confirmPasswordInput]);



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
                        {props.fields.currentPassword && (
                            <ModeInfoCompTextInputField
                                className={clsx(formClasses.formInputField)}
                                inputType="password"
                                compProps={props}
                                inputProps={props.fields.currentPassword}
                                fieldName="currentPassword"
                                inputValue={props.fields.currentPassword.editable
                                    ? currentPasswordInput : props.fields.currentPassword.displayValue ?? props.fields.currentPassword.value}
                                onInputChange={onInputChange}
                            />
                        )}

                        <ModeInfoCompTextInputField
                            className={clsx(formClasses.formInputField)}
                            inputType="password"
                            compProps={props}
                            inputProps={props.fields.newPassword}
                            fieldName="newPassword"
                            inputValue={props.fields.newPassword.editable
                                ? newPasswordInput : props.fields.newPassword.displayValue ?? props.fields.newPassword.value}
                            onInputChange={onInputChange}
                        />

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
                    </div>

                    {props.texts?.setPasswordMessage && !props.isEditing && (
                        <div className={clsx(classes.setPasswordMessage)}>
                            {props.texts.setPasswordMessage}
                        </div>
                    )}

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
