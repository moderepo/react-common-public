import React, {
    useState, useEffect, useMemo, useCallback, HTMLInputTypeAttribute, Dispatch, SetStateAction,
} from 'react';
import {
    TableCell, Button, Icon, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, FormControlLabel, Checkbox, FormLabel,
    FormGroup, IconButton, TextFieldProps, InputAdornment, useTheme, makeStyles, Theme, Divider,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    Autocomplete, createFilterOptions,
} from '@material-ui/lab';
import {
    SortOrder,
} from '@moderepo/mode-apis';
import {
    BaseInfoCompProps, BaseEntityField, SelectInputOption, BaseListCompField, BaseListCompFieldsSet, BaseListCompFieldsSettings,
    SELECT_INPUT_OPTION_DIVIDER_TYPE, SELECT_INPUT_OPTION_DIVIDER,
} from '..';
import {
    BaseListCompDataItem, isSelectInputOption,
} from '../componentInterfaces';
import {
    FontIcon,
} from './mode';



export enum FieldInputType {
    TEXT = 'text',
    TEXT_AREA = 'textArea',
    SELECT = 'select',
    AUTOCOMPLETE = 'autocomplete',
    CHECKBOX = 'checkbox',
}


export const isInputFieldHidden = (
    hidden: boolean | undefined,
    hideOnEdit: boolean | undefined,
    editable: boolean | undefined,
    editingModeOnly: boolean | undefined,
    isEditing: boolean | undefined,
) => {
    if (hidden) return true;
    if (editingModeOnly && !isEditing) return true;
    if ((!editable || hideOnEdit === true) && isEditing) return true;
    return false;
};


/**
 * Custom hook use for updating local state when a value from component's props changed.
 */
export const usePropValue = <T extends unknown>(propValue: T): [T, Dispatch<SetStateAction<T>>] => {
    const [value, setValue] = useState<T>(propValue);

    useEffect(() => {
        setValue(propValue);
    }, [propValue, setValue]);

    return [value, setValue];
};


export enum ReadonlyInputStyle {
    FADE = 'fade',
    BLUR = 'blur',
    FADE_AND_BLUR = 'fade blur',        // default
    LOCK = 'lock',
    NONE = ''
}

export const DEFAULT_READONLY_INPUT_STYLE = ReadonlyInputStyle.FADE_AND_BLUR;


export interface ModeBaseInputFieldProps {
    readonly fieldName: string;
    readonly className?: string | undefined;
    readonly description?: string | undefined;
    readonly label?: string | undefined;
    readonly isInEditMode?: boolean | undefined;
    readonly hidden?: boolean | undefined;
    readonly editingModeOnly?: boolean | undefined;
    readonly editable?: boolean | undefined;
    // The style to apply to the input if it is not editable. The default is FADE_AND_BLUR
    readonly readonlyStyle?: ReadonlyInputStyle |undefined;
    readonly hideEditableIcon?: boolean | undefined;
    readonly hideOnEdit?: boolean | undefined;
    readonly clickable?: boolean | undefined;
    readonly required?: boolean | undefined;
    readonly value?: unknown | undefined;
    readonly error?: string | undefined;
    readonly variant?: TextFieldProps['variant'] | undefined;
    readonly onInputChange?: ((fieldName: string, value: any)=> void) | undefined;
    readonly onFormInputChange?: ((fieldName: string, value: any)=> void) | undefined;
    readonly onFieldClicked?: ((fieldName: string)=> void) | undefined;
}


export interface ModeTextInputFieldProps extends ModeBaseInputFieldProps {
    readonly inputType?: HTMLInputTypeAttribute | undefined;
    readonly placeholder?: string | undefined;
    readonly multiline?: boolean | undefined;
    readonly value?: any | undefined;
}


/**
 * ModeTextInputField is a wrapper of an Input Field that comes with Mode's style and functionalities built-in. In most of the form
 * in Mode app, we can reuse this component instead of implementing this logic for each input field.
 */
export const ModeTextInputField: React.FC<ModeTextInputFieldProps> = (props: ModeTextInputFieldProps) => {
    
    const hideInput = useMemo(() => {
        if (props.hidden) return true;
        if (props.editingModeOnly && !props.isInEditMode) return true;
        if (props.isInEditMode && !props.editable && props.hideOnEdit === true) return true;
        return false;
    }, [props.isInEditMode, props.editable, props.hideOnEdit, props.hidden, props.editingModeOnly]);

    const inputLabelProps = useMemo(() => {
        return {
            shrink   : true,
            className: props.editable && !props.hideEditableIcon ? 'editable-label-icon' : `readonly-label-icon ${props.readonlyStyle}`,
        };
    }, [props.editable, props.hideEditableIcon, props.readonlyStyle]);

    const inputProps = useMemo(() => {
        return {
            className : clsx('input-wrapper', props.multiline && 'multiline'),
            inputProps: props.editable
                ? {
                    placeholder: props.placeholder,
                    readOnly   : !props.isInEditMode,
                }
                : {
                    readOnly: true,
                    tabIndex: -1,
                },
        };
    }, [props.editable, props.placeholder, props.multiline, props.isInEditMode]);

    const className = useMemo(() => {
        return clsx(props.className, hideInput && 'hidden',
            !props.editable ? 'readonly' : '',
            !props.isInEditMode && props.clickable && 'clickable',
            props.isInEditMode && !props.editable && (props.readonlyStyle ?? DEFAULT_READONLY_INPUT_STYLE));
    }, [props.className, props.editable, props.isInEditMode, props.clickable, props.readonlyStyle, hideInput]);

    const onInputChangeHandler = props.onInputChange;
    const onFormInputChangeHandler = props.onFormInputChange;
    const onChange = useCallback((event: React.FormEvent) => {
        if (props.editable) {
            // The handler to monitor the input change just for this specific input
            if (onInputChangeHandler) {
                onInputChangeHandler(props.fieldName, (event.currentTarget as HTMLInputElement).value);
            }
            // The handler created by the container that monitor the input change for all inputs in the form
            if (onFormInputChangeHandler) {
                onFormInputChangeHandler(props.fieldName, (event.currentTarget as HTMLInputElement).value);
            }
        }
    }, [props.editable, onFormInputChangeHandler, onInputChangeHandler, props.fieldName]);

    const onClickHandler = props.onFieldClicked;
    const onClick = useCallback(() => {
        // If field is editable and we are not in editing mode, fire input clicked even to let the container know
        if ((props.editable || props.clickable) && onClickHandler && !props.isInEditMode) {
            onClickHandler(props.fieldName);
        }
    }, [props.editable, props.clickable, onClickHandler, props.isInEditMode, props.fieldName]);

    return (
        <TextField
            variant={props.variant ?? 'standard'}
            className={className}
            type={props.inputType}
            label={props.label}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
            required={props.isInEditMode && props.required}
            error={Boolean(props.editable && props.error)}
            helperText={props.editable ? props.error || props.description : undefined}
            multiline={props.multiline}
            value={props.value ?? ''}
            onChange={onChange}
            onClick={onClick}
        />
    );
};



/**
 * A wrapper for ModeTextInputField used for InfoComp. If we have an InfoComponent then we should use this ModeInfoCompTextInputField
 * instead of ModeTextInputField directly. This will help getting the props from compProps and inputProps and pass them to the
 * ModeTextInputField. This wrapper help reduce the number of props we have to specify. However, we can always use the ModeTextInputField
 * directly.
 */
export interface ModeInfoCompTextInputFieldProps {
    readonly fieldName: string;
    readonly className?: string | undefined;
    readonly inputType?: React.HTMLInputTypeAttribute | undefined;
    readonly compProps: Pick<BaseInfoCompProps, 'isEditing' | 'onFormInputChange' | 'onFieldClicked' >;
    readonly inputProps: BaseEntityField<any> | undefined;
    readonly inputValue: any | undefined;
    readonly multiline?: boolean | undefined;
    readonly onInputChange?: ((fieldName: string, value: string | number | undefined)=> void) | undefined;
}
export const ModeInfoCompTextInputField: React.FC<ModeInfoCompTextInputFieldProps> = (props: ModeInfoCompTextInputFieldProps) => {

    if (props.inputProps === undefined) {
        return <></>;
    }
    return (
        <ModeTextInputField
            className={props.className}
            fieldName={props.fieldName}
            inputType={props.inputType}
            value={props.inputValue}
            onInputChange={props.onInputChange}
            multiline={props.multiline}
            isInEditMode={props.compProps.isEditing}
            onFormInputChange={props.compProps.onFormInputChange}
            onFieldClicked={props.compProps.onFieldClicked}
            editable={props.inputProps.editable}
            label={props.inputProps.label}
            hidden={props.inputProps.hidden}
            hideOnEdit={props.inputProps.hideOnEdit}
            editingModeOnly={props.inputProps.editingModeOnly}
            placeholder={props.inputProps.placeholder}
            required={props.inputProps.required}
            variant={props.inputProps.variant}
            error={props.inputProps.error}
            description={props.inputProps.description}
            clickable={props.inputProps.clickable}
        />
    );
};



export interface ModeTextAreaInputFieldProps extends ModeBaseInputFieldProps {
    readonly placeholder?: string | undefined;
    readonly rows?: number | undefined;
    readonly value?: string | undefined;
}


/**
 * ModeTextAreaInputField is a wrapper of an Input Field that comes with Mode's style and functionalities built-in. In most of the form
 * in Mode app, we can reuse this component instead of implementing this logic for each input field.
 */
export const ModeTextAreaInputField: React.FC<ModeTextAreaInputFieldProps> = (props: ModeTextAreaInputFieldProps) => {
    
    const hideInput = useMemo(() => {
        if (props.hidden) return true;
        if (props.editingModeOnly && !props.isInEditMode) return true;
        if (props.isInEditMode && !props.editable && props.hideOnEdit === true) return true;
        return false;
    }, [props.isInEditMode, props.editable, props.hideOnEdit, props.hidden, props.editingModeOnly]);

    const inputLabelProps = useMemo(() => {
        return {
            shrink   : true,
            className: props.editable && !props.hideEditableIcon ? 'editable-label-icon' : `readonly-label-icon ${props.readonlyStyle}`,
        };
    }, [props.editable, props.hideEditableIcon, props.readonlyStyle]);

    const inputProps = useMemo(() => {
        return {
            className : clsx('input-wrapper', 'multiline', props.variant ?? 'standard'),
            rows      : Math.max(props.rows ?? 3, 3),
            inputProps: props.editable
                ? {
                    placeholder: props.placeholder,
                    readOnly   : !props.isInEditMode,
                    className  : clsx('textarea'),
                }
                : {
                    readOnly : true,
                    tabIndex : -1,
                    className: clsx('textarea'),
                },
        };
    }, [props.variant, props.rows, props.editable, props.placeholder, props.isInEditMode]);

    const className = useMemo(() => {
        return clsx(props.className, hideInput && 'hidden',
            !props.editable ? 'readonly' : '',
            !props.isInEditMode && props.clickable && 'clickable',
            props.isInEditMode && !props.editable && (props.readonlyStyle ?? DEFAULT_READONLY_INPUT_STYLE));
    }, [props.className, props.editable, props.isInEditMode, props.clickable, props.readonlyStyle, hideInput]);

    const onInputChangeHandler = props.onInputChange;
    const onFormInputChangeHandler = props.onFormInputChange;
    const onChange = useCallback((event: React.FormEvent) => {
        if (props.editable) {
            // The handler to monitor the input change just for this specific input
            if (onInputChangeHandler) {
                onInputChangeHandler(props.fieldName, (event.currentTarget as HTMLInputElement).value);
            }
            // The handler created by the container that monitor the input change for all inputs in the form
            if (onFormInputChangeHandler) {
                onFormInputChangeHandler(props.fieldName, (event.currentTarget as HTMLInputElement).value);
            }
        }
    }, [props.editable, onFormInputChangeHandler, onInputChangeHandler, props.fieldName]);

    const onClickHandler = props.onFieldClicked;
    const onClick = useCallback(() => {
        // If field is editable and we are not in editing mode, fire input clicked even to let the container know
        if ((props.editable || props.clickable) && onClickHandler && !props.isInEditMode) {
            onClickHandler(props.fieldName);
        }
    }, [props.editable, props.clickable, onClickHandler, props.isInEditMode, props.fieldName]);

    return (
        <TextField
            variant={props.variant ?? 'standard'}
            className={className}
            label={props.label}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
            required={props.isInEditMode && props.required}
            error={Boolean(props.editable && props.error)}
            helperText={props.editable ? props.error || props.description : undefined}
            value={props.value ?? ''}
            multiline
            onChange={onChange}
            onClick={onClick}
        />
    );
};



/**
 * A wrapper for ModeTextAreaInputField used for InfoComp. If we have an InfoComponent then we should use this ModeInfoCompTextAreaInputFieldProps
 * instead of ModeTextAreaInputField directly. This will help getting the props from compProps and inputProps and pass them to the
 * ModeTextAreaInputField. This wrapper help reduce the number of props we have to specify. However, we can always use the ModeTextAreaInputField
 * directly.
 */
export interface ModeInfoCompTextAreaInputFieldProps {
    readonly fieldName: string;
    readonly className?: string | undefined;
    readonly compProps: Pick<BaseInfoCompProps, 'isEditing' | 'onFormInputChange' | 'onFieldClicked' >;
    readonly inputProps: BaseEntityField<any> | undefined;
    readonly inputValue: string | undefined;
    readonly rows?: number | undefined;
    readonly onInputChange?: ((fieldName: string, value: string | undefined)=> void) | undefined;
}
export const ModeInfoCompTextAreaInputField: React.FC<ModeInfoCompTextAreaInputFieldProps> = (props: ModeInfoCompTextAreaInputFieldProps) => {

    if (props.inputProps === undefined) {
        return <></>;
    }
    return (
        <ModeTextAreaInputField
            className={props.className}
            fieldName={props.fieldName}
            value={props.inputValue}
            onInputChange={props.onInputChange}
            rows={props.rows}
            isInEditMode={props.compProps.isEditing}
            onFormInputChange={props.compProps.onFormInputChange}
            onFieldClicked={props.compProps.onFieldClicked}
            editable={props.inputProps.editable}
            label={props.inputProps.label}
            hidden={props.inputProps.hidden}
            hideOnEdit={props.inputProps.hideOnEdit}
            editingModeOnly={props.inputProps.editingModeOnly}
            placeholder={props.inputProps.placeholder}
            required={props.inputProps.required}
            variant={props.inputProps.variant}
            error={props.inputProps.error}
            description={props.inputProps.description}
            clickable={props.inputProps.clickable}
        />
    );
};



export interface ModeImageInputFieldProps extends ModeBaseInputFieldProps {
    readonly placeholder?: string | undefined;
    readonly value?: string | File | null | undefined;
    readonly uploadIcon?: string | undefined;
    readonly fileFilters?: string | undefined;
    readonly onInputChange?: ((fieldName: string, value: File | null | undefined)=> void) | undefined;
    readonly onFormInputChange?: ((fieldName: string, value: File | null | undefined)=> void) | undefined;
}


/**
 * Read an image file and return a dataURI for the image
 */
const readImageFile = async (file: File): Promise<string | undefined> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (result) => {
            resolve((result.target as FileReader)?.result as string);
        };
        reader.onerror = (error) => {
            return reject(error);
        };

        reader.readAsDataURL(file);
    });
};



/**
 * ModeImageInputField is a wrapper of an Input Field that comes with Mode's style and functionalities built-in. In most of the form
 * in Mode app, we can reuse this component instead of implementing this logic for each input field.
 */
export const ModeImageInputField: React.FC<ModeImageInputFieldProps> = (props: ModeImageInputFieldProps) => {
    const theme = useTheme();
    const hideInput = useMemo(() => {
        if (props.hidden) return true;
        if (props.editingModeOnly && !props.isInEditMode) return true;
        if (props.isInEditMode && !props.editable && props.hideOnEdit === true) return true;
        return false;
    }, [props.isInEditMode, props.editable, props.hideOnEdit, props.hidden, props.editingModeOnly]);

    const inputLabelProps = useMemo(() => {
        return {
            shrink   : true,
            className: props.editable && !props.hideEditableIcon ? 'editable-label-icon' : `readonly-label-icon ${props.readonlyStyle}`,
        };
    }, [props.editable, props.hideEditableIcon, props.readonlyStyle]);


    const className = useMemo(() => {
        return clsx(props.className, hideInput && 'hidden',
            !props.editable ? 'readonly' : '',
            !props.isInEditMode && props.clickable && 'clickable',
            props.isInEditMode && !props.editable && (props.readonlyStyle ?? DEFAULT_READONLY_INPUT_STYLE));
    }, [props.className, props.editable, props.isInEditMode, props.clickable, props.readonlyStyle, hideInput]);

    const onInputChangeHandler = props.onInputChange;
    const onFormInputChangeHandler = props.onFormInputChange;
    const onChange = useCallback(async (event: React.FormEvent) => {
        if (props.editable) {
            // Get the file the user selected and update the state
            const target = event.target as HTMLInputElement;
            if (target.files?.length === 1) {
                const selectedFile = target.files[0];

                // The handler to monitor the input change just for this specific input
                if (onInputChangeHandler) {
                    onInputChangeHandler(props.fieldName, selectedFile);
                }
                // The handler created by the container that monitor the input change for all inputs in the form
                if (onFormInputChangeHandler) {
                    onFormInputChangeHandler(props.fieldName, selectedFile);
                }
            }
        }
    }, [props.editable, onFormInputChangeHandler, onInputChangeHandler, props.fieldName]);

    const clearInput = useCallback(() => {
        if (props.editable) {
            // The handler to monitor the input change just for this specific input
            if (onInputChangeHandler) {
                onInputChangeHandler(props.fieldName, null);
            }
            // The handler created by the container that monitor the input change for all inputs in the form
            if (onFormInputChangeHandler) {
                onFormInputChangeHandler(props.fieldName, null);
            }
        }
    }, [onFormInputChangeHandler, onInputChangeHandler, props.editable, props.fieldName]);

    const onClickHandler = props.onFieldClicked;
    const onClick = useCallback(() => {
        // If field is editable and we are not in editing mode, fire input clicked even to let the container know
        if ((props.editable || props.clickable) && onClickHandler && !props.isInEditMode) {
            onClickHandler(props.fieldName);
        }
    }, [props.editable, props.clickable, onClickHandler, props.isInEditMode, props.fieldName]);


    // The Image URL or dataURI.
    const [image, setImage] = useState<string | undefined>();


    // On component init, we will check the type of props.value. If it is a type File then it must have been the file the user selected
    // therefore we need to load the file and get the image's dataURI. If props.value is a string then we can assume it is a URL to the
    // image and we can return use the URL as is, no need to load anything.
    useEffect(() => {
        if (props.value instanceof File) {
            readImageFile(props.value).then((dataURI) => {
                setImage(dataURI);
            }).catch(() => {
                setImage('data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
            });
        } else if (typeof props.value === 'string') {
            setImage(props.value);
        } else {
            setImage(undefined);
        }
    }, [props.value]);


    const inputProps = useMemo(() => {
        return {
            className : clsx('input-wrapper', 'multiline'),
            inputProps: props.editable
                ? {
                    placeholder: !image ? props.placeholder : undefined,
                    readOnly   : true,
                }
                : {
                    readOnly: true,
                    tabIndex: -1,
                },
            style: image ? {
                height: 170,        // Only need to make the input field height bigger if we are showing image
            } : undefined,

            // Show the image as ADORNMENT for the input field if there is an image
            startAdornment: image ? (
                <InputAdornment
                    position="start"
                    style={{
                        width: '100%',
                    }}
                >
                    <img
                        style={{
                            maxWidth : '100%',
                            height   : 150,
                            objectFit: 'cover',
                            boxShadow: theme.shadows[2],
                        }}
                        src={image}
                        alt={props.label}
                    />
                </InputAdornment>
            ) : undefined,
            endAdornment: props.isInEditMode ? (
                <InputAdornment position="end">
                    <IconButton
                        edge="end"
                        style={{
                            position: 'relative',
                        }}
                        onClick={(event) => {
                            (event.currentTarget as HTMLElement).getElementsByTagName('input')[0].click();
                        }}
                    >
                        <Icon color="primary">
                            {props.uploadIcon ?? 'find_in_page'}
                        </Icon>
                        <input
                            type="file"
                            accept={props.fileFilters}
                            style={{
                                position    : 'absolute',
                                width       : '100%',
                                height      : '100%',
                                top         : 0,
                                left        : 0,
                                visibility  : 'hidden',
                                borderRadius: '50%',
                            }}
                            onChange={onChange}
                        />
                    </IconButton>

                    {/* Add delete button if there is an image. This button call the handler to set the input value to NULL  */}
                    {image && (
                        <IconButton
                            edge="end"
                            style={{
                                position: 'relative',
                            }}
                            onClick={() => {
                                clearInput();
                            }}
                        >
                            <Icon color="secondary">
                                delete
                            </Icon>
                        </IconButton>
                    )}
                </InputAdornment>
            ) : undefined,
        };
    }, [props.editable, props.placeholder, props.label, props.isInEditMode, props.uploadIcon, props.fileFilters, image, theme.shadows, onChange,
        clearInput]);


    return (
        <TextField
            variant={props.variant ?? 'standard'}
            className={className}
            type="text"
            label={props.label}
            InputLabelProps={inputLabelProps}
            InputProps={inputProps}
            required={props.isInEditMode && props.required}
            error={Boolean(props.editable && props.error)}
            helperText={props.editable ? props.error || props.description : undefined}
            value=""
            onChange={onChange}
            onClick={onClick}
        />
    );
};



/**
 * A wrapper for ModeImageInputField used for InfoComp. If we have an InfoComponent then we should use this ModeInfoCompImageInputField
 * instead of ModeImageInputField directly. This will help getting the props from compProps and inputProps and pass them to the
 * ModeImageInputField. This wrapper help reduce the number of props we have to specify. However, we can always use the ModeImageInputField
 * directly.
 * @params inputValue: 'string' means the value is a URL to the image. 'File' means the value is a File object of the file the user selected.
 *                     'null' means to unset the value. 'undefined' means the value is not set.
 */
export interface ModeInfoCompImageInputFieldProps {
    readonly fieldName: string;
    readonly className?: string | undefined;
    readonly inputType?: React.HTMLInputTypeAttribute | undefined;
    readonly compProps: Pick<BaseInfoCompProps, 'isEditing' | 'onFormInputChange' | 'onFieldClicked' >;
    readonly inputProps: BaseEntityField<any> | undefined;
    readonly inputValue: string | File | null | undefined;
    readonly uploadIcon?: string | undefined;
    readonly fileFilters?: string | undefined;
    readonly onInputChange?: ((fieldName: string, value: File | null | undefined)=> void) | undefined;
}
export const ModeInfoCompImageInputField: React.FC<ModeInfoCompImageInputFieldProps> = (props: ModeInfoCompImageInputFieldProps) => {

    if (props.inputProps === undefined) {
        return <></>;
    }
    return (
        <ModeImageInputField
            className={props.className}
            fieldName={props.fieldName}
            value={props.inputValue}
            uploadIcon={props.uploadIcon}
            fileFilters={props.fileFilters}
            onInputChange={props.onInputChange}
            isInEditMode={props.compProps.isEditing}
            onFormInputChange={props.compProps.onFormInputChange}
            onFieldClicked={props.compProps.onFieldClicked}
            editable={props.inputProps.editable}
            label={props.inputProps.label}
            hidden={props.inputProps.hidden}
            hideOnEdit={props.inputProps.hideOnEdit}
            editingModeOnly={props.inputProps.editingModeOnly}
            placeholder={props.inputProps.placeholder}
            required={props.inputProps.required}
            variant={props.inputProps.variant}
            error={props.inputProps.error}
            description={props.inputProps.description}
            clickable={props.inputProps.clickable}
        />
    );
};



export interface ModeCheckBoxInputFieldProps extends ModeBaseInputFieldProps {
    readonly value?: boolean | undefined;
    readonly onInputChange?: ((fieldName: string, value: boolean)=> void) | undefined;
    readonly onFormInputChange?: ((fieldName: string, value: boolean)=> void) | undefined;
}


/**
 * ModeTextInputField is a wrapper of an Input Field that comes with Mode's style and functionalities built-in. In most of the form
 * in Mode app, we can reuse this component instead of implementing this logic for each input field.
 */
export const ModeCheckBoxInputField: React.FC<ModeCheckBoxInputFieldProps> = (props: ModeCheckBoxInputFieldProps) => {
    
    const hideInput = useMemo(() => {
        if (props.hidden) return true;
        if (props.editingModeOnly && !props.isInEditMode) return true;
        if (props.isInEditMode && !props.editable && props.hideOnEdit === true) return true;
        return false;
    }, [props.isInEditMode, props.editable, props.hideOnEdit, props.hidden, props.editingModeOnly]);


    const className = useMemo(() => {
        return clsx(props.className, hideInput && 'hidden',
            !props.editable ? 'readonly' : '',
            !props.isInEditMode && props.clickable && 'clickable',
            props.isInEditMode && !props.editable && (props.readonlyStyle ?? DEFAULT_READONLY_INPUT_STYLE));
    }, [props.className, props.editable, props.isInEditMode, props.clickable, props.readonlyStyle, hideInput]);


    const onInputChangeHandler = props.onInputChange;
    const onFormInputChangeHandler = props.onFormInputChange;
    const onChange = useCallback((event: React.FormEvent) => {
        if (props.editable) {
            // The handler to monitor the input change just for this specific input
            if (onInputChangeHandler) {
                onInputChangeHandler(props.fieldName, (event.currentTarget as HTMLInputElement).checked);
            }
            // The handler created by the container that monitor the input change for all inputs in the form
            if (onFormInputChangeHandler) {
                onFormInputChangeHandler(props.fieldName, (event.currentTarget as HTMLInputElement).checked);
            }
        }
    }, [props.editable, onFormInputChangeHandler, onInputChangeHandler, props.fieldName]);


    const onClickHandler = props.onFieldClicked;
    const onClick = useCallback(() => {
        // If field is editable and we are not in editing mode, fire input clicked even to let the container know
        if ((props.editable || props.clickable) && onClickHandler && !props.isInEditMode) {
            onClickHandler(props.fieldName);
        }
    }, [props.editable, props.clickable, onClickHandler, props.isInEditMode, props.fieldName]);


    return (
        <FormControl
            className={clsx(className)}
            variant={props.variant ?? 'standard'}
            required={props.isInEditMode && props.required}
            error={Boolean(props.editable && props.error)}
        >
            <FormLabel
                component="label"
                className={clsx(
                    'checkbox-label',
                    props.editable && !props.hideEditableIcon ? 'editable-label-icon' : `readonly-label-icon ${props.readonlyStyle}`,
                )}
            >
                {props.label}
            </FormLabel>
            <FormGroup>
                <FormControlLabel
                    label=""
                    control={(
                        <Checkbox
                            color="primary"
                            checked={props.value ?? false}
                            onChange={onChange}
                            onClick={onClick}
                        />
                    )}
                />
            </FormGroup>
            <FormHelperText>{props.editable ? props.error ?? props.description : undefined}</FormHelperText>
        </FormControl>
    );
};



/**
 * A wrapper for ModeCheckBoxInputField used for InfoComp. If we have an InfoComponent then we should use this ModeInfoCompCheckBoxInputField
 * instead of ModeCheckBoxInputField directly. This will help getting the props from compProps and inputProps and pass them to the
 * ModeCheckBoxInputField. This wrapper help reduce the number of props we have to specify. However, we can always use the ModeCheckBoxInputField
 * directly.
 */
export interface ModeInfoCompCheckBoxFieldProps {
    readonly fieldName: string;
    readonly className?: string | undefined;
    readonly compProps: Pick<BaseInfoCompProps, 'isEditing' | 'onFormInputChange' | 'onFieldClicked' >;
    readonly inputProps: BaseEntityField<any> | undefined;
    readonly inputValue: boolean | undefined;
    readonly onInputChange?: ((fieldName: string, value: boolean | undefined)=> void) | undefined;
}
export const ModeInfoCompCheckBoxInputField: React.FC<ModeInfoCompCheckBoxFieldProps> = (props: ModeInfoCompCheckBoxFieldProps) => {

    if (props.inputProps === undefined) {
        return <></>;
    }
    return (
        <ModeCheckBoxInputField
            className={props.className}
            fieldName={props.fieldName}
            value={props.inputValue}
            onInputChange={props.onInputChange}
            variant={props.inputProps.variant}
            isInEditMode={props.compProps.isEditing}
            onFormInputChange={props.compProps.onFormInputChange}
            onFieldClicked={props.compProps.onFieldClicked}
            editable={props.inputProps.editable}
            label={props.inputProps.label}
            hidden={props.inputProps.hidden}
            hideOnEdit={props.inputProps.hideOnEdit}
            editingModeOnly={props.inputProps.editingModeOnly}
            required={props.inputProps.required}
            error={props.inputProps.error}
            description={props.inputProps.description}
            clickable={props.inputProps.clickable}
        />
    );
};



export interface ModeSelectInputFieldProps extends ModeBaseInputFieldProps {
    readonly value?: any | undefined;
    // Make "options" required
    readonly options: readonly (SelectInputOption<any> | SELECT_INPUT_OPTION_DIVIDER_TYPE)[] | undefined;
    readonly noOptionsLabel?: string | undefined;
}


/**
 * ModeTextInputField is a wrapper of an Input Field that comes with Mode's style and functionalities built-in. In most of the form
 * in Mode app, we can reuse this component instead of implementing this logic for each input field.
 */
export const ModeSelectInputField: React.FC<ModeSelectInputFieldProps> = (props: ModeSelectInputFieldProps) => {
    
    const hideInput = useMemo(() => {
        if (props.hidden) return true;
        if (props.editingModeOnly && !props.isInEditMode) return true;
        if (props.isInEditMode && !props.editable && props.hideOnEdit === true) return true;
        return false;
    }, [props.isInEditMode, props.editable, props.hideOnEdit, props.hidden, props.editingModeOnly]);


    const className = useMemo(() => {
        return clsx(props.className, hideInput && 'hidden',
            !props.editable ? 'readonly' : '',
            !props.isInEditMode && props.clickable && 'clickable',
            props.isInEditMode && !props.editable && (props.readonlyStyle ?? DEFAULT_READONLY_INPUT_STYLE));
    }, [props.className, props.editable, props.isInEditMode, props.clickable, props.readonlyStyle, hideInput]);


    const options = props.options && props.options.length > 0
        ? props.options
        : [{
            label   : props.noOptionsLabel || 'No Options',
            value   : props.noOptionsLabel || 'No Options',
            disabled: true,
        } as SelectInputOption<string>];



    // If the input already have a value, check if that value is one of the possible values the user can select from. If that value IS NOT
    // in the list of possible values, the Select component will not show the input's value. For this case, we will have to manually add
    // this value to the list of possible values so that it would show up in the Select component. However, we will make it disabled so that
    // the user can't select it
    const isValueOutOfRange = props.value !== undefined && options.find((option) => {
        if (typeof option !== 'string') {
            return option.value === props.value;
        }
        return false;
    }) === undefined;


    const onInputChangeHandler = props.onInputChange;
    const onFormInputChangeHandler = props.onFormInputChange;
    const onChange = useCallback((event: React.ChangeEvent<{ value: unknown }>) => {
        if (props.editable) {
            // The handler to monitor the input change just for this specific input
            if (onInputChangeHandler) {
                onInputChangeHandler(props.fieldName, event.target.value);
            }
            // The handler created by the container that monitor the input change for all inputs in the form
            if (onFormInputChangeHandler) {
                onFormInputChangeHandler(props.fieldName, event.target.value);
            }
        }
    }, [props.editable, onFormInputChangeHandler, onInputChangeHandler, props.fieldName]);

    const onClickHandler = props.onFieldClicked;
    const onClick = useCallback(() => {
        // If field is editable and we are not in editing mode, fire input clicked even to let the container know
        if ((props.editable || props.clickable) && onClickHandler && !props.isInEditMode) {
            onClickHandler(props.fieldName);
        }
    }, [props.editable, props.clickable, onClickHandler, props.isInEditMode, props.fieldName]);

    return (
        <FormControl
            className={className}
            error={Boolean(props.editable && props.error)}
            required={props.required}
            variant={props.variant ?? 'standard'}
            onClick={onClick}
        >
            <InputLabel
                shrink
                className={clsx(props.editable && !props.hideEditableIcon ? 'editable-label-icon' : `readonly-label-icon ${props.readonlyStyle}`)}
            >
                {props.label}
            </InputLabel>
            <Select
                className="input-wrapper"
                value={props.value ?? ''}
                displayEmpty
                readOnly={!props.editable}
                error={Boolean(props.editable && props.error)}
                inputProps={{
                    disabled: !props.isInEditMode,
                }}
                onChange={onChange}
            >
                {/* If the input value IS NOT one of the valid values, create a dummy option but make it disabled */}
                {isValueOutOfRange && (
                    <MenuItem
                        value={props.value}
                        disabled
                        style={{
                            display: 'none',
                        }}
                    >
                        {props.value !== undefined && props.value !== null ? props.value.toString() : ''}
                    </MenuItem>
                )}
                {options.map((option, index) => {
                    if (typeof option === 'string') {
                        return (
                            // eslint-disable-next-line react/no-array-index-key
                            <Divider key={`divider-${option}-${index}`} />
                        );
                    }
                    return (
                        <MenuItem key={`${option.label}-${option.value}`} value={option.value} disabled={option.disabled}>
                            {option.label}
                        </MenuItem>
                    );
                })}
            </Select>
            <FormHelperText>{props.editable ? props.error ?? props.description : undefined}</FormHelperText>
        </FormControl>
    );
};



/**
 * A wrapper for ModeSelectInputField used for InfoComp. If we have an InfoComponent then we should use this ModeInfoCompSelectInputField
 * instead of ModeSelectInputField directly. This will help getting the props from compProps and inputProps and pass them to the
 * ModeSelectInputField. This wrapper help reduce the number of props we have to specify. However, we can always use the ModeSelectInputField
 * directly.
 */
export interface ModeInfoCompSelectInputFieldProps {
    readonly fieldName: string;
    readonly className?: string | undefined;
    readonly compProps: Pick<BaseInfoCompProps, 'isEditing' | 'onFormInputChange' | 'onFieldClicked' >;
    readonly inputProps: BaseEntityField<any> | undefined;
    readonly inputValue: any | undefined;
    readonly onInputChange?: ((fieldName: string, value: any | undefined)=> void) | undefined;
}
export const ModeInfoCompSelectInputField: React.FC<ModeInfoCompSelectInputFieldProps> = (props: ModeInfoCompSelectInputFieldProps) => {

    if (props.inputProps === undefined) {
        return <></>;
    }
    return (
        <ModeSelectInputField
            className={props.className}
            fieldName={props.fieldName}
            value={props.inputValue}
            onInputChange={props.onInputChange}
            isInEditMode={props.compProps.isEditing}
            onFormInputChange={props.compProps.onFormInputChange}
            onFieldClicked={props.compProps.onFieldClicked}
            editable={props.inputProps.editable}
            label={props.inputProps.label}
            hidden={props.inputProps.hidden}
            hideOnEdit={props.inputProps.hideOnEdit}
            editingModeOnly={props.inputProps.editingModeOnly}
            required={props.inputProps.required}
            variant={props.inputProps.variant}
            error={props.inputProps.error}
            description={props.inputProps.description}
            options={props.inputProps.options}
            noOptionsLabel={props.inputProps.noOptionsLabel}
            clickable={props.inputProps.clickable}
        />
    );
};



export interface ModeAutoCompleteInputFieldProps extends ModeBaseInputFieldProps {
    readonly value?: any | undefined;
    readonly multiple?: boolean | undefined;
    // Make "options" required
    readonly options: readonly (SelectInputOption<any> | SELECT_INPUT_OPTION_DIVIDER_TYPE)[] | undefined;
    readonly noOptionsLabel?: string | undefined;
    readonly multipleSelectionDisplayLimit?: number | undefined;
    readonly placeholder?: string | undefined;
    readonly freeSolo?: boolean | undefined;
}


const useAutoCompleteStyle = makeStyles((theme: Theme) => {
    return {
        tag: {
            display      : 'flex',
            flexDirection: 'row',
            alignItems   : 'center',
            fontSize     : 'small',
            borderRadius : 2,
            border       : `1px solid ${theme.palette.divider}`,
            padding      : '2px 10px',
            background   : theme.palette.background.default,
            '& .label'   : {
                overflow    : 'hidden',
                whiteSpace  : 'nowrap',
                textOverflow: 'ellipsis',
            },
            '& .icon': {
                fontSize  : 'small',
                cursor    : 'pointer',
                marginLeft: 5,
            },
        },
    };
});



// eslint-disable-next-line react/prop-types
const AutoCompleteTag = ({ label, isInEditMode, onDelete, ...props }) => {
    const classes = useAutoCompleteStyle();

    return (
        <div
            {...props}
            // eslint-disable-next-line react/prop-types
            className={clsx(props.className, classes.tag)}
        >
            <span className="label">{label}</span>
            {isInEditMode && (<Icon className="icon" onClick={onDelete} fontSize="small">close</Icon>)}
        </div>
    );
};

/**
 * ModeTextInputField is a wrapper of an Input Field that comes with Mode's style and functionalities built-in. In most of the form
 * in Mode app, we can reuse this component instead of implementing this logic for each input field.
 */
export const ModeAutoCompleteInputField: React.FC<ModeAutoCompleteInputFieldProps> = (props: ModeAutoCompleteInputFieldProps) => {

    const hideInput = useMemo(() => {
        if (props.hidden) return true;
        if (props.editingModeOnly && !props.isInEditMode) return true;
        if (props.isInEditMode && !props.editable && props.hideOnEdit === true) return true;
        return false;
    }, [props.isInEditMode, props.editable, props.hideOnEdit, props.hidden, props.editingModeOnly]);


    const className = useMemo(() => {
        return clsx(props.className, hideInput && 'hidden',
            !props.editable ? 'readonly' : '',
            !props.isInEditMode && props.clickable && 'clickable',
            props.isInEditMode && !props.editable && (props.readonlyStyle ?? DEFAULT_READONLY_INPUT_STYLE));
    }, [props.className, props.editable, props.isInEditMode, props.clickable, props.readonlyStyle, hideInput]);



    const onInputChangeHandler = props.onInputChange;
    const onFormInputChangeHandler = props.onFormInputChange;
    const onChange = useCallback((
        event: React.ChangeEvent<{}>,
        values: SelectInputOption<any> | any | (SelectInputOption<any> | any)[] | null,
    ) => {
        if (props.editable) {
            // The handler to monitor the input change just for this specific input
            if (onInputChangeHandler) {
                if (values instanceof Array) {
                    onInputChangeHandler(props.fieldName, values.map((value) => {
                        return typeof value === 'object' ? value.value : value;
                    }));
                } else {
                    onInputChangeHandler(props.fieldName, values !== null && typeof values === 'object' ? values.value : values ?? undefined);
                }
            }
            // The handler created by the container that monitor the input change for all inputs in the form
            if (onFormInputChangeHandler) {
                if (values instanceof Array) {
                    onFormInputChangeHandler(props.fieldName, values.map((value) => {
                        return typeof value === 'object' ? value.value : value;
                    }));
                } else {
                    onFormInputChangeHandler(props.fieldName, values !== null && typeof values === 'object'
                        ? values.value : values ?? undefined);
                }
            }
        }
    }, [props.editable, onFormInputChangeHandler, onInputChangeHandler, props.fieldName]);

    const onClickHandler = props.onFieldClicked;
    const onClick = useCallback(() => {
        // If field is editable and we are not in editing mode, fire input clicked even to let the container know
        if ((props.editable || props.clickable) && onClickHandler && !props.isInEditMode) {
            onClickHandler(props.fieldName);
        }
    }, [props.editable, props.clickable, onClickHandler, props.isInEditMode, props.fieldName]);


    const filterOptions = useMemo(() => {
        return createFilterOptions({
            ignoreCase: true,
            stringify : (option: SelectInputOption<any> | SELECT_INPUT_OPTION_DIVIDER_TYPE) => {
                // combine the value and label so that search can apply to both
                if (typeof option === 'string') {
                    return option;
                }
                return `${option.value} ${option.label}`;
            },
        });
    }, []);


    const getOptionLabel = useCallback((option) => {
        // NOTE: option can be a SelectInputOption<any> when this function is called to get the display label for an option
        // or option can be the actual selected option.value.
        if (isSelectInputOption(option)) {
            return option.label ?? option.value ?? '';
        }
        return option;
    }, []);


    const getOptionSelected = useCallback((option, value) => {
        if (isSelectInputOption(option)) {
            return option.value === value;
        }
        return option === value;
    }, []);

    const inputLabelProps = useMemo(() => {
        return {
            shrink   : true,
            className: props.editable && !props.hideEditableIcon ? 'editable-label-icon' : `readonly-label-icon ${props.readonlyStyle}`,
        };
    }, [props.editable, props.hideEditableIcon, props.readonlyStyle]);


    const renderInput = useCallback((params) => {
        return (
            <TextField
                {...params}
                variant={props.variant ?? 'standard'}
                type="text"
                label={props.label}
                InputLabelProps={inputLabelProps}
                placeholder={props.placeholder}
                required={props.isInEditMode && props.required}
                error={Boolean(props.editable && props.error)}
                helperText={props.editable ? props.error ?? props.description : undefined}
                onClick={onClick}
            />
        );
    }, [props.variant, props.label, props.placeholder, props.isInEditMode, props.required, props.editable, props.error, props.description,
        inputLabelProps, onClick]);


    const renderOption = useCallback((option, { selected }) => {
        // TODO - Fix Divider option
        if (option === SELECT_INPUT_OPTION_DIVIDER) {
            return (
                <span style={{
                    marginLeft: '10px',
                }}
                >
                    {option}
                </span>
            );
        }
        return (
            <>
                {props.multiple && (
                    <Checkbox
                        icon={<Icon>check_box_outline_blank</Icon>}
                        checkedIcon={<Icon>check_box</Icon>}
                        style={{
                            marginRight: 8,
                        }}
                        checked={selected}
                    />
                )}
                {option.icon && (<FontIcon iconName={option.icon ?? ''} />)}
                <span style={{
                    marginLeft: '10px',
                }}
                >
                    {option.label}
                </span>
            </>
        );
    }, [props.multiple]);


    const renderTags = useCallback((tagValues, getTagProps) => {
        // override the renderTags so that we can disable the tags when not in edit mode
        return tagValues.map((option, index) => {
            const selectOption = props.options?.find((o) => {
                if (typeof o !== 'string') {
                    return o.value === option;
                }
                return false;
            });
            return (
                <AutoCompleteTag
                    label={typeof selectOption === 'string' ? selectOption : selectOption?.label ?? option}
                    isInEditMode={props.isInEditMode}
                    {...getTagProps({
                        index,
                    })}
                />
            );
        });
    }, [props.isInEditMode, props.options]);


    return (
        <FormControl
            className={className}
            error={Boolean(props.editable && props.error)}
            required={props.required}
            variant={props.variant ?? 'standard'}
            onClick={onClick}
        >
            <InputLabel
                shrink
                className={clsx(props.editable && !props.hideEditableIcon ? 'editable-label-icon' : `readonly-label-icon ${props.readonlyStyle}`)}
            >
                {props.label}
            </InputLabel>

            <Autocomplete
                className="input-wrapper"
                value={props.value ?? ''}
                multiple={props.multiple}
                disableCloseOnSelect={props.multiple}
                limitTags={props.multipleSelectionDisplayLimit ?? 1}
                freeSolo={props.freeSolo}
                noOptionsText={props.noOptionsLabel ?? 'No Options'}
                onChange={onChange}
                options={[...(props.options ?? [])]}
                filterOptions={filterOptions}
                getOptionLabel={getOptionLabel}
                getOptionSelected={getOptionSelected}
                renderInput={renderInput}
                renderOption={renderOption}
                renderTags={renderTags}
            />
        </FormControl>
    );
};



/**
 * A wrapper for ModeSelectInputField used for InfoComp. If we have an InfoComponent then we should use this ModeInfoCompSelectInputField
 * instead of ModeSelectInputField directly. This will help getting the props from compProps and inputProps and pass them to the
 * ModeSelectInputField. This wrapper help reduce the number of props we have to specify. However, we can always use the ModeSelectInputField
 * directly.
 */
export interface ModeInfoCompAutoCompleteInputFieldProps {
    readonly fieldName: string;
    readonly className?: string | undefined;
    readonly compProps: Pick<BaseInfoCompProps, 'isEditing' | 'onFormInputChange' | 'onFieldClicked' >;
    readonly inputProps: BaseEntityField<any> | undefined;
    readonly inputValue: any | undefined;
    readonly onInputChange?: ((fieldName: string, value: any | undefined)=> void) | undefined;
}
export const ModeInfoCompAutoCompleteInputField: React.FC<ModeInfoCompAutoCompleteInputFieldProps> = (
    props: ModeInfoCompAutoCompleteInputFieldProps,
) => {

    if (props.inputProps === undefined) {
        return <></>;
    }

    return (
        <ModeAutoCompleteInputField
            className={props.className}
            fieldName={props.fieldName}
            value={props.inputValue}
            onInputChange={props.onInputChange}
            isInEditMode={props.compProps.isEditing}
            onFormInputChange={props.compProps.onFormInputChange}
            onFieldClicked={props.compProps.onFieldClicked}
            editable={props.inputProps.editable}
            label={props.inputProps.label}
            hidden={props.inputProps.hidden}
            hideOnEdit={props.inputProps.hideOnEdit}
            editingModeOnly={props.inputProps.editingModeOnly}
            required={props.inputProps.required}
            variant={props.inputProps.variant}
            error={props.inputProps.error}
            description={props.inputProps.description}
            options={props.inputProps.options}
            noOptionsLabel={props.inputProps.noOptionsLabel}
            clickable={props.inputProps.clickable}
            multiple={props.inputProps.multiple}
            placeholder={props.inputProps.placeholder}
            freeSolo={props.inputProps.freeSolo}
            multipleSelectionDisplayLimit={props.inputProps.multipleSelectionDisplayLimit}
        />
    );
};



/**
 * Each component has a set of input fields. For each input field, there has to be some state/setters function and an input change handler function
 * to update the state. For the input change handler, all it does is call the setter function to update the state with the latest input value. So
 * instead of implement this same function many time for each input field and each component, we will create this helper function to take care of
 * updating the the state by calling the setter function. When an input change, all the component does is call this helper function and pass it
 * the inputName, value, and a map of inputName => setter functions. This helper function will lookup the map to find the setter function
 * associated with the input name and call it to update the state.
 */
export const inputStateSetterHelper = (inputName: string, value: any, inputStateSetters: {[inputName: string]: (value: any)=> void}) => {
    // Lookup the input state's setter function by the input's name and then call the setter to set the value
    if (inputStateSetters[inputName]) {
        inputStateSetters[inputName](value);
    }
};



/*  Shared function used by Table components */


/**
 * Get the sort icon for the specified field.
 * If the current sort field is the specified field then we will return the UP or DOWN arrow according
 * base on the current sort order. If the specified field is not the current sort field then don't return
 * any icon
 */
export const getSortIcon = (order: SortOrder | undefined): string => {
    if (order !== undefined) {
        if (order === SortOrder.ASC) {
            return 'expand_less';
        }
        return 'expand_more';
    }
    return '';
};


/**
 * Helper function to create a Header Column for a table. We need this in all of the Table components so we will place this code here
 * so we can reuse it. This function will help create a column header based on the tableSetting and column settings. It will draw a
 * label or button depending on whether the column is sortable and display the correct icon based on the current sort field and order.
 */
export const createHeaderColumn = (
    fieldsSettings: BaseListCompFieldsSettings<BaseListCompFieldsSet>,
    fieldName: string,
    field: BaseListCompField,
    colClassNames: string,
): JSX.Element | undefined => {

    if (field.hidden) {
        return undefined;
    }

    return (
        <TableCell className={colClassNames} key={fieldName || field.dataItemProp || field.label}>
            {field.sortable
                ? (
                    <Button
                        className="sort-button"
                        endIcon={
                            fieldsSettings.currentSortedField === field.dataItemProp
                                ? <Icon>{getSortIcon(fieldsSettings.currentSortedOrder)}</Icon>
                                : <Icon>unfold_more</Icon>
                        }
                        onClick={() => {
                            if (fieldsSettings.onSortByField) {
                                fieldsSettings.onSortByField(field);
                            }
                        }}
                    >
                        {`${field.label}${field.unit ? ` [${field.unit}]` : ''}`}
                    </Button>
                )
                : (
                    <>
                        {`${field.label}${field.unit ? ` [${field.unit}]` : ''}`}
                    </>
                )}
        </TableCell>
    );
};


/**
 * Helper function to create the cell for the 'Remove' item button.
 */
export const createRemoveItemCell = <T extends unknown>(
    dataItem: BaseListCompDataItem<T>,
    className: string,
    onClickHandler: ((item: T)=> void) | undefined,
): JSX.Element => {
    return (
        <TableCell
            key="remove"
            className={className}
        >
            {dataItem.canBeRemoved && (
                <IconButton
                    onClick={(event: React.MouseEvent) => {
                        event.stopPropagation();
                        event.preventDefault();
                        if (onClickHandler) {
                            onClickHandler(dataItem.actualValue);
                        }
                    }}
                >
                    <Icon color="secondary">delete_outline</Icon>
                </IconButton>
            )}
        </TableCell>
    );
};



/**
 * Helper function to create the cell for the 'Preview' item button.
 */
export const createPreviewItemCell = <T extends unknown>(
    dataItem: BaseListCompDataItem<T>,
    className: string,
    onClickHandler: ((item: T)=> void) | undefined,
): JSX.Element => {
    return (
        <TableCell
            key="preview"
            className={className}
        >
            <IconButton
                onClick={(event: React.MouseEvent) => {
                    event.stopPropagation();
                    event.preventDefault();
                    if (onClickHandler) {
                        onClickHandler(dataItem.actualValue);
                    }
                }}
            >
                <Icon color="primary">visibility</Icon>
            </IconButton>
        </TableCell>
    );
};
