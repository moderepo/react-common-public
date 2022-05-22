import React, {
    useContext, useMemo,
} from 'react';
import {
    DialogResponseCode, DialogType, modeUIContext, hideDialog, selectDialogOptions,
} from '@moderepo/mode-ui-state';
import {
    GenericDialog, GenericDialogOptions, GenericDialogResponse, GenericDialogResponseCode, GenericDialogType,
} from '../..';


/**
 * Convert Flux UI state's dialog type to GenericDialogType
 * @param type
 */
const modeDialogTypeToFluxDialogType = (type: DialogType | undefined): GenericDialogType => {
    if (type === DialogType.CONFIRM) {
        return GenericDialogType.CONFIRM;
    }
    if (type === DialogType.INPUT) {
        return GenericDialogType.INPUT;
    }
    if (type === DialogType.SUCCESS) {
        return GenericDialogType.SUCCESS;
    }
    if (type === DialogType.WARNING) {
        return GenericDialogType.WARNING;
    }
    if (type === DialogType.ERROR) {
        return GenericDialogType.ERROR;
    }
    return GenericDialogType.INFO;
};


/**
 * Convert ModeDialogResponseCode to Flux UI State's dialog code
 * @param code
 */
const modeDialogCodeToFluxDialogCode = (code: GenericDialogResponseCode): DialogResponseCode => {
    if (code === GenericDialogResponseCode.NEGATIVE) {
        return DialogResponseCode.NEGATIVE;
    }
    return DialogResponseCode.POSITIVE;
};


export interface GenericDialogContainerProps {
    readonly translator?: ((key: string, ...args: any[])=> string) | undefined;
    readonly languageSelectorComponent?: React.ReactNode;
}


export const GenericDialogContainer: React.FC<GenericDialogContainerProps> = (
    { languageSelectorComponent, translator }: GenericDialogContainerProps,
) => {

    const { state, dispatch } = useContext(modeUIContext);


    // Get the dialogOptions from the UI State
    const uiStateDialogOptions = selectDialogOptions(state);

    // Convert the UI State's dialog option structure to ModeDialogOptions structure
    const modeDialogOptions = useMemo((): GenericDialogOptions | undefined => {
        if (uiStateDialogOptions) {
            return {
                ...uiStateDialogOptions,    // First, copy all the props from uiStateDialogOptions
                type: modeDialogTypeToFluxDialogType(uiStateDialogOptions.type),   // then replace "type" because they are different types
            };
        }
        return undefined;
    }, [uiStateDialogOptions]);



    const handleClose = (response?: GenericDialogResponse) => {
        dispatch(hideDialog());
        if (uiStateDialogOptions?.onClose) {
            // if there is a response, convert the response from ModeDialogResponse to UI State DialogResponse
            uiStateDialogOptions.onClose(response
                ? {
                    ...response,                                                    // copy the response
                    code: modeDialogCodeToFluxDialogCode(response.code),            // replace the response's code because they are different types
                }
                : undefined);
        }
    };


    if (modeDialogOptions) {
        return (
            <GenericDialog
                dialogOptions={modeDialogOptions}
                languageSelectorComponent={languageSelectorComponent}
                translator={translator}
                onClose={handleClose}
            />
        );
    }

    return (<></>);
};
