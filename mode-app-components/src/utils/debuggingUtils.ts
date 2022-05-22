import {
    useEffect,
    useRef,
} from 'react';


/**
 * This hook is used for debugging dependencies. Many time we see a component re-render for no reason or we run into infinite loop and we
 * don't know why. This is usually because some of the states changed that we didn't expect. So, use this hook to temporary check which state
 * change is causing the unnecessarily re-render or infinite loop issue. To use this, add this hook anywhere in your component like this
 *
 *      // to monitor the 'myState' state. Give it a name 'My State Name' so that you can see the name of the state you are monitoring
 *      // in console.log. Name is not required.
 *      useDebuggerMonitorStateChange(myState1, 'My State1 Name');
 *      useDebuggerMonitorStateChange(myState2, 'My State2 Name');
 *
 * NOTE: remember to remove these after you are done debugging.
 *
 * @param obj
 * @param name
 */
export const useDebuggerMonitorStateChange = (obj: unknown, name?: string) => {
    const counterRef = useRef<number>(0);

    useEffect(() => {
        counterRef.current += 1;

        // eslint-disable-next-line no-console
        console.log(`'${name || 'Object'}' changed ${counterRef.current} times`);
    }, [name, obj]);
};
