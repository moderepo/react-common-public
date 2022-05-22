import React, {
    useCallback,
} from 'react';
import {
    Paper, Button, makeStyles, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    usePropValue, inputStateSetterHelper, GenericStatusIndicator, useModePanelStyle, useModeFormStyle, FontIcon, BaseDeviceInfoProps, BaseEntityField,
    BaseInfoCompActionsSet, BaseInfoCompSaveAction,
} from '../../..';
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

        statusContainer: {
            marginBottom  : theme.spacing(2),
            display       : 'flex',
            alignItems    : 'center',
            flexDirection : 'row',
            justifyContent: 'space-between',
            width         : '100%',
            fontWeight    : 500,
        },

    };
}, {
    name: 'DeviceDevInfo', index: 1,
});


/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface DeviceDevInfoUpdatableInputs {
    readonly claimCode?: string | undefined;
}


/**
 * This DeviceDevInfo component will have a custom saveUpdate action and an additional action 'download config' therefore it will define a new
 * ActionsSet that extends BaseInfoCompActionsSet
 */
export interface DeviceDevInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<DeviceDevInfoUpdatableInputs>
}


/**
 * Because we are going to break the DeviceInfoComp into 2 components, Basic and Dev info components, we will create a new interface for this
 * component which extends BaseDeviceInfoCompProps and replace the 'fields' set with a smaller set of fields. And we will also need to
 * override the save action since this component will not have the same saveable fields.
 */
export interface DeviceDevInfoProps extends Omit<BaseDeviceInfoProps, 'fields'> {
    readonly fields: {
        readonly isConnected: BaseEntityField<boolean>;
        readonly connectedTime: BaseEntityField<string>;
        readonly homeId: BaseEntityField<number>;
        readonly claimCode: BaseEntityField<string>;
        readonly apiKey: BaseEntityField<string>;
    }

    readonly actions?: DeviceDevInfoActionsSet;
}



/**
 * This is a DUMB component used for displaying device's connectivity info. This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const DeviceDevInfo: React.FC<DeviceDevInfoProps> = (props: DeviceDevInfoProps) => {
    const [claimCodeInput, setClaimCodeInput] = usePropValue<string | undefined>(props.fields.claimCode.value);

    /**
     * On input change handler for all the inputs. When an input change, call the onInputChangeHelper and pass it the setter functions
     * for all inputs. The helper function will call the setter function accordingly based on the input name.
     */
    const onInputChange = useCallback((inputName: string, value: any) => {
        inputStateSetterHelper(inputName, value, {
            claimCode: setClaimCodeInput,
        });
    }, [setClaimCodeInput]);


    const panelClasses = useModePanelStyle();
    const formClasses = useModeFormStyle();
    const classes = useStyle();


    /**
     * On cancel edit, we need to reverse all the input back to the original values
     */
    const reverseFormInput = useCallback(() => {
        setClaimCodeInput(props.fields.claimCode.value);
    }, [props, setClaimCodeInput]);


    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (props.actions?.saveUpdate) {
            props.actions.saveUpdate.onClick({
                claimCode: claimCodeInput?.trim(),
            });
        }

        return false;
    }, [props, claimCodeInput]);


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
                        {!props.isEditing && !props.fields.isConnected.hidden && (
                            <div className={clsx(classes.statusContainer)}>
                                <div>{props.fields.isConnected.label}</div>
                                <GenericStatusIndicator
                                    label={props.fields.isConnected.displayValue}
                                    status={Boolean(props.fields.isConnected.value)}
                                />
                            </div>
                        )}
                        {props.fields.connectedTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.connectedTime}
                                fieldName="connectedTime"
                                inputValue={props.fields.connectedTime.displayValue ?? props.fields.connectedTime.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.homeId && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.homeId}
                                fieldName="homeId"
                                inputValue={props.fields.homeId.displayValue ?? props.fields.homeId.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.claimCode && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.claimCode}
                                fieldName="claimCode"
                                inputValue={props.fields.claimCode.editable
                                    ? claimCodeInput : props.fields.claimCode.displayValue || props.fields.claimCode.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.apiKey && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.apiKey}
                                fieldName="apiKey"
                                multiline
                                inputValue={props.fields.apiKey.displayValue ?? props.fields.apiKey.value}
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
