/* eslint-disable no-param-reassign */
/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */


export interface WebSocketEvent {
    readonly eventType: string;
    readonly eventData: unknown;
    readonly timestamp: string;
    readonly homeId: number;
    readonly originDeviceId: number;
    readonly originDeviceClass: string;
    readonly originDeviceIp: string;
    readonly originProjectKeyId?: string | undefined;
    readonly originProjectKeyName?: string | undefined;
}


export type WebSocketObserver = (event: WebSocketEvent)=> void;

export class WebSocketObservable {

    // The collection of all the observers
    private observers: Set<WebSocketObserver> = new Set<WebSocketObserver>();

    // The webSocket object assigned to this Observable
    private webSocket: WebSocket | undefined;

    public constructor (webSocket: WebSocket | undefined) {
        this.webSocket = webSocket;

        if (webSocket) {
            webSocket.onmessage = (event: MessageEvent<any>) => {
                try {
                    this.notifyAllObservers(JSON.parse(event.data) as WebSocketEvent);
                } catch (error) {
                    console.error(event);
                }
            };

            webSocket.onerror = (event) => {
                console.error(event);
            };
        }
    }

    public subscribe (observer: WebSocketObserver) {
        this.observers.add(observer);
    }

    public unsubscribe (observer: WebSocketObserver) {
        this.observers.delete(observer);
    }

    public notifyAllObservers (event: WebSocketEvent) {
        this.observers.forEach((observer: WebSocketObserver) => {
            observer(event);
        });
    }

    /**
     * Destroy the observable object when it is no longer needed. This will close the webSocket connection and remove all observers
     */
    public destroy () {
        try {
            if (this.webSocket) {
                this.webSocket.close();
            }
            this.observers.clear();
        } catch (error) {
            console.error(error);
        }
    }
}


/**
 * This interface for the params object that we can pass to the createWebSocket function
 */
export interface WebSocketParams {
    readonly homeId?: number | undefined;
    readonly deviceId?: number | undefined;

    // OPTIONAL token to use instead of the token already set in the WebSocketConnection instance
    readonly authToken?: string | undefined;

    // OPTIONAL path to use instead of the default path. This path MUST be a RELATIVE path excluding the baseUrl e.g. "/myCustom/path"
    // The WebSocketFactory will take care of prepending the baseUrl to the path e.g. "wss://api.tinkermode.com/myCustom/path"
    readonly path?: string | undefined;
}


/**
 * This is a WebSocket factory specifically created for MODE app. For creating web sockets connection to other back end services that is
 * NOT MODE, we need to use something else.
 */
export class WebSocketFactory {

    private static instance: WebSocketFactory | undefined;

    private baseUrl: string;

    // The authToken used for making API call.
    private authToken: string | undefined;

    /**
     * Set the auth token
     * @param token
     */
    public setAuthToken (authToken: string) {
        this.authToken = authToken;
    }


    /**
     * Clear the auth token
     */
    public clearAuthToken () {
        this.authToken = undefined;
    }


    /**
     * Create and return a WebSocket object based on the given params. This will return undefined if it is unable to create a Web Socket.
     * Use this function to create and get the raw JavaScript WebSocket object. When using this function, the caller must handle the
     * "onmessage" event and close the socket when it is no longer used. And the "event.data" from the "onmessage" event will not have any
     * structure. It will be a string and the caller must take care of converting the data string to the some other data structure.
     */
    public createWebSocket (
        params?: WebSocketParams | undefined,
    ): WebSocket | undefined {
        try {
            const searchParams = new URLSearchParams();
            if (params?.authToken) {
                // If custom authToken is provided then use the provided authToken
                searchParams.append('authToken', params.authToken);
            } else if (this.authToken) {
                // Else use the authToken already set in WebSocketConnection instance
                searchParams.append('authToken', this.authToken);
            }
            if (params?.homeId !== undefined) {
                searchParams.append('homeId', params.homeId.toString());
            }
            if (params?.deviceId !== undefined) {
                searchParams.append('deviceId', params.deviceId.toString());
            }

            const path = `${this.baseUrl}${params?.path ?? '/userSession/websocket'}`;
            const webSocket = new WebSocket(`${path}?${searchParams.toString()}`);
            return webSocket;
        } catch (error) {
            console.error(error);
        }

        return undefined;
    }


    /**
     * Create and return a WebSocket observable object. This function will not return the WebSocket object directly but will be returning
     * a WebSocketObservable object with the webSocket object inside. Use this when we need to create 1 WebSocket and share it with multiple
     * components. Each component can just call the observable.addObserver and pass it an object of type "WebSocketObserver"
     * interface.
     */
    public createObservableWebSocket (
        params?: WebSocketParams | undefined,
    ): WebSocketObservable {
        const webSocket = this.createWebSocket(params);
        const observable = new WebSocketObservable(webSocket);
        return observable;
    }



    // Initialize WebSocketConnection. This should only be called once.
    public static initialize (baseUrl: string, authToken?: string) {
        if (WebSocketFactory.instance) {
            // This error will stop the app so we can just use the default Error type
            throw new Error('WebSocketConnection.initialize has already been called.');
        }
        WebSocketFactory.instance = new WebSocketFactory(baseUrl, authToken);
    }


    public static getInstance (): WebSocketFactory {
        if (!WebSocketFactory.instance) {
            throw new Error('WebSocketConnection.initialize must be called before it can be used.');
        }
        return WebSocketFactory.instance;
    }


    private constructor (baseUrl: string, authToken?: string) {
        this.baseUrl = baseUrl;
        if (authToken) {
            this.authToken = authToken;
        }
    }
}
