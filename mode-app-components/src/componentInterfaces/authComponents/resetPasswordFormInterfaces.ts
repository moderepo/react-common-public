/**
 * The set of input field names for the reset password UI component.
 */
export enum ResetPasswordFormInputField {
    NEW_PASSWORD = 'newPassword',
    CONFIRM_NEW_PASSWORD = 'confirmNewPassword',
}



/**
 * This is the base interface for any ResetPasswordComp's 'texts' props. All ResetPasswordComp's text props MUST
 * implement this interface. They can extends this interface and add additional props but they must at least have these props. These texts will
 * be used to display in the
 * component's UI.
 */
export interface BaseResetPasswordFormTexts {
    readonly title?: string;                                // OPTIONAL - The title to show in the UI
    readonly subtitle?: string;                             // OPTIONAL - The message show under the title
    readonly newPasswordInputLabel?: string;                // The label to be used for the 'Email' input field
    readonly newPasswordInputPlaceholder?: string;          // The placeholder text to be used for the 'Email' input field
    readonly newPasswordInputHelp?: string;                 // The help text to be used for the 'Email' input field
    readonly confirmNewPasswordInputLabel?: string;         // The label to be used for the 'Email' input field
    readonly confirmNewPasswordInputPlaceholder?: string;   // The placeholder text to be used for the 'Email' input field
    readonly confirmNewPasswordInputHelp?: string;          // The help text to be used for the 'Email' input field
    readonly loginButtonLabel: string;                      // The label to be used for the 'Login' button
    readonly resetPasswordButtonLabel: string;              // The label to be used for the 'Reset' button
}



/**
 * This is the base interface for all ResetPasswordComp's props. All reset password UI components' props MUST implement this interface.
 * They can extends this interface and add additional props but they need to be at least implement these basic props.
 * A UI component is a dumb component that contain only the UI, no logic. All the logic, form validation, etc... will be handled by the container
 * of this component.
 */
export interface BaseResetPasswordFormProps {
    readonly className?: string | undefined;

    // Pre-translated texts to be shown in the UI
    readonly texts: BaseResetPasswordFormTexts;

    // Text to be used for displaying error. This is OPTIONAL since it is only needed when there are errors
    readonly errorTexts?: {
        readonly [ResetPasswordFormInputField.NEW_PASSWORD]?: string | undefined;           // Error message to show for newPassword input
        readonly [ResetPasswordFormInputField.CONFIRM_NEW_PASSWORD]?: string | undefined;   // Error message to show for confirmPassword input
        readonly otherError?: string | undefined;           // Error message to show for other errors not related to the input fields
    } | undefined;

    // These are the callback the container can implement to handle the logic
    readonly onGotoLogin?: ()=> void;
    readonly onFormInputChange?: (inputName: ResetPasswordFormInputField, value: string | undefined)=> void;
    readonly onFormSubmit?: (inputs: {
        readonly [ResetPasswordFormInputField.NEW_PASSWORD]: string | undefined,
        readonly [ResetPasswordFormInputField.CONFIRM_NEW_PASSWORD]: string | undefined
    })=> void;
}
