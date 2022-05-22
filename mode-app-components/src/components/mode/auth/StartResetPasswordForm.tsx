import React, {
    useCallback, useState,
} from 'react';
import {
    Button, TextField,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    useAuthStyle,
} from './authStyle';
import {
    useModeFormStyle, StartResetPasswordFormInputField, BaseStartResetPasswordFormProps,
    BaseStartResetPasswordFormTexts,
} from '../../..';



export interface StartResetPasswordCompTextProps extends BaseStartResetPasswordFormTexts {
    readonly resetPasswordMessage: string;
}

export interface StartResetPasswordFormProps extends BaseStartResetPasswordFormProps {
    readonly languageSelectorComponent?: React.ReactNode | undefined;
    readonly texts: StartResetPasswordCompTextProps;
}


/**
 * This is a DUMB component used for displaying log in form for END USER. This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const StartResetPasswordForm: React.FC<StartResetPasswordFormProps> = (
    props: StartResetPasswordFormProps,
) => {

    const [emailInput, setEmailInput] = useState<string | undefined>();


    const formClasses = useModeFormStyle();
    const classes = useAuthStyle();


    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (props.onFormSubmit) {
            props.onFormSubmit({
                [StartResetPasswordFormInputField.EMAIL]: emailInput?.trim(),
            });
        }
        return false;
    }, [props, emailInput]);



    return (
        <div className={clsx(classes.root, props.className)}>
            <div className={clsx(classes.authBox)}>
                <div className={classes.headerContainer}>
                    <div className={clsx(classes.header)}>
                        <div className={clsx(classes.headerText)}>
                            <div className={clsx(classes.headerTitle)}>
                                {props.texts.title}
                            </div>
                            <div className={clsx(classes.headerSubtitle)}>
                                {props.texts.subtitle}
                            </div>
                        </div>
                        <div className={classes.languageSelector}>
                            {props.languageSelectorComponent}
                        </div>
                    </div>
                </div>

                <div className={clsx(classes.formContainer)}>
                    <form
                        className={clsx(formClasses.root, classes.form, 'single-column')}
                        noValidate
                        autoComplete="on"
                        method="POST"
                        onSubmit={onFormSubmit}
                    >
                        <div className={clsx(formClasses.formInputGroup)}>
                            <div className={clsx(classes.formMessage)}>
                                {props.texts.resetPasswordMessage}
                            </div>
                            <TextField
                                variant="standard"
                                className={clsx(formClasses.formInputField)}
                                type="email"
                                required
                                label={props.texts.emailInputLabel}
                                placeholder={props.texts.emailInputPlaceholder}
                                error={Boolean(props.errorTexts?.email)}
                                helperText={props.errorTexts?.email || props.texts.emailInputHelp || ''}
                                onChange={(event: React.FormEvent) => {
                                    // Update local input value state
                                    setEmailInput((event.currentTarget as HTMLInputElement).value);

                                    // Dispatch event to let the container know the input changed
                                    if (props.onFormInputChange) {
                                        props.onFormInputChange(
                                            StartResetPasswordFormInputField.EMAIL,
                                            (event.currentTarget as HTMLInputElement).value,
                                        );
                                    }
                                }}
                            />
                        </div>

                        {props.errorTexts?.otherError && (
                            <div className={clsx(formClasses.formError)}>
                                {props.errorTexts.otherError}
                            </div>
                        )}

                        <div className={clsx(formClasses.formActionContainer)}>
                            <Button
                                className={clsx(classes.formActionLink)}
                                color="primary"
                                onClick={() => {
                                    if (props.onGotoLogin) {
                                        props.onGotoLogin();
                                    }
                                }}
                            >
                                {props.texts.loginButtonLabel}
                            </Button>
                            <Button
                                className={clsx(formClasses.formActionButton)}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                {props.texts.resetPasswordButtonLabel}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

};
