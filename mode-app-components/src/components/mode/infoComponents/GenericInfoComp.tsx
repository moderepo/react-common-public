import React, {
    useCallback, useMemo, useState,
} from 'react';
import {
    Paper, Button, makeStyles,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    FontIcon, BaseInfoCompProps, BaseEntityField, BaseEntityFieldArray, BaseInfoCompActionsSet, BaseInfoCompSaveAction,
} from '../../..';
import {
    useModeFormStyle, useModePanelStyle,
} from '../../../style';
import {
    InfoCompPanelHeader,
} from '../compPanelHeader';
import {
    ModeInfoCompTextInputField, ModeInfoCompSelectInputField, ModeInfoCompCheckBoxInputField, FieldInputType, ModeInfoCompAutoCompleteInputField,
} from '../..';



const useStyle = makeStyles(() => {
    return {
        root: {
        },

        form: {
            justifyContent: 'flex-start',
        },
    };
}, {
    name: 'GenericInfoComp', index: 1,
});



/**
 * This component has a custom saveUpdate button's onClick input params therefore we need to extends the BaseInfoCompActionsSet and
 * override the 'saveUpdate' action.
 */
export interface GenericInfoCompActionsSet extends BaseInfoCompActionsSet {
    readonly saveUpdate: BaseInfoCompSaveAction<{
        [fieldName: string]: unknown | undefined;
    }>
}


export interface GenericInfoCompProps extends BaseInfoCompProps {
    readonly fields: {
        readonly [fieldName: string]: BaseEntityField<any> | BaseEntityFieldArray<any> | undefined;
    };
    readonly fieldsGrouping?: readonly (readonly string[])[] | undefined;
    readonly action?: GenericInfoCompActionsSet | undefined;
}


/**
 * This is a DUMB component used for displaying some entity info. This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const GenericInfoComp = <T extends GenericInfoCompProps>(props: GenericInfoCompProps & T) => {

    const [inputValues, setInputValues] = useState<{
        readonly [fieldName: string]: any | undefined;
    }>(
        Object.keys(props.fields).reduce((result: {
            readonly [fieldName: string]: any | undefined;
        }, fieldName) => {
            const value = props.fields[fieldName]?.value;
            return {
                ...result,
                [fieldName]: value,
            };
        }, {
        }),
    );


    /**
     * On input change handler for all the inputs. When an input change, call the onInputChangeHelper and pass it the setter functions
     * for all inputs. The helper function will call the setter function accordingly based on the input name.
     */
    const onInputChange = useCallback((inputName: string, value: any) => {
        setInputValues((currentValues) => {
            return {
                ...currentValues,
                [inputName]: value,
            };
        });
    }, [setInputValues]);



    const panelClasses = useModePanelStyle();
    const formClasses = useModeFormStyle();
    const classes = useStyle();


    /**
     * On cancel edit, we need to reverse all the input back to the original values
     */
    const reverseFormInput = useCallback(() => {
        setInputValues(
            Object.keys(props.fields).reduce((result: {
                readonly [fieldName: string]: any | undefined;
            }, fieldName) => {
                const value = props.fields[fieldName]?.value;
                return {
                    ...result,
                    [fieldName]: value,
                };
            }, {
            }),
        );
    }, [props.fields, setInputValues]);


    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        const castedInputValues = Object.keys(inputValues).reduce((result, fieldName) => {
            const value = inputValues[fieldName];
            const inputField = props.fields[fieldName];

            const getCastedValue = (() => {
                // If the field used TEXT input control and the inputType is 'number' we can assume the value will be number and cast the
                // value to number
                if (value !== undefined && value !== null && inputField) {
                    if ((!inputField.controlType || inputField.controlType === FieldInputType.TEXT) && inputField.inputType === 'number') {
                        return Number(value);
                    }
                    // ASSUME the value of type string will always need to be trimmed
                    if ((!inputField.controlType || inputField.controlType === FieldInputType.TEXT) && typeof value === 'string') {
                        return value.trim();
                    }
                    if (inputField.controlType === FieldInputType.CHECKBOX) {
                        return Boolean(value);
                    }
                }

                // Don't do anything to the value
                return value;
            })();

            return {
                ...result,
                [fieldName]: getCastedValue,
            };
        }, {
        });

        // Because we trim the string inputs before passing to the handler, we will also need to trim all the string inputs
        // and update the inputValues so that the UI will show the trimmed values.
        setInputValues(castedInputValues);

        if (props.actions?.saveUpdate) {
            props.actions.saveUpdate.onClick(castedInputValues);
        }

        return false;
    }, [props, inputValues]);



    const fieldGroups = useMemo(() => {
        if (props.fieldsGrouping && props.fieldsGrouping.length > 0) {
            return props.fieldsGrouping;
        }

        return [Object.keys(props.fields)];
    }, [props.fields, props.fieldsGrouping]);


    return (
        <Paper
            elevation={2}
            className={clsx(panelClasses.root, props.className, classes.root,
                props.showCustomActionOnHover && 'show-custom-action-on-hover')}
        >
            <InfoCompPanelHeader {...props} />
            <div className={clsx(panelClasses.panelContent)}>
                <form
                    className={clsx(formClasses.root, classes.form, props.formProps?.className)}
                    noValidate
                    autoComplete="on"
                    method="POST"
                    onSubmit={onFormSubmit}
                >
                    {fieldGroups.map((group) => {
                        return (
                            <div className={clsx(formClasses.formInputGroup)} key={group.join()}>
                                {group.map((fieldName) => {
                                    const field = props.fields[fieldName];
                                    if (!field) {
                                        return <></>;
                                    }

                                    if (field.controlType === FieldInputType.SELECT && field.options && field.options.length > 0) {
                                        return (
                                            <ModeInfoCompSelectInputField
                                                key={fieldName}
                                                className={clsx(formClasses.formInputField)}
                                                fieldName={fieldName}
                                                compProps={props}
                                                inputProps={field}
                                                inputValue={field.editable ? inputValues[fieldName] : field.displayValue ?? field.value}
                                                onInputChange={field.editable ? onInputChange : undefined}
                                            />
                                        );
                                    }
                                    if (field.controlType === FieldInputType.AUTOCOMPLETE && field.options && field.options.length > 0) {
                                        return (
                                            <ModeInfoCompAutoCompleteInputField
                                                key={fieldName}
                                                className={clsx(formClasses.formInputField)}
                                                fieldName={fieldName}
                                                compProps={props}
                                                inputProps={field}
                                                inputValue={field.editable ? inputValues[fieldName] : field.displayValue ?? field.value}
                                                onInputChange={field.editable ? onInputChange : undefined}
                                            />
                                        );
                                    }
                                    if (field.controlType === FieldInputType.CHECKBOX) {
                                        return (
                                            <ModeInfoCompCheckBoxInputField
                                                key={fieldName}
                                                className={clsx(formClasses.formInputField)}
                                                fieldName={fieldName}
                                                compProps={props}
                                                inputProps={field}
                                                inputValue={Boolean(field.editable ? inputValues[fieldName] : field.displayValue ?? field.value)}
                                                onInputChange={field.editable ? onInputChange : undefined}
                                            />
                                        );
                                    }
                                    return (
                                        <ModeInfoCompTextInputField
                                            key={fieldName}
                                            className={clsx(formClasses.formInputField)}
                                            fieldName={fieldName}
                                            inputType={field.inputType}
                                            multiline={field.multiline}
                                            compProps={props}
                                            inputProps={field}
                                            inputValue={field.editable ? inputValues[fieldName] : field.displayValue ?? field.value}
                                            onInputChange={field.editable ? onInputChange : undefined}
                                        />
                                    );
                                })}
                            </div>
                        );
                    })}

                    {props.isEditing && props.actions && (
                        <div className={clsx(formClasses.formActionContainer)}>
                            <div />
                            <div>
                                {props.actions?.cancelEdit && (
                                    <Button
                                        className={clsx(formClasses.formActionButton)}
                                        size="small"
                                        startIcon={props.actions?.cancelEdit.icon
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
                                        size="small"
                                        type="submit"
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
