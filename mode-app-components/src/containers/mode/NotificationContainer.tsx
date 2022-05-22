import React, {
    useCallback, useContext,
} from 'react';
import {
    modeUIContext, hideNotification, NotificationTypes, selectNotification,
} from '@moderepo/mode-ui-state';
import {
    NotificationBar, NotifType, TranslateF,
} from '../..';



/**
 * @param type Convert UI State's notification type to ModeNotificationType
 */
const uiStateNotifTypeToModeNotificationType = (type: NotificationTypes): NotifType => {
    if (type === NotificationTypes.SUCCESS) {
        return NotifType.SUCCESS;
    }
    if (type === NotificationTypes.WARNING) {
        return NotifType.WARNING;
    }
    if (type === NotificationTypes.ERROR) {
        return NotifType.ERROR;
    }

    return NotifType.INFO;
};


export interface NotificationContainerProps {
    readonly translate?: TranslateF | undefined;
}

/**
 * This is the wrapper for the NotificationComp. The notification component is a generic component that does not do anything other
 * than display the message. This container will take care of providing the NotificationComp all the data necessary needed to render
 * the notification base on the UI state.
 */
export const NotificationContainer: React.FC<NotificationContainerProps> = (props: NotificationContainerProps) => {

    const { state, dispatch } = useContext(modeUIContext);
    const notification = selectNotification(state);


    const handleClose = useCallback(() => {
        dispatch(hideNotification());
    }, [dispatch]);



    if (notification) {
        return (
            <NotificationBar
                {...notification}
                type={uiStateNotifTypeToModeNotificationType(notification.type)}
                translate={props.translate}
                onClose={handleClose}
            />
        );
    }
    return (
        <></>
    );
};
