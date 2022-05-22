/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */
export interface ModeWebSocketEvent {
    readonly eventType: string;
    readonly eventData: any;
    readonly timestamp: string;
    readonly homeId: number;
    readonly originDeviceId: number;
    readonly originDeviceClass: string;
    readonly originDeviceIp: string;
    readonly originProjectKeyId: string;
    readonly originProjectKeyName: string;
}


export interface WebSocketObserver {
    readonly onMessage: (event: ModeWebSocketEvent)=> void;
}


abstract class WebSocketObservable {
    private observers: Set<WebSocketObserver> = new Set<WebSocketObserver>();

    public addObserver (observer: WebSocketObserver) {
        this.observers.add(observer);
    }

    public removeObserver (observer: WebSocketObserver) {
        this.observers.delete(observer);
    }

    public notifyAllObservers (event: ModeWebSocketEvent) {
        this.observers.forEach((observer: WebSocketObserver) => {
            observer.onMessage(event);
        });
    }
}


export class WebSocketConnection extends WebSocketObservable {
    private static instance: WebSocketConnection;

    private baseUrl: string;

    private webSocket: WebSocket | undefined;


    public connect (authToken: string) {
        if (this.webSocket) {
            try {
                this.webSocket.close();
                this.webSocket = undefined;
            } catch (error) {
                // ignore error
            }
        }

        try {
            this.webSocket = new WebSocket(`${this.baseUrl}/userSession/websocket?authToken=${authToken}`);
            this.webSocket.onmessage = this.onMessageHandler;
        } catch (error) {
            console.error(error);
        }
    }

    private onMessageHandler (event: MessageEvent) {
        this.notifyAllObservers(event.data as ModeWebSocketEvent);
    }


    // Initialize WebSocketConnection. This should only be called once.
    public static initialize (baseUrl: string) {
        if (WebSocketConnection.instance) {
            // This error will stop the app so we can just use the default Error type
            throw new Error('WebSocketConnection.initialize has already been called.');
        }
        WebSocketConnection.instance = new WebSocketConnection(baseUrl);
    }


    public static getInstance (): WebSocketConnection {
        return WebSocketConnection.instance;
    }


    private constructor (baseUrl: string) {
        super();
        this.baseUrl = baseUrl;
    }
}
