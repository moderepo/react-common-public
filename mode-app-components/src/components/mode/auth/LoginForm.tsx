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
    useModeFormStyle, EmailLoginFormInputField, BaseLoginFormProps,
} from '../../..';
import {
    ExternalLoginProviderInfo,
} from '../../../componentInterfaces';



/**
 * This component has a banner image and language selector so it will extends the LoginCompPropsBase and add these additional props.
 */
export interface LoginFormProps extends BaseLoginFormProps {
    readonly languageSelectorComponent?: React.ReactNode | undefined;
}


/**
 * This is a very basic LoginViewComponent that can be used for adding an Email login UI.
 */
export const LoginForm: React.FC<LoginFormProps> = (props: LoginFormProps) => {

    const [emailInput, setEmailInput] = useState<string | undefined>();
    const [passwordInput, setPasswordInput] = useState<string | undefined>();
    const emailLoginSettings = props.emailLogin;

    const formClasses = useModeFormStyle();
    const classes = useAuthStyle();


    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (props.emailLogin?.onFormSubmit) {
            props.emailLogin.onFormSubmit({
                [EmailLoginFormInputField.EMAIL]   : emailInput?.trim(),
                [EmailLoginFormInputField.PASSWORD]: passwordInput?.trim(),
            });
        }

        return false;
    }, [props, emailInput, passwordInput]);



    return (
        <div className={clsx(classes.root, props.className)}>
            <div className={clsx(classes.authBox, !emailLoginSettings && 'no-form')}>
                <div className={classes.headerContainer}>
                    <div className={classes.languageSelector}>
                        {props.languageSelectorComponent}
                    </div>
                    <div className={clsx(classes.header)}>
                        <div className={clsx(classes.headerText)}>
                            <div className={clsx(classes.headerTitle)}>
                                {props.texts.title}
                            </div>
                            <div className={clsx(classes.headerSubtitle)}>
                                {props.texts.subtitle}
                            </div>
                        </div>
                    </div>

                    {props.externalLogin && props.externalLogin.providers.length > 0 && (
                        <div className={classes.externalLoginContainer}>
                            {props.externalLogin.providers.map((service: ExternalLoginProviderInfo) => {
                                return (
                                    <Button
                                        className={classes.externalLoginServiceAction}
                                        key={service.id}
                                        variant="contained"
                                        startIcon={service.icon}
                                        style={{
                                            // eslint-disable-next-line key-spacing
                                            color: service.labelColor || undefined,
                                            background: service.background || undefined,
                                        }}
                                        onClick={() => {
                                            if (props.externalLogin) {
                                                props.externalLogin.onProviderSelected(service.id);
                                            }
                                        }}
                                    >
                                        <span className={classes.externalLoginServiceActionLabel}>{service.loginButtonLabel}</span>
                                    </Button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {emailLoginSettings && (
                    <div className={clsx(classes.formContainer)}>
                        <form
                            className={clsx(formClasses.root, classes.form, 'single-column')}
                            noValidate
                            autoComplete="on"
                            method="POST"
                            onSubmit={onFormSubmit}
                        >
                            <div className={clsx(formClasses.formInputGroup)}>
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
                                        if (emailLoginSettings.onFormInputChange) {
                                            emailLoginSettings.onFormInputChange(
                                                EmailLoginFormInputField.EMAIL,
                                                (event.currentTarget as HTMLInputElement).value,
                                            );
                                        }
                                    }}
                                />
                                <TextField
                                    variant="standard"
                                    className={clsx(formClasses.formInputField)}
                                    type="password"
                                    required
                                    label={props.texts.passwordInputLabel}
                                    placeholder={props.texts.passwordInputPlaceholder}
                                    error={Boolean(props.errorTexts?.password)}
                                    helperText={props.errorTexts?.password || props.texts.passwordInputHelp || ''}
                                    onChange={(event: React.FormEvent) => {
                                    // Update local input value state
                                        setPasswordInput((event.currentTarget as HTMLInputElement).value);

                                        // Dispatch event to let the container know the input changed
                                        if (emailLoginSettings.onFormInputChange) {
                                            emailLoginSettings.onFormInputChange(
                                                EmailLoginFormInputField.PASSWORD,
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
                                        if (emailLoginSettings.onGotoForgotPassword) {
                                            emailLoginSettings.onGotoForgotPassword();
                                        }
                                    }}
                                >
                                    {props.texts.forgetPasswordButtonLabel}
                                </Button>
                                <Button
                                    className={clsx(formClasses.formActionButton)}
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    {props.texts.loginButtonLabel}
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};
