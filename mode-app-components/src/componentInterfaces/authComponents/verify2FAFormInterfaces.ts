/**
 * The set of input field names for the verify 2FA UI component.
 */
export enum Verify2FAFormInputField {
    CODE = 'code',
}



/**
 * This is the base interface for any Verify2FAForm's 'texts' props. All Verify2FAForm's text props MUST
 * implement this interface. They can extends this interface and add additional props but they must at least have these props. These texts will
 * be used to display in the
 * component's UI.
 */
export interface BaseVerify2FAFormPropsTexts {
    readonly title?: string;                    // OPTIONAL - The title to show in the UI
    readonly subtitle?: string;                 // OPTIONAL - The message show under the title
    readonly authCodeInputLabel?: string;       // The label to be used for the 'Authentication Code' input field
    readonly authCodeInputPlaceholder?: string; // The placeholder to be used for the 'Authentication Code' input field
    readonly authCodeInputHelp?: string;        // The help text to be used for the code input field
    readonly verifyButtonLabel: string;         // The label to be used for the 'Verify' button
}



/**
 * This is the base interface for all StartResetPasswordComp's props. All reset password UI components' props MUST implement this interface.
 * They can extends this interface and add additional props but they need to be at least implement these basic props.
 * A UI component is a dumb component that contain only the UI, no logic. All the logic, form validation, etc... will be handled by the container
 * of this component.
 */
export interface BaseVerify2FAFormProps {
    readonly className?: string | undefined;

    // Pre-translated texts to be shown in the UI
    readonly texts: BaseVerify2FAFormPropsTexts;

    // Text to be used for displaying error. This is OPTIONAL since it is only needed when there are errors
    readonly errorTexts?: {
        readonly [Verify2FAFormInputField.CODE]?: string | undefined;            // Error message to show for code input
        readonly otherError?: string | undefined;       // Error message to show for other errors not related to the input fields
    } | undefined;

    // These are the callback the container can implement to handle the logic
    readonly onFormInputChange?: (inputName: Verify2FAFormInputField, value: string | undefined)=> void;
    readonly onFormSubmit?: (inputs: {
        readonly [Verify2FAFormInputField.CODE]: string | undefined
    })=> void;
}
