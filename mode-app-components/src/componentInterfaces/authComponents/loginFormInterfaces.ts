/**
 * The set of input field names for the email login UI component.
 */
export enum EmailLoginFormInputField {
    EMAIL = 'email',
    PASSWORD = 'password'
}


/**
 * This is the base interface for any LoginComp's 'texts' props. All LoginComp's text props MUST implement this interface.
 * They can extends this interface and add additional props but they must at least have these props. These texts will be used to display in the
 * component's UI.
 */
export interface BaseLoginFormTexts {
    readonly title?: string;                    // OPTIONAL - The title to show in the UI
    readonly subtitle?: string;                 // OPTIONAL - The message show under the title
    readonly emailInputLabel?: string;          // The label to be used for the 'Email' input field
    readonly emailInputPlaceholder?: string;    // The placeholder text to be used for the 'Email' input field
    readonly emailInputHelp?: string;           // The help text to be used for the 'Email' input field
    readonly passwordInputLabel?: string;       // The label to be used for the 'Password' input field
    readonly passwordInputPlaceholder?: string; // The placeholder text to be used for the 'Password' input field
    readonly passwordInputHelp?: string;        // The help text to be used for the 'Password' input field
    readonly forgetPasswordButtonLabel: string; // The label to be used for the 'Forget Password' button
    readonly loginButtonLabel: string;          // The label to be used for the 'Login' button
}


export interface ExternalLoginProviderInfo {
    readonly id: string;                // Provider id used internally
    readonly name: string;              // Provider name used internally
    readonly loginButtonLabel: string;  // Provider label used for displaying to the user
    readonly icon?: JSX.Element | undefined;
    readonly background?: string;       // Most Provider has their own color theme so the user can customize the background color of the button
    readonly labelColor?: string;       // Default color is white but it might not work with the custom background color so it can be customized
}


/**
 * This is the base interface for all LoginComp's props. All email login UI components' props MUST implement this interface. They
 * can extends this interface and add additional props but they need to be at least implement these basic props.
 * A UI component is a dumb component that contain only the UI, no logic. All the logic, form validation, etc... will be handled by the container
 * of this component.
 */
export interface BaseLoginFormProps {
    readonly className?: string | undefined;

    // Pre-translated texts to be shown in the UI
    readonly texts: BaseLoginFormTexts;

    // Text to be used for displaying error. This is OPTIONAL since it is only needed when there are errors
    readonly errorTexts?: {
        readonly [EmailLoginFormInputField.EMAIL]?: string | undefined;     // Error message to show for email input
        readonly [EmailLoginFormInputField.PASSWORD]?: string | undefined;  // Error message to show for password input
        readonly otherError?: string | undefined;                           // Error message to show for other errors not related to the input fields
    } | undefined;

    // A list of external login type that the user can use to log in with e.g.Google, Facebook, etc...
    readonly externalLogin?: {
        readonly providers: readonly ExternalLoginProviderInfo[];
        readonly onProviderSelected: (providerId: string)=> void;
    } | undefined;

    // Email login settings if email login is enabled
    readonly emailLogin?: {
        readonly onGotoForgotPassword?: (()=> void) | undefined;
        readonly onFormInputChange?: ((inputName: EmailLoginFormInputField, value: string | undefined)=> void) | undefined;
        readonly onFormSubmit?: ((inputs: {
            readonly [EmailLoginFormInputField.EMAIL]: string | undefined,
            readonly [EmailLoginFormInputField.PASSWORD]: string | undefined
        })=> void) | undefined;
    } | undefined
}
