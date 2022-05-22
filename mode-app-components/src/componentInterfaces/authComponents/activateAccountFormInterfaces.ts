/**
 * The set of input field names for the activate user UI component.
 */
export enum ActivateAccountFormInputField {
    NAME = 'name',
    PASSWORD = 'password',
    CONFIRM_PASSWORD = 'confirmPassword',
}


/**
 * This is the base interface for any ActivateAccountComp's 'texts' props. All ActivateAccountComp's text props MUST implement this interface.
 * They can extends this interface and add additional props but they must at least have these props. These texts will be used to display in the
 * component's UI.
 */
export interface BaseActivateAccountFormTexts {
    readonly title?: string;                            // OPTIONAL - The title to show in the UI
    readonly subtitle?: string;                         // OPTIONAL - The message show under the title
    readonly nameInputLabel?: string;                   // The label to be used for the 'Name' input field
    readonly nameInputPlaceholder?: string;             // The placeholder text to be used for the 'Name' input field
    readonly nameInputHelp?: string;                    // The help text to be used for the 'Name' input field
    readonly passwordInputLabel?: string;               // The label to be used for the 'Password' input field
    readonly passwordInputPlaceholder?: string;         // The placeholder text to be used for the 'Password' input field
    readonly passwordInputHelp?: string;                // The help text to be used for the 'Password' input field
    readonly confirmPasswordInputLabel?: string;        // The label to be used for the 'Confirm Password' input field
    readonly confirmPasswordInputPlaceholder?: string;  // The placeholder text to be used for the 'Confirm Password' input field
    readonly confirmPasswordInputHelp?: string;         // The help text to be used for the 'Confirm Password' input field
    readonly loginButtonLabel: string;                  // The label to be used for the 'Login' button
    readonly activateButtonLabel: string;               // The label to be used for the 'Activate' button
}



/**
 * This is the base interface for all ActivateAccountComp's props. All activate user UI components' props MUST implement this interface. They
 * can extends this interface and add additional props but they need to be at least implement these basic props.
 * A UI component is a dumb component that contain only the UI, no logic. All the logic, form validation, etc... will be handled by the container
 * of this component.
 */
export interface BaseActivateAccountFormProps {
    readonly className?: string | undefined;

    // Whether to exclude input for password. Sometimes the user only need to provide name to activate account
    readonly passwordNotRequired?: boolean | undefined;

    // The user's email that is trying to activate.
    readonly email?: string;

    // Pre-translated texts to be shown in the UI
    readonly texts: BaseActivateAccountFormTexts;

    // Text to be used for displaying error. This is OPTIONAL since it is only needed when there are errors
    readonly errorTexts?: {
        readonly [ActivateAccountFormInputField.NAME]?: string | undefined;                    // Error message to show for name input
        readonly [ActivateAccountFormInputField.PASSWORD]?: string | undefined;                // Error message to show for password input
        readonly [ActivateAccountFormInputField.CONFIRM_PASSWORD]?: string | undefined;        // Error message to show for confirm password input
        readonly otherError?: string | undefined;           // Error message to show for other errors not related to the input fields
    } | undefined;

    // These are the callback the container can implement to handle the logic
    readonly onGotoLogin?: (()=> void) | undefined;
    readonly onFormInputChange?: ((inputName: ActivateAccountFormInputField, value: string | undefined)=> void) | undefined;
    readonly onFormSubmit?: ((inputs: {
        readonly [ActivateAccountFormInputField.NAME]: string | undefined,
        readonly [ActivateAccountFormInputField.PASSWORD]: string | undefined
        readonly [ActivateAccountFormInputField.CONFIRM_PASSWORD]: string | undefined
    })=> void) | undefined;
}
