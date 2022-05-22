import React, {
    useCallback,
} from 'react';
import {
    Paper, Button,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    RobotInfo,
} from '@moderepo/mode-apis';
import {
    usePropValue, inputStateSetterHelper, useModePanelStyle, useModeFormStyle, FontIcon, BaseInfoCompProps, BaseEntityField,
    BaseInfoCompSaveAction, BaseInfoCompActionsSet,
} from '../../../..';
import {
    InfoCompPanelHeader,
} from '../../compPanelHeader';
import {
    ModeInfoCompSelectInputField, ModeInfoCompTextInputField,
} from '../../..';


/**
 * This is the interface of the set of input fields' values that will be passed to the onClick handler when the 'saveUpdate' button is clicked.
 */
export interface RobotInfoUpdatableInputs {
    readonly id?: string | undefined;
    readonly name?: string | undefined;
    readonly robotClass?: string | undefined;
    readonly driverName?: string | undefined;
    readonly robotDefinition?: string | undefined;
}


/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface RobotInfoActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<RobotInfoUpdatableInputs>
}

export interface RCRobotInfoProps extends BaseInfoCompProps {
    readonly robotInfo?: RobotInfo | undefined;

    readonly fields: {
        readonly id: BaseEntityField<string>;
        readonly deviceId?: BaseEntityField<number>;
        readonly homeId?: BaseEntityField<number>;
        readonly name: BaseEntityField<string>;
        readonly robotClass: BaseEntityField<string>;
        readonly driverName: BaseEntityField<string>;
        readonly robotDefinition: BaseEntityField<string>;
        readonly creationTime?: BaseEntityField<string>;
        readonly updatedTime?: BaseEntityField<string>;
    }

    readonly actions?: RobotInfoActionsSet | undefined;
}



/**
 * This is a DUMB component used for displaying Robot info. This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const RCRobotInfo: React.FC<RCRobotInfoProps> = (
    props: RCRobotInfoProps,
) => {
    const [idInput, setIdInput] = usePropValue<string | undefined>(props.fields.id.value);
    const [nameInput, setNameInput] = usePropValue<string | undefined>(props.fields.name.value);
    const [robotClassInput, setRobotClassInput] = usePropValue<string | undefined>(props.fields.robotClass.value);
    const [driverNameInput, setDriverNameInput] = usePropValue<string | undefined>(props.fields.driverName.value);
    const [robotDefinitionInput, setRobotDefinitionInput] = usePropValue<string | undefined>(props.fields.robotDefinition.value);


    /**
     * On input change handler for all the inputs. When an input change, call the onInputChangeHelper and pass it the setter functions
     * for all inputs. The helper function will call the setter function accordingly based on the input name.
     */
    const onInputChange = useCallback((inputName: string, value: any) => {
        inputStateSetterHelper(inputName, value, {
            id             : setIdInput,
            name           : setNameInput,
            robotClass     : setRobotClassInput,
            driverName     : setDriverNameInput,
            robotDefinition: setRobotDefinitionInput,
        });

        // driverName needs to be reselected when robotClass change
        if (inputName === 'robotClass') {
            setDriverNameInput(undefined);
        }
    }, [setIdInput, setNameInput, setRobotClassInput, setRobotDefinitionInput, setDriverNameInput]);



    const panelClasses = useModePanelStyle();
    const formClasses = useModeFormStyle();


    /**
     * On cancel edit, we need to reverse all the input back to the original values
     */
    const reverseFormInput = useCallback(() => {
        setIdInput(props.fields.id.value);
        setNameInput(props.fields.name.value);
        setRobotClassInput(props.fields.robotClass.value);
        setDriverNameInput(props.fields.driverName.value);
        setRobotDefinitionInput(props.fields.robotDefinition.value);
    }, [props, setIdInput, setNameInput, setRobotClassInput, setRobotDefinitionInput, setDriverNameInput]);



    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (props.actions?.saveUpdate) {
            props.actions.saveUpdate.onClick({
                id             : idInput?.trim(),
                name           : nameInput?.trim(),
                robotClass     : robotClassInput?.trim(),
                driverName     : driverNameInput?.trim(),
                robotDefinition: robotDefinitionInput?.trim(),
            });
        }

        return false;
    }, [props, idInput, nameInput, robotClassInput, robotDefinitionInput, driverNameInput]);



    return (
        <Paper
            elevation={2}
            className={clsx(panelClasses.root, props.className, props.showCustomActionOnHover && 'show-custom-action-on-hover')}
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
                                inputValue={props.fields.id.editable
                                    ? idInput
                                    : props.fields.id.displayValue ?? props.fields.id.value}
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
                                inputValue={props.fields.name.editable
                                    ? nameInput
                                    : props.fields.name.displayValue ?? props.fields.name.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.robotClass && (
                            <ModeInfoCompSelectInputField
                                className={formClasses.formInputField}
                                compProps={props}
                                inputProps={props.fields.robotClass}
                                fieldName="robotClass"
                                inputValue={props.fields.robotClass.editable
                                    ? robotClassInput : props.fields.robotClass.displayValue ?? props.fields.robotClass.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.driverName && (
                            <ModeInfoCompSelectInputField
                                className={formClasses.formInputField}
                                compProps={props}
                                inputProps={props.fields.driverName}
                                fieldName="driverName"
                                inputValue={props.fields.driverName.editable
                                    ? driverNameInput : props.fields.driverName.displayValue ?? props.fields.driverName.value}
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
                        {props.fields.deviceId && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.deviceId}
                                fieldName="deviceId"
                                inputValue={props.fields.deviceId.displayValue ?? props.fields.deviceId.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.creationTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.creationTime}
                                fieldName="creationTime"
                                inputValue={props.fields.creationTime.displayValue ?? props.fields.creationTime.value}
                                onInputChange={onInputChange}
                            />
                        )}
                        {props.fields.updatedTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.updatedTime}
                                fieldName="updatedTime"
                                inputValue={props.fields.updatedTime.displayValue ?? props.fields.updatedTime.value}
                                onInputChange={onInputChange}
                            />
                        )}
                    </div>
                    <div className={clsx(formClasses.formInputGroup)}>
                        {props.fields.robotDefinition && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                multiline
                                compProps={props}
                                inputProps={props.fields.robotDefinition}
                                fieldName="robotDefinition"
                                inputValue={props.fields.robotDefinition.editable
                                    ? robotDefinitionInput
                                    : props.fields.robotDefinition.displayValue ?? props.fields.robotDefinition.value}
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
