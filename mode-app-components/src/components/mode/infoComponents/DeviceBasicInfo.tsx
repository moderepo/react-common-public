import React, {
    useCallback,
} from 'react';
import {
    Paper, Button, makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    usePropValue, inputStateSetterHelper, useModePanelStyle, useModeFormStyle, FontIcon, BaseDeviceInfoProps, BaseEntityField, InfoCompPanelHeader,
} from '../../..';
import {
    ModeInfoCompSelectInputField, ModeInfoCompTextInputField,
} from '../..';



const useStyle = makeStyles(() => {
    return {
        root: {

        },
    };
}, {
    name: 'DeviceBasicInfo', index: 1,
});



export interface DeviceBasicInfoProps extends Omit<BaseDeviceInfoProps, 'fields'> {
    readonly fields: {
        readonly id?: BaseEntityField<number>;
        readonly deviceClass?: BaseEntityField<string>;
        readonly homeId?: BaseEntityField<number>;
        readonly name?: BaseEntityField<string>;
        readonly tag?: BaseEntityField<string>;
        readonly firmware?: BaseEntityField<string>;
        readonly bundleInstalled?: BaseEntityField<string>;
        readonly bundleInstallTime?: BaseEntityField<string>;
        readonly claimTime?: BaseEntityField<string>;

        readonly isConnected?: BaseEntityField<boolean>;
        readonly claimExpirationTime?: BaseEntityField<string>;
        readonly lastConnectTime?: BaseEntityField<string>;
        readonly lastDisconnectTime?: BaseEntityField<string>;
        readonly projectId?: BaseEntityField<number>;
    };
}


/**
 * This is a DUMB component used for displaying basic device info. This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const DeviceBasicInfo: React.FC<DeviceBasicInfoProps> = (props: DeviceBasicInfoProps) => {

    const [deviceClassInput, setDeviceClassInput] = usePropValue<string | undefined>(props.fields.deviceClass?.value);
    const [nameInput, setNameInput] = usePropValue<string | undefined>(props.fields.name?.value);
    const [tagInput, setTagInput] = usePropValue<string | undefined>(props.fields.tag?.value);


    /**
     * On input change handler for all the inputs. When an input change, call the onInputChangeHelper and pass it the setter functions
     * for all inputs. The helper function will call the setter function accordingly based on the input name.
     */
    const onInputChange = useCallback((inputName: string, value: any) => {
        inputStateSetterHelper(inputName, value, {
            deviceClass: setDeviceClassInput,
            name       : setNameInput,
            tag        : setTagInput,
        });
    }, [setDeviceClassInput, setNameInput, setTagInput]);


    const panelClasses = useModePanelStyle();
    const formClasses = useModeFormStyle();
    const classes = useStyle();


    /**
     * On cancel edit, we need to reverse all the input back to the original values
     */
    const reverseFormInput = useCallback(() => {
        setDeviceClassInput(props.fields.deviceClass?.value);
        setNameInput(props.fields.name?.value);
        setTagInput(props.fields.tag?.value);
    }, [props, setDeviceClassInput, setNameInput, setTagInput]);


    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (props.actions?.saveUpdate) {
            props.actions.saveUpdate.onClick({
                deviceClass: deviceClassInput?.trim(),
                name       : nameInput?.trim(),
                tag        : tagInput?.trim(),
            });
        }

        return false;
    }, [props, deviceClassInput, nameInput, tagInput]);



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
                        {props.fields.id && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.id}
                                fieldName="id"
                                inputValue={props.fields.id.displayValue ?? props.fields.id.value}
                                onInputChange={onInputChange}
                            />
                        )}

                        {props.fields.deviceClass && (
                            <>
                                {props.fields.deviceClass.options
                                    ? (
                                        // When the user has to choose a deviceClass
                                        <ModeInfoCompSelectInputField
                                            className={formClasses.formInputField}
                                            compProps={props}
                                            inputProps={props.fields.deviceClass}
                                            fieldName="deviceClass"
                                            inputValue={props.fields.deviceClass.editable
                                                ? deviceClassInput
                                                : props.fields.deviceClass.displayValue ?? props.fields.deviceClass.value}
                                            onInputChange={onInputChange}
                                        />
                                    )
                                    : (
                                        <ModeInfoCompTextInputField
                                            className={formClasses.formInputField}
                                            inputType="string"
                                            compProps={props}
                                            inputProps={props.fields.deviceClass}
                                            fieldName="deviceClass"
                                            inputValue={props.fields.deviceClass.displayValue ?? props.fields.deviceClass.value}
                                            onInputChange={onInputChange}
                                        />
                                    )}
                            </>
                        )}
                        {props.fields.projectId && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.projectId}
                                fieldName="projectId"
                                inputValue={props.fields.projectId.displayValue ?? props.fields.projectId.value}
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
                        {props.fields.name && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.name}
                                fieldName="name"
                                inputValue={props.fields.name.editable ? nameInput : props.fields.name.displayValue ?? props.fields.name.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.tag && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.tag}
                                fieldName="tag"
                                inputValue={props.fields.tag.editable ? tagInput : props.fields.tag.displayValue ?? props.fields.tag.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.isConnected && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.isConnected}
                                fieldName="isConnected"
                                inputValue={props.fields.isConnected.displayValue ?? props.fields.isConnected.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.firmware && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.firmware}
                                fieldName="firmware"
                                inputValue={props.fields.firmware.displayValue ?? props.fields.firmware.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.bundleInstalled && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.bundleInstalled}
                                fieldName="bundleInstalled"
                                inputValue={props.fields.bundleInstalled.displayValue ?? props.fields.bundleInstalled.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.bundleInstallTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.bundleInstallTime}
                                fieldName="bundleInstallTime"
                                inputValue={props.fields.bundleInstallTime.displayValue ?? props.fields.bundleInstallTime.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.claimTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.claimTime}
                                fieldName="claimTime"
                                inputValue={props.fields.claimTime.displayValue ?? props.fields.claimTime.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.claimExpirationTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.claimExpirationTime}
                                fieldName="claimExpirationTime"
                                inputValue={props.fields.claimExpirationTime.displayValue ?? props.fields.claimExpirationTime.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.lastConnectTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.lastConnectTime}
                                fieldName="lastConnectTime"
                                inputValue={props.fields.lastConnectTime.displayValue ?? props.fields.lastConnectTime.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.lastDisconnectTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.lastDisconnectTime}
                                fieldName="lastDisconnectTime"
                                inputValue={props.fields.lastDisconnectTime.displayValue ?? props.fields.lastDisconnectTime.value}
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
