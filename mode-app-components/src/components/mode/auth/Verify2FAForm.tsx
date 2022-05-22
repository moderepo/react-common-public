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
    useModeFormStyle,
} from '../../..';
import {
    BaseVerify2FAFormProps, BaseVerify2FAFormPropsTexts, Verify2FAFormInputField,
} from '../../../componentInterfaces';



export interface Verify2FACompTextProps extends BaseVerify2FAFormPropsTexts {
    readonly verify2FAMessage: string;
}

export interface Verify2FAFormProps extends BaseVerify2FAFormProps {
    readonly languageSelectorComponent?: React.ReactNode | undefined;
    readonly texts: Verify2FACompTextProps;
}


/**
 * This is a DUMB component used for displaying a 2FA verify code form This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const Verify2FAForm: React.FC<Verify2FAFormProps> = (
    props: Verify2FAFormProps,
) => {

    const [codeInput, setCodeInput] = useState<string | undefined>();


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
                [Verify2FAFormInputField.CODE]: codeInput?.trim(),
            });
        }
        return false;
    }, [props, codeInput]);



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
                                {props.texts.verify2FAMessage}
                            </div>
                            <TextField
                                variant="standard"
                                className={clsx(formClasses.formInputField)}
                                type="number"
                                required
                                label={props.texts.authCodeInputLabel}
                                placeholder={props.texts.authCodeInputPlaceholder}
                                error={Boolean(props.errorTexts?.[Verify2FAFormInputField.CODE])}
                                helperText={props.errorTexts?.[Verify2FAFormInputField.CODE] || props.texts.authCodeInputHelp || ''}
                                onChange={(event: React.FormEvent) => {
                                    // Update local input value state
                                    setCodeInput((event.currentTarget as HTMLInputElement).value);

                                    // Dispatch event to let the container know the input changed
                                    if (props.onFormInputChange) {
                                        props.onFormInputChange(
                                            Verify2FAFormInputField.CODE,
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
                            <div />
                            <Button
                                className={clsx(formClasses.formActionButton)}
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                {props.texts.verifyButtonLabel}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );

};
