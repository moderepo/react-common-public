import React, {
    CSSProperties, useMemo,
} from 'react';
import {
    Dialog, DialogContent, DialogActions, Button, DialogTitle, Icon, DialogContentText, TextField, makeStyles, Theme,
} from '@material-ui/core';
import clsx from 'clsx';



/**
 * This is the generic style for all dialog. Each dialog can have its own style file if there
 * are any style not defined here.
 */
export const useGenericDialogStyle = makeStyles((theme: Theme) => {

    return {
        root: {

        },

        dialogTitle: {
            '& h2': {
                display      : 'flex',
                flexDirection: 'row',
            },
        },

        dialogTitleText: {
            flex     : 1,
            wordBreak: 'break-word',
        },

        dialogContent: {
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            flexDirection : 'column',
        },

        dialogActionContainer: {
            marginTop: theme.spacing(1),
        },

        dialogMessage: {
            wordBreak: 'break-word',
        },

        contentIcon: {
            fontSize    : '4em',
            marginBottom: theme.spacing(1),

            '&.info': {
                color: theme.palette.info.main,
            },

            '&.success': {
                color: theme.palette.success.main,
            },

            '&.warning': {
                color: theme.palette.warning.main,
            },

            '&.error': {
                color: theme.palette.error.main,
            },

            '&.confirm': {
                color: theme.palette.info.main,
            },

            '&.input': {
                color: theme.palette.info.main,
            },
        },
    };
}, {
    name: 'GenericDialog',
});



const translateMessage = (
    message: string | undefined, messageData: any | undefined, translator: ((key: string, ...args: any[])=> string) | undefined,
): string | undefined => {
    if (message && translator) {
        // if there is 'titleData', translate the 'titleData' fields first
        const transData = messageData
            ? Object.entries(messageData).reduce((result: any, entry: [string, any]) => {
                const [key, value]: [string, any] = entry;
                return {
                    ...result,
                    [key]: (typeof value === 'string') ? translator(value) : value,
                };
            }, {
            })
            : {
            };

        return translator(message, transData);
    }

    return message;
};


export enum GenericDialogResponseCode {
    NEGATIVE = 0,
    POSITIVE = 1
}

export interface GenericDialogResponse {
    code: GenericDialogResponseCode;
    input?: string;
}

export enum GenericDialogType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    CONFIRM = 'confirm',
    INPUT = 'input'
}


/**
 * type: DialogType - OPTIONAL. The type of dialog to show. This will be used for adding an icon in the dialog.
 * title: string - OPTIONAL. The dialog title
 * titleData: any - OPTIONAL. The interpolation data to be passed to the translation system to translate the title if the title contains variables
 * message: string - OPTIONAL. The center message
 * messageData: any - OPTIONAL. The data for the message if message contains variables
 * positiveButton: string - OPTIONAL. The label to be used for the positive button e.g. 'Yes', 'Ok', 'Sure', 'Delete', etc...
 * positiveButtonData: any - OPTIONAL. The positive button data if the label contains variables
 * negativeButton: string - OPTIONAL. The label to be used for the negative button e.g. 'No', 'Cancel', etc...
 * negativeButtonData: any - OPTIONAL. The negative button data if the label contains variables
 * disableBackdropClick: boolean - OPTIONAL. Disable dialog from closing when user click the backdrop. Default is TRUE unless explicitly set to false
 * disableEscapeKeyDown: boolean - OPTIONAL. Disable dialog from closing when user hit ESC key. Default is FALSE unless explicitly set to true.
 */
export interface GenericDialogOptions {
    readonly className?: string | undefined;
    readonly style?: CSSProperties | undefined;
    readonly type?: GenericDialogType,
    readonly title?: string;
    readonly titleData?: any;
    readonly message?: string;
    readonly messageData?: any;
    readonly input?: {
        readonly type: string;               // Input type 'text', 'password', 'email', 'phone', etc...
        readonly name: string;
        readonly required?: boolean;         // Default is true unless explicitly set to false
        readonly error?: string;
        readonly placeholder?: string;
        readonly defaultValue?: string;
        readonly translationData?: any;
    },
    readonly positiveButton?: string;
    readonly positiveButtonData?: any;
    readonly negativeButton?: string;
    readonly negativeButtonData?: any;
    readonly disableBackdropClick?: boolean;
    readonly disableEscapeKeyDown?: boolean;
}


const iconsByType = {
    [GenericDialogType.INFO]   : 'info',
    [GenericDialogType.SUCCESS]: 'check_circle',
    [GenericDialogType.WARNING]: 'warning',
    [GenericDialogType.ERROR]  : 'report',
    [GenericDialogType.CONFIRM]: 'help',
};


export interface GenericDialogProps {
    readonly translator?: ((key: string, ...args: any[])=> string) | undefined;
    readonly dialogOptions: GenericDialogOptions;
    readonly languageSelectorComponent?: React.ReactNode;
    readonly onClose?: (response?: GenericDialogResponse)=> void;
}


/**
 * This dialog can be used for display alerts of different types, INFO, WARNING, SUCCESS, ERROR, etc...
 * Everything in the dialog are customizable e.g. title, message, and buttons.
 */
export const GenericDialog: React.FC<GenericDialogProps> = (props: GenericDialogProps) => {

    const { dialogOptions } = props;
    const dialogClasses = useGenericDialogStyle();
    const inputRef = React.useRef<HTMLInputElement>();

    /**
     * Translate the values of the title, message, button' data before we pass it to interpolation
     *
     */
    const { dialogTitle, dialogMessage, inputName, inputError, inputPlaceholder, positiveButton, negativeButton } = useMemo(() => {
        const translatedMessages = {
            dialogTitle     : translateMessage(dialogOptions?.title, dialogOptions?.titleData, props.translator),
            dialogMessage   : translateMessage(dialogOptions?.message, dialogOptions?.messageData, props.translator),
            inputName       : translateMessage(dialogOptions?.input?.name, dialogOptions?.input?.translationData, props.translator),
            inputError      : translateMessage(dialogOptions?.input?.error, dialogOptions?.input?.translationData, props.translator),
            inputPlaceholder: translateMessage(dialogOptions?.input?.placeholder, dialogOptions?.input?.translationData, props.translator),
            positiveButton  : translateMessage(dialogOptions?.positiveButton, dialogOptions?.positiveButtonData, props.translator),
            negativeButton  : translateMessage(dialogOptions?.negativeButton, dialogOptions?.negativeButtonData, props.translator),
        };

        return translatedMessages;
    }, [dialogOptions, props.translator]);



    const handleClose = (response?: GenericDialogResponse) => {
        if (props.onClose) {
            props.onClose(response);
        }
    };



    const onPositiveButtonClicked = () => {
        if (dialogOptions && dialogOptions.type === GenericDialogType.INPUT) {
            const value = (inputRef.current as HTMLInputElement).value.trim();
            handleClose({
                code : GenericDialogResponseCode.POSITIVE,
                input: value,
            });
        } else {
            handleClose({
                code: GenericDialogResponseCode.POSITIVE,
            });
        }
    };


    const onNegativeButtonClicked = () => {
        handleClose({
            code: GenericDialogResponseCode.NEGATIVE,
        });
    };


    return (
        <Dialog
            PaperProps={{
                className: dialogOptions.className,
                style    : dialogOptions.style,
            }}
            fullWidth
            disableEscapeKeyDown={dialogOptions ? dialogOptions.disableEscapeKeyDown : false}
            open={dialogOptions !== undefined}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick' || (dialogOptions && dialogOptions.disableBackdropClick === false)) {
                    handleClose();
                }
            }}
        >
            <DialogTitle className={dialogClasses.dialogTitle}>
                <div className={dialogClasses.dialogTitleText}>
                    {dialogTitle}
                </div>
                {props.languageSelectorComponent}
            </DialogTitle>

            {dialogOptions && dialogOptions.message
            && (
                <DialogContent
                    className={dialogClasses.dialogContent}
                >
                    {
                        dialogOptions && dialogOptions.type && iconsByType[dialogOptions.type]
                        && <Icon className={clsx(dialogClasses.contentIcon, dialogOptions.type)}>{iconsByType[dialogOptions.type]}</Icon>
                    }
                    <DialogContentText className={dialogClasses.dialogMessage}>
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
            )}

            {dialogOptions && dialogOptions.type === GenericDialogType.INPUT && dialogOptions.input
            && (
                <DialogContent
                    className={dialogClasses.dialogContent}
                >
                    <TextField
                        variant="standard"
                        type={dialogOptions.input.type}
                        required={dialogOptions.input.required !== false}
                        fullWidth
                        autoFocus
                        label={inputName}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            ref        : inputRef,
                            placeholder: inputPlaceholder,
                        }}
                        error={Boolean(dialogOptions.input.error)}
                        helperText={inputError}
                        defaultValue={dialogOptions.input.defaultValue}
                        onKeyPress={(event: React.KeyboardEvent) => {
                            if (event.key === 'Enter') {
                                onPositiveButtonClicked();
                            }
                        }}
                    />
                </DialogContent>
            ) }

            {dialogOptions && (dialogOptions.negativeButton || dialogOptions.positiveButton)
                && (
                    <DialogActions>
                        {dialogOptions.negativeButton
                            && (
                                <Button
                                    onClick={onNegativeButtonClicked}
                                >
                                    {negativeButton}
                                </Button>
                            )}
                        {dialogOptions.positiveButton
                        && (
                            <Button
                                type="submit"
                                variant="contained"
                                onClick={onPositiveButtonClicked}
                                color="primary"
                                autoFocus={dialogOptions.type !== GenericDialogType.INPUT}
                            >
                                {positiveButton}
                            </Button>
                        )}
                    </DialogActions>
                )}
        </Dialog>
    );
};
