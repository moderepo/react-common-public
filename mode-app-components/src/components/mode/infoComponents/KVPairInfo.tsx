import React, {
    useCallback, useState,
} from 'react';
import {
    Paper, Button, makeStyles, FormControl, InputLabel, FormHelperText, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    usePropValue, inputStateSetterHelper, useModePanelStyle, useModeFormStyle, FontIcon, BaseKVPairInfoProps,
} from '../../..';
import {
    BaseCompAction, BaseKVPairInfoActionsSet,
} from '../../../componentInterfaces';
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

        valueInputField: {

            '& textarea': {
                minHeight   : 250,
                fontFamily  : 'monospace',
                padding     : theme.spacing(1),
                margin      : theme.spacing(3, 0, 1, 0),
                outline     : 'none',
                resize      : 'vertical',
                whiteSpace  : 'pre',
                borderRadius: '4px',
                border      : `1px solid ${theme.palette.divider}`,
                color       : theme.palette.text.primary,
                background  : 'none',
                '&&'        : {
                    '&:not(:last-child)': {
                        marginBottom: theme.spacing(1),
                    },
                },
            },
        },
    };
}, {
    name: 'KVPairInfo', index: 1,
});


/**
 * This KVPairInfo component will also have a button call 'formatJson' therefore it will extends the BaseKVPairInfoActionsSet and add the
 * formatJson action.
 * NOTE: This component will handle formatting the 'value'. The container does not need to do anything.
 */
export interface KVPairInfoActionsSet extends BaseKVPairInfoActionsSet {
    readonly formatJson?: BaseCompAction;
}


/**
 * This KVPairInfo component will need to BaseKVPairInfoProps and override the 'actions' set.
 */
export interface KVPairInfoProps extends BaseKVPairInfoProps {
    readonly actions?: KVPairInfoActionsSet | undefined;
}


/**
 * This is a DUMB component used for displaying KV store info. This component does not have any logic. All it does it display
 * data based on the props provided by the container. All action done in this component will be dispatched back to the
 * container's handler.
 */
export const KVPairInfo: React.FC<KVPairInfoProps> = (props: KVPairInfoProps) => {
    const [keyInput, setKeyInput] = usePropValue<string | undefined>(props.fields.key?.value);
    const [valueInput, setValueInput] = usePropValue<string | undefined>(props.fields.value?.value);
    const [jsonError, setJsonError] = useState<string | undefined>();


    /**
     * On input change handler for all the inputs. When an input change, call the onInputChangeHelper and pass it the setter functions
     * for all inputs. The helper function will call the setter function accordingly based on the input name.
     */
    const onInputChange = useCallback((inputName: string, value: any) => {
        inputStateSetterHelper(inputName, value, {
            key  : setKeyInput,
            value: setValueInput,
        });
    }, [setKeyInput, setValueInput]);



    const panelClasses = useModePanelStyle();
    const formClasses = useModeFormStyle();
    const classes = useStyle();


    /**
     * On cancel edit, we need to reverse all the input back to the original values
     */
    const reverseFormInput = useCallback(() => {
        setKeyInput(props.fields.key?.value);
        setValueInput(props.fields.value?.value);
    }, [props, setKeyInput, setValueInput]);


    /**
     * On form submit. Collect the values for all input and pass it back to the container
     */
    const onFormSubmit = useCallback(async (event: React.FormEvent) => {
        event.stopPropagation();
        event.preventDefault();

        if (props.actions?.saveUpdate) {
            props.actions.saveUpdate.onClick({
                key  : keyInput?.trim(),
                value: valueInput?.trim(),
            });
        }

        return false;
    }, [props, keyInput, valueInput]);


    /**
     * Try to convert the input value into a JSON object and reformat it. Show error if value is an invalid JSON
     */
    const onFormatJSON = useCallback(() => {
        if (valueInput) {
            try {
                const formattedValue = JSON.stringify(JSON.parse(valueInput), null, 4);
                setValueInput(formattedValue);
                setJsonError(undefined);
            } catch (error) {
                setJsonError((error as Error).message);
            }
        }
    }, [valueInput, setValueInput, setJsonError]);


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
                    <div className={formClasses.formInputGroup}>
                        {props.fields.key && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.key}
                                fieldName="key"
                                inputValue={props.fields.key.editable ? keyInput : props.fields.key.displayValue ?? props.fields.key.value}
                                onInputChange={onInputChange}
                            />
                        )}

                        {props.fields.value && (
                            <FormControl
                                className={clsx(formClasses.formInputField, classes.valueInputField)}
                                variant={props.fields.value.variant || 'standard'}
                                error={Boolean(props.fields.value.error || jsonError)}
                            >
                                <InputLabel
                                    shrink
                                    className={props.fields.value.editable ? 'editable-label-icon' : ''}
                                >{props.fields.value.label}
                                </InputLabel>
                                <textarea
                                    readOnly={!props.isEditing}
                                    value={props.fields.value.editable ? valueInput : props.fields.value.displayValue || props.fields.value.value}
                                    onChange={(event: React.FormEvent) => {
                                        if (props.fields.value?.editable) {
                                            if (props.onFormInputChange) {
                                                props.onFormInputChange('value', (event.currentTarget as HTMLInputElement).value);
                                            }
                                            onInputChange('value', (event.currentTarget as HTMLInputElement).value);
                                        }
                                    }}

                                    onClick={() => {
                                        // If field is editable and we are not in editing mode, fire input clicked even to let the container know
                                        if (props.fields.value && (props.fields.value.editable || props.fields.value.clickable)
                                            && props.onFieldClicked && !props.isEditing) {
                                            props.onFieldClicked('value');
                                        }
                                    }}
                                />

                                {props.fields.value.error && (
                                    <FormHelperText id="component-helper-text"> {props.fields.value.error}</FormHelperText>
                                )}

                                {jsonError && (
                                    <FormHelperText id="component-helper-text"> {jsonError}</FormHelperText>
                                )}
                            </FormControl>
                        )}
                        {props.fields.modificationTime && (
                            <ModeInfoCompTextInputField
                                className={formClasses.formInputField}
                                inputType="text"
                                compProps={props}
                                inputProps={props.fields.modificationTime}
                                fieldName="modificationTime"
                                inputValue={props.fields.modificationTime.displayValue ?? props.fields.modificationTime.value}
                                onInputChange={onInputChange}
                            />
                        )}

                    </div>
                    {props.isEditing && props.actions && (
                        <div className={clsx(formClasses.formActionContainer)}>
                            <div />
                            <div>
                                {props.actions?.formatJson && (
                                    <Button
                                        className={clsx(formClasses.formActionButton)}
                                        color="primary"
                                        size="small"
                                        startIcon={props.actions.formatJson.icon
                                            ? <FontIcon iconName={props.actions.formatJson.icon} />
                                            : undefined}
                                        onClick={() => {
                                            onFormatJSON();
                                            if (props.actions?.formatJson) {
                                                props.actions.formatJson.onClick();
                                            }
                                        }}
                                    >
                                        {props.actions.formatJson.label}
                                    </Button>
                                )}
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
