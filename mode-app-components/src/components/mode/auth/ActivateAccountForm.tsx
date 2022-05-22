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
    useModeFormStyle, ActivateAccountFormInputField, BaseActivateAccountFormProps,
} from '../../..';



/**
 * This component has a banner image and language selector so it will extends the EmailLoginCompPropsBase and add these additional props.
 */
export interface ActivateAccountFormProps extends BaseActivateAccountFormProps {
    readonly languageSelectorComponent?: React.ReactNode | undefined;
}


/**
 * This is a very basic ActivateAccountComp that can be used for adding an Activate User UI.
 */
export const ActivateAccountForm: React.FC<ActivateAccountFormProps> = (props: ActivateAccountFormProps) => {

    const [nameInput, setNameInput] = useState<string | undefined>();
    const [passwordInput, setPasswordInput] = useState<string | undefined>();
    const [confirmPasswordInput, setConfirmPasswordInput] = useState<string | undefined>();


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
                [ActivateAccountFormInputField.NAME]            : nameInput?.trim(),
                [ActivateAccountFormInputField.PASSWORD]        : passwordInput?.trim(),
                [ActivateAccountFormInputField.CONFIRM_PASSWORD]: confirmPasswordInput?.trim(),
            });
        }

        return false;
    }, [props, nameInput, passwordInput, confirmPasswordInput]);



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
                                {props.email}
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
                            <TextField
                                variant="standard"
                                className={clsx(formClasses.formInputField)}
                                type="text"
                                required
                                label={props.texts.nameInputLabel}
                                placeholder={props.texts.nameInputPlaceholder}
                                error={Boolean(props.errorTexts?.name)}
                                helperText={props.errorTexts?.name || props.texts.nameInputHelp || ''}
                                onChange={(event: React.FormEvent) => {
                                    // Update local input value state
                                    setNameInput((event.currentTarget as HTMLInputElement).value);

                                    // Dispatch event to let the container know the input changed
                                    if (props.onFormInputChange) {
                                        props.onFormInputChange(
                                            ActivateAccountFormInputField.NAME,
                                            (event.currentTarget as HTMLInputElement).value,
                                        );
                                    }
                                }}
                            />
                            {props.passwordNotRequired !== true && (
                                <>
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
                                            if (props.onFormInputChange) {
                                                props.onFormInputChange(
                                                    ActivateAccountFormInputField.PASSWORD,
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
                                        label={props.texts.confirmPasswordInputLabel}
                                        placeholder={props.texts.confirmPasswordInputPlaceholder}
                                        error={Boolean(props.errorTexts?.confirmPassword)}
                                        helperText={props.errorTexts?.confirmPassword || props.texts.confirmPasswordInputHelp || ''}
                                        onChange={(event: React.FormEvent) => {
                                            // Update local input value state
                                            setConfirmPasswordInput((event.currentTarget as HTMLInputElement).value);

                                            // Dispatch event to let the container know the input changed
                                            if (props.onFormInputChange) {
                                                props.onFormInputChange(
                                                    ActivateAccountFormInputField.CONFIRM_PASSWORD,
                                                    (event.currentTarget as HTMLInputElement).value,
                                                );
                                            }
                                        }}
                                    />
                                </>
                            )}
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
                                {props.texts.activateButtonLabel}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
