export const getLocalStorageItem = (key: string, defaultValue?: any): any => {
    // Check if there is already a value stored in localStorage under the specified key. If there is, JSON.parse
    // the stored value and return it as an Object. If there isn't a value stored, use the provided default value.
    const storedValue = window.localStorage.getItem(key);
    if (storedValue) {
        try {
            return JSON.parse(storedValue);
        } catch (error) {
            // Unable to parse the value currently stored in localStorage, use the default value
            return defaultValue;
        }
    } else {
        return defaultValue;
    }
};


export const setLocalStorageItem = (key: string, newValue: any) => {
    // Store newValue into localStorage as string if newValue is provided.
    // If newValue is not provided, we will not do anything, not even set the value to null. If the user
    // want to set the item to null, use deleteItem instead.
    if (newValue) {
        window.localStorage.setItem(key, JSON.stringify(newValue));
    }
};


export const deleteLocalStorageItem = (key: string) => {
    window.localStorage.removeItem(key);
};
