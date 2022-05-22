import React, {
    useCallback, useMemo,
} from 'react';
import clsx from 'clsx';
import {
    Snackbar, IconButton, SnackbarContent, makeStyles, Theme,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Report';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import {
    TranslateF,
} from '../..';


const useStyle = makeStyles((theme: Theme) => {
    return {
        content: {
            flexWrap: 'nowrap',
        },
        info: {
            backgroundColor: theme.palette.info.main,
            color          : theme.palette.info.contrastText,
        },
        success: {
            backgroundColor: theme.palette.success.main,
            color          : theme.palette.success.contrastText,
        },
        warning: {
            backgroundColor: theme.palette.warning.main,
            color          : theme.palette.warning.contrastText,
        },
        error: {
            backgroundColor: theme.palette.error.main,
            color          : theme.palette.error.contrastText,
        },
        icon: {
            fontSize: 20,
        },
        iconVariant: {
            opacity    : 0.9,
            marginRight: theme.spacing(1),
        },
        message: {
            display   : 'flex',
            alignItems: 'center',
        },
    };
}, {
    name: 'Notification',
});



/**
 * This is a component in charge of displaying notification using Material UI Snackbar.
 */

export enum NotifType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error'
}


const variantIcon = {
    [NotifType.INFO]   : InfoIcon,
    [NotifType.SUCCESS]: CheckCircleIcon,
    [NotifType.WARNING]: WarningIcon,
    [NotifType.ERROR]  : ErrorIcon,
};

export interface NotificationBarProps {
    readonly type: NotifType;         // The type of message to show
    readonly message?: string | undefined;   // The message string
    readonly messageData?: any;              // The data to be passed to the translation system when translating message if message contains variables
    readonly duration?: number;              // How long to keep the message visible. Default value will be used if not specified.
    readonly translate?: TranslateF | undefined;    // The OPTIONAL function to be used to translate the message
    readonly onClose: ()=> void;
}

export const NotificationBar: React.FC<NotificationBarProps> = (props: NotificationBarProps) => {

    const alertType = props.type;
    const duration = props.duration !== undefined && props.duration > 0 ? props.duration : 5000;
    const Icon = variantIcon[alertType];
    const classes = useStyle();

    /**
     * Translate the values of the title, message, button' data before we pass it to interpolation
     */
    const translatedMessage = useMemo(() => {
        const { translate } = props;
        if (props.message && translate) {
            // if there is 'messageData', translate the messageData' fields first
            const translatedData = props.messageData
                ? Object.entries(props.messageData).reduce((result: any, entry: [string, any]) => {
                    const [key, value]: [string, any] = entry;
                    return {
                        ...result,
                        [key]: (typeof value === 'string') ? translate(value) : value,
                    };
                }, {
                })
                : {
                };

            // Now translate the message and pass the translatedData as interpolation
            return translate(props.message, translatedData);
        }

        // there is no translator, show the message as is if there is one
        return props.message;
    }, [props]);


    const handleClose = useCallback(() => {
        props.onClose();
    }, [props]);

    return (
        <div>
            <Snackbar
                anchorOrigin={{
                    vertical  : 'top',
                    horizontal: 'center',
                }}
                open
                autoHideDuration={duration}
                onClose={handleClose}
            >
                <SnackbarContent
                    className={clsx(classes.content, classes[alertType])}
                    message={(
                        <span id="client-snackbar" className={classes.message}>
                            <Icon className={clsx(classes.icon, classes.iconVariant)} />
                            <span id="message-id">{translatedMessage}</span>
                        </span>
                    )}
                    action={[
                        <IconButton
                            key="close"
                            color="inherit"
                            onClick={handleClose}
                        >
                            <CloseIcon className={classes.icon} />
                        </IconButton>,
                    ]}
                />
            </Snackbar>
        </div>
    );
};
