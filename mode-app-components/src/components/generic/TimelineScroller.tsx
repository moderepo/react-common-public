/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
import React, {
    useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import {
    Icon, Button, makeStyles, Theme,
} from '@material-ui/core';
import clsx from 'clsx';
import {
    useDebouncedCallback,
} from 'use-debounce';
import Draggable, {
    DraggableEvent, DraggableData,
} from 'react-draggable';
import {
    Time,
} from '../../utils';


const useStyle = makeStyles((theme: Theme) => {
    const previewSizeLeft = 75;
    const knobWidth = 20;
    const knobHeight = 25;

    return {
        root: {
            width        : '100%',
            position     : 'relative',
            overflow     : 'hidden',
            background   : theme.palette.background.paper,
            userSelect   : 'none',
            display      : 'flex',
            alignItems   : 'center',
            flexDirection: 'row',

            '&.data-size': {
                '& $selectionMarkersBar': {
                    paddingRight: '15%',
                },
                '& $scroller': {
                    paddingRight: '15%',
                },
            },

            '& .react-draggable': {
                cursor                      : 'grab',
                '&.react-draggable-dragging': {
                    cursor: 'grabbing',
                },
            },
        },

        scrollerSection: {
            flex : 1,
            width: '100%',
        },

        selectionMarkersBar: {
            width       : '100%',
            paddingLeft : previewSizeLeft,
            paddingRight: previewSizeLeft,
        },

        selectionMarkers: {
            width   : '100%',
            position: 'relative',
        },

        selectionMarker: {
            color    : theme.palette.text.primary,
            position : 'absolute',
            display  : 'inline-block',
            textAlign: 'center',
            transform: 'translateX(-50%)',

            '&.dummy': {
                left      : '50%',
                position  : 'relative',
                visibility: 'hidden',
            },

            '& .timestamp': {
                display      : 'block',
                fontSize     : 'small',
                fontWeight   : 500,
                color        : theme.palette.text.secondary,
                whiteSpace   : 'nowrap',
                padding      : '2px 5px',
                '&.clickable': {
                    cursor   : 'pointer',
                    '&:hover': {
                        background: theme.palette.action.hover,
                    },
                    '&:active': {
                        background: theme.palette.action.selected,
                    },
                },
            },
            '& .pointer': {
                display    : 'inline-block',
                width      : 20,
                height     : 10,
                zIndex     : 1,
                position   : 'relative',
                borderLeft : '10px solid transparent',
                borderRight: '10px solid transparent',
                '&.top'    : {
                    borderTop   : `10px solid ${theme.palette.text.primary}`,
                    marginBottom: 2,
                },
                '&.bottom': {
                    borderBottom: `10px solid ${theme.palette.text.primary}`,
                    marginTop   : 2,
                },
            },

            '&.start-time': {

            },

            '&.end-time': {

            },

            '&.cursor-time': {
                '& .timestamp': {
                    background  : 'rgba(0, 0, 0, 0.7)',
                    color       : theme.palette.text.primary,
                    borderRadius: 4,
                },
            },
        },


        scroller: {
            width        : '100%',
            paddingLeft  : previewSizeLeft,
            paddingRight : previewSizeLeft,
            position     : 'relative',
            display      : 'flex',
            alignItems   : 'center',
            flexDirection: 'row',
        },

        scrollerTimelineContainer: {
            height  : '100%',
            position: 'relative',
            zIndex  : 0,
            flex    : 1,
        },

        scrollerTimelineContainerBorder: {
            border       : '1px solid #eeeeee',
            position     : 'absolute',
            top          : 0,
            width        : '100%',
            height       : '100%',
            pointerEvents: 'none',
        },

        scrollerTimelineWrapper: {
            overflow: 'hidden',
            width   : '100%',
            height  : '100%',
        },

        scrollerTimeline: {
            width        : '100%',
            height       : '100%',
            minHeight    : 40,
            background   : 'linear-gradient(to bottom, #fefefe 0%, #cccccc 100%)',
            position     : 'relative',
            borderRadius : 2,
            paddingBottom: 3,
            zIndex       : 0,
        },

        scrollerTicksContainer: {
            width        : '100%',
            color        : theme.palette.text.primary,
            display      : 'flex',
            flexDirection: 'row',
            alignItems   : 'flex-start',
            pointerEvents: 'none',
            position     : 'relative',
            borderTop    : '2px solid #bbbbbb',
        },

        tickMark: {
            height    : 10,
            width     : 1,
            borderLeft: '1px solid #bbbbbb',
            display   : 'inline-block',
            position  : 'absolute',
        },

        scrollerTicksLabelContainer: {
            width     : '100%',
            fontSize  : 'smaller',
            color     : theme.palette.text.secondary,
            paddingTop: 2,
        },

        scrollerPreview: {
            alignItems   : 'center',
            height       : '100%',
            zIndex       : 1,
            opacity      : 0.6,
            pointerEvents: 'none',
            position     : 'absolute',
            top          : 0,
            userSelect   : 'none',
            display      : 'flex',
            '&.left'     : {
                left      : 0,
                marginLeft: 5,
            },
            '&.right': {
                right      : 0,
                marginRight: 5,
            },
            '& .icon': {
                color  : theme.palette.text.secondary,
                opacity: 0.5,
            },
        },

        cursor: {
            pointerEvents: 'none',
            height       : '100%',
            width        : 0,
            borderLeft   : `1px dashed ${theme.palette.text.primary}`,
            zIndex       : 2,
            position     : 'absolute',
            left         : '50%',
            top          : 0,
        },

        selectionAreaBG: {
            height    : '100%',
            background: `
                linear-gradient(
                    to bottom, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%,
                    ${theme.palette.primary.dark} 51%, ${theme.palette.primary.light} 100%
                )
            `,
            boxShadow   : '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
            opacity     : 0.6,
            borderRadius: 4,
            border      : '1px solid #c9e4f8',
            zIndex      : 1,
            position    : 'absolute',
            top         : 0,
        },

        selectionAreaKnob: {
            position      : 'absolute',
            top           : '50%',
            marginTop     : -knobHeight / 2,
            transform     : 'translateY(-50%)',
            width         : 'auto',
            height        : knobHeight,
            padding       : 0,
            minWidth      : 'unset',
            minHeight     : 'unset',
            zIndex        : 2,
            borderRadius  : 6,
            background    : theme.palette.grey[200],
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            boxShadow     : '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
            marginLeft    : -knobWidth / 2,

            '& .icon': {
                transform    : 'rotateZ(90deg)',
                color        : theme.palette.text.primary,
                width        : knobWidth,
                fontSize     : knobWidth,
                pointerEvents: 'none',
            },
            '&.left': {
                transform: 'translate3d(-50%, -50%, 0)',
            },
            '&.right': {
                transform: 'translate3d(50%, -50%, 0)',
            },
        },

        zoomControls: {
            display       : 'flex',
            flexDirection : 'column',
            alignItems    : 'center',
            justifyContent: 'center',
            color         : theme.palette.text.primary,
            paddingTop    : 5,

            '& .zoom-value': {
                fontWeight: 500,
                margin    : theme.spacing(0, 1),
            },

            '& .button': {
                minWidth: 'unset',
                margin  : 1,

                '& .MuiButton-startIcon': {
                    margin: 0,
                },
            },
        },

        zoomCurrentValue: {
            display   : 'flex',
            alignItems: 'center',
            alignSelf : 'center',
            margin    : theme.spacing(1, 0),
        },
    };
});


const ZOOM_LEVEL_PER_INTERVAL = 60 * 60 * 24 * 1000;     // 1 zoom level per hour
export const DEFAULT_DATE_FORMAT_OPTIONS = Object.freeze({
    DEFAULT: {
        year  : 'numeric',
        month : 'short',
        day   : '2-digit',
        hour  : '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    } as Intl.DateTimeFormatOptions,
    LONG: {
        year  : 'numeric',
        month : '2-digit',
        day   : '2-digit',
        hour  : '2-digit',
        minute: '2-digit',
        hour12: false,
    } as Intl.DateTimeFormatOptions,
    MEDIUM: {
        year  : 'numeric',
        month : '2-digit',
        day   : '2-digit',
        hour12: false,
    } as Intl.DateTimeFormatOptions,
    SHORT: {
        year  : 'numeric',
        month : '2-digit',
        hour12: false,
    },
});


export enum SelectionIntervalType {
    TIME_RANGE = 'time-range',
    DATA_SIZE = 'data-size',
}

const DEFAULT_MIN_DATA_SIZE = 10;
const DEFAULT_MAX_DATA_SIZE = 100;
const MAX_DATA_SIZE_IN_PERCENT = 15;


/**
 * Custom hook to listen to window resize event and return the window's width
 */
const useWindowSize = () => {
    const [windowWidth, setWindowWidth] = useState(0);

    /**
     * On window resize we need to update the scroller selection area, knobs, ticks, etc... but we don't want to do it each time
     * the window is resized. We can wait until the user stop resizing and then update those values. We will use this debounce to
     * debounce the event until the user stop resizing for 500 ms.
     */
    const onWindowResizeDebounce = useDebouncedCallback(
        (windowWidth: number) => {
            setWindowWidth(windowWidth);
        }, 100,
    );

    useEffect(() => {
        const onResize = () => {
            onWindowResizeDebounce(window.innerWidth);
        };
        window.addEventListener('resize', onResize);
        onResize();

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [onWindowResizeDebounce]);

    return windowWidth;
};


/**
 * absoluteStartTime - The timestamp of the VERY FIRST data point
 * absoluteEndTime - The timestamp of the VERY LAST data point
 * currentTime - The center of the view
 * selectionInterval - The interval/length of the selection in Milliseconds
 */
export interface TimelineScrollerProps {
    readonly className?: string;
    readonly absoluteStartTime: number;
    readonly absoluteEndTime: number;
    readonly selectionIntervalType: SelectionIntervalType;
    readonly selectionStartTime: number;
    readonly selectionInterval: number;
    readonly minDataSize?: number;              // Only used if selectionIntervalType is DATA_SIZE
    readonly maxDataSize?: number;

    readonly locale?: string | undefined;
    readonly dateFormat?: Intl.DateTimeFormatOptions | undefined;

    readonly eventDebounceDelay?: number;
    readonly onZoomLevelChange?: (level: number)=> void
    readonly onZoomLevelChangeCompleted?: (level: number)=> void
    readonly onSelectionChange?: (startTime: number, interval: number)=> void
    readonly onSelectionChangeCompleted?: (startTime: number, interval: number)=> void
    readonly onPickStartTime?: (minStartTime: number, maxStartTime: number)=> void;

    // Only either one of these event handler is needed depending what type of selection is being used. If selectionIntervalType
    // is TIME_RANGE then 'onPickEndTime' will be called when the user click on the endTime display. If selectionIntervalType is
    // DATA_SIZE then onPickSelectionInterval will be called when the user click on the data size button
    readonly onPickEndTime?: (minEndTime: number, maxEndTime: number)=> void;
    readonly onPickSelectionInterval?: (interval: number)=> void;
}


export const TimelineScroller: React.FC<TimelineScrollerProps> = (props: TimelineScrollerProps) => {

    const { onZoomLevelChange } = props;
    const { onZoomLevelChangeCompleted } = props;
    const { onSelectionChange } = props;
    const { onSelectionChangeCompleted } = props;

    /* Initialize states that don't change */
    // Get props.absoluteStartTime but make sure it is greater than or equal to 0
    const absoluteStartTime = useMemo(() => {
        return Math.max(0, props.absoluteStartTime);
    }, [props.absoluteStartTime]);

    // Get props.absoluteEndTime but make sure it is greater than absoluteStarTime
    const absoluteEndTime = useMemo(() => {
        return Math.max(props.absoluteEndTime, absoluteStartTime + 1);
    }, [props.absoluteEndTime, absoluteStartTime]);

    // Get the absolute interval between absoluteStartTime and absoluteEndTime
    const absoluteInterval = useMemo(() => {
        return absoluteEndTime - absoluteStartTime;
    }, [absoluteEndTime, absoluteStartTime]);

    // Base on the absolute interval, calculate the MAX zoom level we will allow. We will allow 1 zoom level per hour up to 100 max
    // So, if the data range is 1 hour, there won't be any zoom allowed. If the data range is 1 day, the user can zoom up to 24x
    const maxZoomLevel = useMemo(() => {
        return Math.min(100, Math.max(1, Math.round(absoluteInterval / ZOOM_LEVEL_PER_INTERVAL)));
    }, [absoluteInterval]);

    const minDataSize = useMemo(() => {
        return props.minDataSize !== undefined ? Math.max(1, props.minDataSize) : DEFAULT_MIN_DATA_SIZE;
    }, [props.minDataSize]);

    const maxDataSize = useMemo(() => {
        return props.maxDataSize !== undefined ? Math.min(1000, props.maxDataSize) : DEFAULT_MAX_DATA_SIZE;
    }, [props.maxDataSize]);

    // We don't need windowWidth but we need to window resize event so that we can update the scroller accordingly
    const windowWidth = useWindowSize();

    /* Initialize states that can change base on user input */
    // The current zoomLevel state. Initialize it with the props.zoomLevel and this state can be changed by the user action.
    const [zoomLevel, setZoomLevel] = useState<number>(1);

    // The amount the timeline is shifted to the left in milliseconds. It will start with 0 and it will change as the user zoom and pan the timeline
    const [timelineShiftAmountInMS, setTimelineShiftAmountInMS] = useState<number>(0);

    const [selectionStartTime, setSelectionStartTime] = useState<number>(
        Math.max(absoluteStartTime, Math.min(absoluteEndTime - 1, props.selectionStartTime)),
    );


    
    const [selectionInterval, setSelectionInterval] = useState<number>(
        props.selectionIntervalType === SelectionIntervalType.TIME_RANGE
            ? Math.min(absoluteEndTime - selectionStartTime, Math.max(0, props.selectionInterval))
            : Math.max(minDataSize, Math.min(maxDataSize, props.selectionInterval)),
    );

    /**
     * This useEffect is used for monitoring the props.selectionStartTime and update the local selectionStartTime state. This
     * props.selectionStartTime can be changed anytime
     */
    useEffect(() => {
        const newStartTime = Math.max(absoluteStartTime, Math.min(absoluteEndTime - 1, props.selectionStartTime));
        setSelectionStartTime(newStartTime);
    
        // If interval type is TimeRange, we need too make sure setting newStartTime does not go over the bound
        if (props.selectionIntervalType === SelectionIntervalType.TIME_RANGE) {
            setSelectionInterval((currentValue) => {
                return Math.min(absoluteEndTime - newStartTime, currentValue);
            });
        }
    }, [setSelectionStartTime, props.selectionStartTime, absoluteStartTime, absoluteEndTime, props.selectionIntervalType]);


    /**
     * This useEffect is used for monitoring the props.selectionInterval and update the local selectionInterval state. This
     * props.selectionInterval can be changed anytime
     */
    useEffect(() => {
        const newSelectionInterval = props.selectionIntervalType === SelectionIntervalType.TIME_RANGE
            ? Math.max(1, props.selectionInterval)
            : Math.max(minDataSize, Math.min(maxDataSize, props.selectionInterval));

        setSelectionInterval(newSelectionInterval);
    }, [setSelectionInterval, props.selectionInterval, minDataSize, props.selectionIntervalType, maxDataSize]);


    // The location of the cursor in milliseconds. It will start with 0 and it will change as the user move the mouse pointer over the scroll bar
    const [cursorInMS, setCursorInMS] = useState<number | undefined>();


    // The mouse wheel event will trigger the zoom level change and it can trigger 1 event per wheel click. If the user roll the wheel quickly,
    // this can cause multiple events. So we need to debounce the event and only dispatch onZoomLevelChange event to the container when the
    // user stop scrolling the wheel so that it doesn't dispatch multiple events.
    const onZoomLevelChangeDebounce = useDebouncedCallback(
        (zoomLevel: number) => {
            if (onZoomLevelChangeCompleted) {
                onZoomLevelChangeCompleted(zoomLevel);
            }
        }, props.eventDebounceDelay !== undefined && props.eventDebounceDelay > 0 ? props.eventDebounceDelay : 500,
    );

    /**
     * We also need to use debounce to dispatch onSelectionChange event so that we don't send multiple events when the
     * user change the range quickly
     */
    const onSelectionChangeDebounce = useDebouncedCallback(
        (startTime: number, interval: number) => {
            if (onSelectionChangeCompleted) {
                onSelectionChangeCompleted(startTime, interval);
            }
        }, props.eventDebounceDelay !== undefined && props.eventDebounceDelay > 0 ? props.eventDebounceDelay : 500,
    );


    const scrollerRef = useRef<HTMLDivElement | null>(null);
    const timelineRef = useRef<HTMLDivElement | null>(null);
    const selectionAreaRef = useRef<HTMLDivElement | null>(null);
    const leftResizerRef = useRef<HTMLDivElement | null>(null);
    const rightResizerRef = useRef<HTMLDivElement | null>(null);


    // Convert all values from MS to pixels
    const {
        timelineShiftInPixel, selectionIntervalInPixel, selectionStartTimeInPercent, selectionStartTimeInPixel, selectionEndTimeInPixel,
        maxTimelineShiftAmountInMS, cursorInPixel,
    } = useMemo(() => {

        const scrollerWidth = scrollerRef.current ? scrollerRef.current.getBoundingClientRect().width : 1;

        // Find the maximum amount the timeline can be shifted to the left. The timeline can only be shifted when it is zoomed in.
        // If the zoom level is 3x, the maximum the timeline can be shifted is 2/3 of the absoluteInterval
        const maxTimelineShiftAmountInMS = Math.round(absoluteInterval - (absoluteInterval / zoomLevel));

        // Calculate the timelineShift amount in %
        const timelineShiftInPercent = (timelineShiftAmountInMS / absoluteInterval) * 100.0 * zoomLevel;
        const timelineShiftInPixel = Math.round((timelineShiftInPercent / 100) * scrollerWidth);

        // Calculate selectionStartTime in percent. Also make sure selectionStartTime is in bounds
        const selectionStartTimeInPercent = Math.max(
            0, ((selectionStartTime - absoluteStartTime - timelineShiftAmountInMS) / absoluteInterval) * 100.0 * zoomLevel,
        );

        const selectionStartTimeInPixel = Math.round((selectionStartTimeInPercent / 100) * scrollerWidth);


        // Calculate selectionInterval in percent. Also make sure the selection interval is in bounds
        const adjustedSelectionInterval = props.selectionIntervalType === SelectionIntervalType.TIME_RANGE
            ? Math.min(absoluteInterval, selectionInterval)
            : Math.min(maxDataSize, Math.max(minDataSize, selectionInterval));

        const selectionIntervalInPercent = props.selectionIntervalType === SelectionIntervalType.TIME_RANGE
            ? (adjustedSelectionInterval / absoluteInterval) * 100 * zoomLevel
            : (adjustedSelectionInterval / maxDataSize) * MAX_DATA_SIZE_IN_PERCENT;       // maximum use 20% of the bar

        const selectionIntervalInPixel = Math.round((selectionIntervalInPercent / 100) * scrollerWidth);

        const selectionEndTimeInPercent = selectionStartTimeInPercent + selectionIntervalInPercent;
        const selectionEndTimeInPixel = Math.round((selectionEndTimeInPercent / 100) * scrollerWidth);


        const cursorInPercent = cursorInMS ? ((cursorInMS - absoluteStartTime - timelineShiftAmountInMS) / absoluteInterval) * 100.0 * zoomLevel : 0;
        const cursorInPixel = Math.round((cursorInPercent / 100) * scrollerWidth);

        return {
            maxTimelineShiftAmountInMS,
            timelineShiftInPixel,
            selectionStartTimeInPercent,
            selectionStartTimeInPixel,
            selectionIntervalInPixel,
            selectionEndTimeInPixel,
            cursorInPixel,
            windowWidth,
        };
    }, [zoomLevel, timelineShiftAmountInMS, selectionInterval, selectionStartTime, absoluteStartTime, absoluteInterval, minDataSize,
        maxDataSize, props.selectionIntervalType, cursorInMS, windowWidth]);



    const classes = useStyle();


    const [dragState, setDragState] = useState<{
        readonly target: EventTarget;
        readonly startX: number;
        readonly scrollerWidth: number;
        readonly timelineShiftAmountInMS: number;
        readonly selectionStartTime: number;
        readonly selectionInterval: number;
    } | undefined>();

    const [isShowingCursor, setIsShowingCursor] = useState<boolean>();

    const initialized = useRef<boolean>(false);


    /**
     * This useEffect is used for listening to zoomLevel and call the onZoomLevelChange callback
     * NOTE: the callback will be called as soon as the user change the zoom level which can be a lot. So if the container only care when the
     * user is done changing the zoom level then the container can listen to the onZoomLevelChangeCompleted event instead.
     */
    useEffect(() => {
        if (onZoomLevelChange && initialized.current) {
            onZoomLevelChange(zoomLevel);
        }
    }, [onZoomLevelChange, zoomLevel]);


    /**
     * This useEffect is used for listening to selectionStartTime and selectionInterval and call the onSelectionChange callback.
     * NOTE: the callback will be called as soon as the user change the interval which can be a lot. So if the container only care when the
     * user is done changing the selection thn the container can listen to the onSelectionChangeCompleted event instead.
     */
    useEffect(() => {
        if (onSelectionChange && initialized.current) {
            onSelectionChange(selectionStartTime, selectionInterval);
        }
    }, [onSelectionChange, selectionStartTime, selectionInterval]);


    /**
     * This useEffect is used for listening to zoomLevel and call the onZoomLevelChangeDebounce to debounce the event after
     * some time later.
     */
    useEffect(() => {
        if (initialized.current) {
            onZoomLevelChangeDebounce(zoomLevel);
        }
    }, [onZoomLevelChangeDebounce, zoomLevel]);

    /**
     * This useEffect is used for listening to selectionStartTime and call the onSelectionStartChangeDebounce to debounce the event after
     * some time later.
     */
    useEffect(() => {
        if (initialized.current && !dragState) {
            onSelectionChangeDebounce(selectionStartTime, selectionInterval);
        }
    }, [selectionStartTime, selectionInterval, onSelectionChangeDebounce, dragState]);


    /**
     * Update timeline position based on the current drag event
     */
    const onUpdateTimelinePosition = useCallback((event: DraggableEvent, data: DraggableData) => {
        if (dragState && timelineRef.current) {
            const bounds = timelineRef.current.getBoundingClientRect();

            // Find out how much the mouse moved in % relative to the timeline
            const diffX = data.x - dragState.startX;
            const diffXInPercent = (diffX / bounds.width);

            // Convert that diffXInPercent to timestamp base on the absoluteInterval. So if the user shifted 20% pixel wise, we will shift
            // timelineStartTime by 20% of the absoluteInterval as well
            const shiftedAmountInMS = Math.round(diffXInPercent * absoluteInterval);


            // Calculate the new timelineShiftAmount by adding the shiftedAmountInMS to the previous shift amount
            const newTimelineShiftAmountInMS = Math.max(
                0, Math.min(maxTimelineShiftAmountInMS, dragState.timelineShiftAmountInMS - shiftedAmountInMS),
            );

            // However, it is sometime NOT possible to shift the timeline by shiftedAmountInMS because it might goes out of bounds
            // so we need to find the actual shift amount that the timeline shifted
            const actualShiftAmountInMS = newTimelineShiftAmountInMS - dragState.timelineShiftAmountInMS;

            setTimelineShiftAmountInMS(newTimelineShiftAmountInMS);

            // When we change the timelineStartTime, we also need to adjust the selectionStartTime to make sure the selection area stay in place
            // So if we shift the timelineStartTime by 100 seconds to the left, we need to shift the selectionStartTime by 100 seconds to the right
            setSelectionStartTime(dragState.selectionStartTime + actualShiftAmountInMS);
        }
    }, [dragState, absoluteInterval, maxTimelineShiftAmountInMS]);



    /**
     * Update selectionArea based on the current drag event
     */
    const onUpdateSelectionPosition = useCallback((event: DraggableEvent, data: DraggableData) => {
        if (dragState && timelineRef.current) {
            const bounds = timelineRef.current.getBoundingClientRect();

            // Find out how much the mouse moved in % relative to the timeline
            const diffX = data.x - dragState.startX;
            const diffXInPercent = (diffX / bounds.width);

            // Convert that diffXInPercent to timestamp base on the absoluteInterval. So if the user shifted 20% pixel wise, we will shift
            // timelineStartTime by 20% of the absoluteInterval as well
            const shiftedAmountInMS = (diffXInPercent * absoluteInterval);

            // The newSelectionStartTime will be the current selectionStartTime + shifted amount
            const newSelectionStartTimeInMS = dragState.selectionStartTime + shiftedAmountInMS;

            // However, newSelectionStartTime might go out of bounds when added with shiftedAmountInMS so we need to keep it within min/max values
            const actualNewSelectionStartTimeInMS = props.selectionIntervalType === SelectionIntervalType.TIME_RANGE
                ? Math.round(Math.max(
                    absoluteStartTime + timelineShiftAmountInMS,
                    Math.min(
                        absoluteStartTime + timelineShiftAmountInMS + (absoluteInterval / zoomLevel) - dragState.selectionInterval,
                        newSelectionStartTimeInMS,
                    ),
                ))
                : Math.round(Math.max(
                    absoluteStartTime + timelineShiftAmountInMS,
                    Math.min(
                        (absoluteInterval / zoomLevel) + timelineShiftAmountInMS + absoluteStartTime,
                        newSelectionStartTimeInMS,
                    ),
                ));

            setSelectionStartTime(actualNewSelectionStartTimeInMS);
        }
    }, [dragState, absoluteInterval, absoluteStartTime, timelineShiftAmountInMS, zoomLevel, props.selectionIntervalType]);


    /**
     * Update selectionArea based on the current drag event
     */
    const onUpdateSelectionSize = useCallback((event: DraggableEvent, data: DraggableData) => {
        event.stopPropagation();
        if (dragState && timelineRef.current) {
            const bounds = timelineRef.current.getBoundingClientRect();

            // Find out how much the mouse moved in % relative to the timeline
            const diffX = data.x - dragState.startX;
            const diffXInPercent = (diffX / bounds.width);

            // Convert that diffXInPercent to timestamp base on the absoluteInterval. So if the user shifted 20% pixel wise, we will shift
            // timelineStartTime by 20% of the absoluteInterval as well
            const shiftedAmountInMS = (diffXInPercent * absoluteInterval);

            if (dragState.target === leftResizerRef.current && props.selectionIntervalType === SelectionIntervalType.TIME_RANGE) {
                // the left resizer is being dragged so need to update the selectionStartTime AND selection interval
                // Calculate the new selectionStartTime by adding the shiftedAmountInMS to the previous startTime
                const newSelectionStartTimeInMS = Math.round(Math.max(
                    absoluteStartTime + timelineShiftAmountInMS,
                    dragState.selectionStartTime + shiftedAmountInMS,
                ));


                // make sure the newSelectionInterval is at least 1% pixel wise
                const newSelectionInterval = Math.round(dragState.selectionInterval + dragState.selectionStartTime - newSelectionStartTimeInMS);
                const selectionIntervalInPercent = (newSelectionInterval / absoluteInterval) * 100 * zoomLevel;
                if (selectionIntervalInPercent > 1) {
                    setSelectionStartTime(newSelectionStartTimeInMS);
                    setSelectionInterval(newSelectionInterval);
                }
            } else if (dragState.target === rightResizerRef.current) {

                // The right resizer is being dragged so need to update the selectionInterval
                if (props.selectionIntervalType === SelectionIntervalType.TIME_RANGE) {
                    const newSelectionInterval = Math.round(
                        Math.min(
                            (absoluteInterval / zoomLevel) - (dragState.selectionStartTime - absoluteStartTime - dragState.timelineShiftAmountInMS),
                            dragState.selectionInterval + shiftedAmountInMS,
                        ),
                    );

                    // make sure the newSelectionInterval is at least 1% pixel wise
                    const selectionIntervalInPercent = (newSelectionInterval / absoluteInterval) * 100 * zoomLevel;
                    if (selectionIntervalInPercent > 1) {
                        setSelectionInterval(newSelectionInterval);
                    }
                } else {
                    // increase the data size
                    const increasedAmount = ((diffXInPercent * 100.0) / MAX_DATA_SIZE_IN_PERCENT) * maxDataSize * zoomLevel;
                    const maxSelectionInterval = Math.min(
                        maxDataSize, (100.0 / MAX_DATA_SIZE_IN_PERCENT) * maxDataSize,
                    );

                    const newSelectionInterval = Math.round(
                        Math.max(minDataSize,
                            Math.min(
                                maxSelectionInterval,
                                dragState.selectionInterval + increasedAmount,
                            )),
                    );

                    setSelectionInterval(newSelectionInterval);
                }
            }

        }
    }, [dragState, absoluteInterval, absoluteStartTime, timelineShiftAmountInMS, zoomLevel, props.selectionIntervalType,
        maxDataSize, minDataSize]);



    /**
     * On drag start event handler for all draggable components. When drag start, we will save the current state of some of the props
     * in "dragState" so that we can get the data later in other drag events.
     */
    const onDragStart = useCallback((event: DraggableEvent, data: DraggableData) => {
        event.stopPropagation();
        if (event.target && scrollerRef.current) {

            const scrollerWidth = scrollerRef.current.getBoundingClientRect().width;
            setIsShowingCursor(false);
            setCursorInMS(undefined);
            setDragState({
                target: event.target,
                startX: data.x,
                scrollerWidth,
                timelineShiftAmountInMS,
                selectionStartTime,
                selectionInterval,
            });
        }
    }, [timelineShiftAmountInMS, selectionStartTime, selectionInterval]);


    /**
     * Event handler for when one of the draggable components is being dragged
     */
    const onDrag = useCallback((event: DraggableEvent, data: DraggableData) => {
        event.stopPropagation();

        if (dragState) {
            if (dragState.target === timelineRef.current) {
                onUpdateTimelinePosition(event, data);
            } else if (dragState.target === selectionAreaRef.current) {
                onUpdateSelectionPosition(event, data);
            } else if (dragState.target === leftResizerRef.current || dragState.target === rightResizerRef.current) {
                onUpdateSelectionSize(event, data);
            }
        }
    }, [onUpdateTimelinePosition, onUpdateSelectionPosition, onUpdateSelectionSize, dragState]);


    /**
     * Event handler for when one of the components is stopped being dragged
     */
    const onDragEnd = useCallback((event: DraggableEvent, data: DraggableData) => {
        event.stopPropagation();
        if (dragState) {
            if (dragState.target === timelineRef.current) {
                onUpdateTimelinePosition(event, data);
            } else if (dragState.target === selectionAreaRef.current) {
                onUpdateSelectionPosition(event, data);
            } else if (dragState.target === leftResizerRef.current || dragState.target === rightResizerRef.current) {
                onUpdateSelectionSize(event, data);
            }
            setDragState(undefined);
        }
    }, [onUpdateTimelinePosition, onUpdateSelectionPosition, onUpdateSelectionSize, dragState]);



    const onUpdateZoomLevel = useCallback((newZoomLevel: number) => {
        if (newZoomLevel <= 0 || newZoomLevel > maxZoomLevel) {
            return;
        }

        const zoomLevelChangeAmount = newZoomLevel / zoomLevel;

        setZoomLevel(newZoomLevel);
        const maxTimelineShiftAmountInMS = Math.round(absoluteInterval - (absoluteInterval / newZoomLevel));

        // When zoom change, we will also shift the timeline by some amount to keep the selection area stay in the same place
        // So we need to calculate how much we need to shift the timeline to the left so that the selectionStartTimeInPercent stay the same
        // The formula is the reverse of the formula which find the selectionStartTimeInPercent base on the selectionStartTime
        const newTimelineShiftAmountInMS = Math.max(0, Math.min(maxTimelineShiftAmountInMS, Math.round(
            selectionStartTime - absoluteStartTime - ((selectionStartTimeInPercent / (newZoomLevel * 100.0)) * absoluteInterval),
        )));
        setTimelineShiftAmountInMS(newTimelineShiftAmountInMS);

        if (props.selectionIntervalType === SelectionIntervalType.TIME_RANGE) {
            // when zoom level increase, we need to increase the selection interval the same percent to keep the selection area the same
            // So if zoom level increased by 2x, we will also increase the selectionInterval by 2x. If zoom level decreased by 1/2, we will also
            // decrease selectionInterval by 1/2
            const newSelectionInterval = Math.round(selectionInterval / zoomLevelChangeAmount);
            setSelectionInterval(newSelectionInterval);

            // if increasing selectionInterval case the selection area goes over absoluteEndTime, readjust the selectionStartTime accordingly
            if (selectionStartTime + newSelectionInterval > absoluteEndTime) {
                setSelectionStartTime(absoluteEndTime - newSelectionInterval);
            }
        }
    }, [zoomLevel, absoluteInterval, selectionInterval, selectionStartTimeInPercent, absoluteStartTime, selectionStartTime, absoluteEndTime,
        props.selectionIntervalType, maxZoomLevel]);


    /**
     * On MouseWheel even, we will scale up/down the timeline
     */
    const onMouseWheel = useCallback((event: React.WheelEvent<HTMLDivElement>) => {
        const diff = -Math.round(event.deltaY / Math.abs(event.deltaY));
        onUpdateZoomLevel(zoomLevel + diff);
        setIsShowingCursor(false);
        setCursorInMS(undefined);
    }, [zoomLevel, onUpdateZoomLevel]);



    /**
     * On mouse click on the timeline, we will automatically move the selection area to that position
     */
    const onMouseClickOnScroller = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        // get the X location of the mouse pointer relative to the target
        if (scrollerRef.current && event.currentTarget === scrollerRef.current && !dragState) {
            const bounds = scrollerRef.current.getBoundingClientRect();
            const xLoc = event.clientX - bounds.left;

            if (xLoc >= 0 && xLoc < bounds.width) {
                const xLocInPercent = xLoc / bounds.width;

                // convert xLoc to timestamp
                const newSelectionStartTimeInMS = Math.round(
                    ((xLocInPercent / zoomLevel) * absoluteInterval) + timelineShiftAmountInMS + absoluteStartTime,
                );

                // However, newSelectionStartTime might go out of bounds because the position moved so we need to keep it within min/max values
                const actualNewSelectionStartTimeInMS = props.selectionIntervalType === SelectionIntervalType.TIME_RANGE
                    ? Math.round(Math.max(
                        absoluteStartTime + timelineShiftAmountInMS,
                        Math.min(
                            absoluteStartTime + timelineShiftAmountInMS + (absoluteInterval / zoomLevel) - selectionInterval,
                            newSelectionStartTimeInMS,
                        ),
                    ))
                    : Math.round(Math.max(
                        absoluteStartTime + timelineShiftAmountInMS,
                        Math.min(
                            (absoluteInterval / zoomLevel) + timelineShiftAmountInMS + absoluteStartTime,
                            newSelectionStartTimeInMS,
                        ),
                    ));

                setSelectionStartTime(actualNewSelectionStartTimeInMS);
            }
        }
    }, [zoomLevel, absoluteInterval, timelineShiftAmountInMS, absoluteStartTime, selectionInterval, props.selectionIntervalType, dragState]);



    const onMouseMoveOverScroller = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
        setIsShowingCursor(true);
        const bounds = (event.currentTarget as HTMLDivElement).getBoundingClientRect();

        // get the X location of the mouse pointer relative to the target
        const xLoc = event.pageX - bounds.left;
        if (xLoc >= 0 && xLoc < bounds.width) {
            const xLocInPercent = xLoc / bounds.width;

            // convert xLoc to timestamp
            const newCursorInMS = Math.round(((xLocInPercent / zoomLevel) * absoluteInterval) + timelineShiftAmountInMS + absoluteStartTime);
            setCursorInMS(newCursorInMS);
        }
    }, [zoomLevel, absoluteInterval, timelineShiftAmountInMS, absoluteStartTime]);



    const formattedSelectionStartTime = useMemo(() => {
        return new Intl.DateTimeFormat(props.locale || 'en-US', props.dateFormat || DEFAULT_DATE_FORMAT_OPTIONS.DEFAULT).format(selectionStartTime);
    }, [selectionStartTime, props.locale, props.dateFormat]);


    const formattedSelectionEndValue = useMemo(() => {
        if (props.selectionIntervalType === SelectionIntervalType.TIME_RANGE) {
            return new Intl.DateTimeFormat(
                props.locale || 'en-US', props.dateFormat || DEFAULT_DATE_FORMAT_OPTIONS.DEFAULT,
            ).format(selectionStartTime + selectionInterval);
        }

        return selectionInterval;
    }, [selectionStartTime, selectionInterval, props.locale, props.dateFormat, props.selectionIntervalType]);


    const formattedCursorTime = useMemo(() => {
        return new Intl.DateTimeFormat(props.locale || 'en-US', props.dateFormat || DEFAULT_DATE_FORMAT_OPTIONS.DEFAULT).format(cursorInMS);
    }, [cursorInMS, props.locale, props.dateFormat]);



    /**
     * A flag to indicate if there is some timeline hidden on the left
     */
    const canScrollLeft = useMemo(() => {
        return zoomLevel > 1 && timelineShiftAmountInMS > 0;
    }, [zoomLevel, timelineShiftAmountInMS]);


    /**
     * A flag to indicate if there is some timeline hidden on the right
     */
    const canScrollRight = useMemo(() => {
        return zoomLevel > 1 && timelineShiftAmountInMS < (absoluteInterval / zoomLevel) * (zoomLevel - 1);
    }, [zoomLevel, timelineShiftAmountInMS, absoluteInterval]);


    /**
     * Create 1 ticket mark for each seconds/minute/hour depending on the interval and zoom
     */
    const tickMarks = useMemo((): readonly{
        readonly x: number;
    }[] => {
        const tickInterval = (() => {
            if (absoluteInterval <= Time.MINUTE_IN_MS * 10) {
                return Time.SECOND_IN_MS;
            }
            if (absoluteInterval <= Time.HOUR_IN_MS * 6) {
                return Time.MINUTE_IN_MS;
            }
            if (absoluteInterval <= Time.DAY_IN_MS * 10) {
                return Time.HOUR_IN_MS;
            }
            if (absoluteInterval <= Time.MONTH_IN_MS * 6) {
                return Time.DAY_IN_MS;
            }

            return Time.MONTH_IN_MS;
        })();

        const count = Math.min(20, Math.floor(absoluteInterval / tickInterval)) * zoomLevel;
        return (new Array(count)).fill(0).map((value: number, index: number) => {
            return {
                x: (index / count) * 100.0,
            };
        });

    }, [absoluteInterval, zoomLevel]);



    /**
     * Mark as initialized so that we can start dispatch events
     */
    useEffect(() => {
        initialized.current = true;
    }, []);



    return (
        <div className={clsx(classes.root, props.className, props.selectionIntervalType, props.selectionIntervalType)}>
            <div className={clsx(classes.scrollerSection)}>
                <div className={clsx(classes.selectionMarkersBar)}>
                    <div className={clsx(classes.selectionMarkers)}>
                        <div
                            className={clsx(classes.selectionMarker, 'dummy')}
                        >
                            <div className={clsx('timestamp')}>0</div>
                            <div className={clsx('pointer', 'top')} />
                        </div>
                        <div
                            className={clsx(classes.selectionMarker, 'start-time')}
                            style={{
                                left: `${selectionStartTimeInPixel}px`,
                            }}
                        >
                            <div
                                className={clsx('timestamp', props.onPickStartTime && 'clickable')}
                                onClick={() => {
                                    if (props.onPickStartTime) {
                                        props.onPickStartTime(
                                            absoluteStartTime + timelineShiftAmountInMS,
                                            props.selectionIntervalType === SelectionIntervalType.TIME_RANGE
                                                ? selectionStartTime + selectionInterval - 1
                                                : absoluteStartTime + timelineShiftAmountInMS + (absoluteInterval / zoomLevel),
                                        );
                                    }
                                }}
                            >
                                {formattedSelectionStartTime}
                            </div>
                            <div className={clsx('pointer', 'top')} />
                        </div>

                        {isShowingCursor && cursorInMS !== undefined && !dragState && (
                            <div
                                className={clsx(classes.selectionMarker, 'cursor-time')}
                                style={{
                                    left: `${cursorInPixel}px`,
                                }}
                            >
                                <div className={clsx('timestamp')}>{formattedCursorTime}</div>
                                <div className={clsx('pointer', 'top')} />
                            </div>
                        )}
                    </div>
                </div>

                <div className={clsx(classes.scroller)}>
                    <div
                        ref={scrollerRef}
                        className={clsx(classes.scrollerTimelineContainer)}
                        onMouseEnter={() => {
                            setIsShowingCursor(true);
                        }}
                        onMouseLeave={() => {
                            setIsShowingCursor(false);
                            setCursorInMS(undefined);
                        }}
                        onMouseMove={onMouseMoveOverScroller}
                        // onMouseUp={onMouseClickOnScroller}
                    >
                        <div
                            className={clsx(classes.scrollerTimelineWrapper)}
                        >
                            <Draggable
                                disabled={zoomLevel <= 1}
                                axis="x"
                                position={{
                                    x: -timelineShiftInPixel, y: 0,
                                }}
                                bounds={{
                                    left: -((dragState?.scrollerWidth || 1) * (zoomLevel - 1)), right: 0,
                                }}
                                onStart={onDragStart}
                                onDrag={onDrag}
                                onStop={onDragEnd}
                            >
                                <div
                                    ref={timelineRef}
                                    className={clsx(classes.scrollerTimeline, zoomLevel > 1 && 'draggable')}
                                    style={{
                                        width: `${zoomLevel * 100}%`,
                                    }}
                                    onWheel={onMouseWheel}
                                >
                                    <div className={clsx(classes.scrollerTicksContainer)}>
                                        {tickMarks.map((tickProps: {x: number}) => {
                                            return (
                                                <div
                                                    className={classes.tickMark}
                                                    key={tickProps.x}
                                                    style={{
                                                        left: `${tickProps.x}%`,
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className={clsx(classes.scrollerTicksLabelContainer)} />
                                </div>
                            </Draggable>
                        </div>
                        <div className={clsx(classes.scrollerTimelineContainerBorder)} />
                        {canScrollLeft && (
                            <div className={clsx(classes.scrollerPreview, 'left')}>
                                <Icon className="icon">swap_horiz</Icon>
                            </div>
                        )}
                        {canScrollRight && (
                            <div className={clsx(classes.scrollerPreview, 'right')}>
                                <Icon className="icon">swap_horiz</Icon>
                            </div>
                        )}

                        {isShowingCursor && cursorInMS !== undefined && !dragState && (
                            <div
                                className={classes.cursor}
                                style={{
                                    left: `${cursorInPixel}px`,
                                }}
                            />
                        )}

                        <Draggable
                            axis="x"
                            bounds={{
                                left : 0,
                                right: props.selectionIntervalType === SelectionIntervalType.TIME_RANGE
                                    ? (dragState?.scrollerWidth || 1) - selectionIntervalInPixel
                                    : dragState?.scrollerWidth || 1,
                            }}
                            position={{
                                x: selectionStartTimeInPixel, y: 0,
                            }}
                            onStart={onDragStart}
                            onDrag={onDrag}
                            onStop={onDragEnd}
                        >
                            <div
                                ref={selectionAreaRef}
                                className={clsx(classes.selectionAreaBG)}
                                style={{
                                    width: `${selectionIntervalInPixel}px`,
                                }}
                            />
                        </Draggable>

                        {props.selectionIntervalType === SelectionIntervalType.TIME_RANGE && (
                            <Draggable
                                axis="x"
                                bounds={{
                                    left: 0, right: selectionEndTimeInPixel,
                                }}
                                position={{
                                    x: selectionStartTimeInPixel, y: 0,
                                }}
                                onStart={onDragStart}
                                onDrag={onDrag}
                                onStop={onDragEnd}
                            >
                                <div
                                    ref={leftResizerRef}
                                    className={clsx(classes.selectionAreaKnob, 'left')}
                                >
                                    <Icon className="icon" fontSize="small">drag_handle</Icon>
                                </div>
                            </Draggable>
                        )}

                        <Draggable
                            axis="x"
                            bounds={{
                                left : selectionStartTimeInPixel,
                                right: props.selectionIntervalType === SelectionIntervalType.TIME_RANGE
                                    ? (dragState?.scrollerWidth || 1)
                                    : selectionStartTimeInPixel + ((MAX_DATA_SIZE_IN_PERCENT / 100) * (dragState?.scrollerWidth || 1)),
                            }}
                            position={{
                                x: selectionEndTimeInPixel, y: 0,
                            }}
                            onStart={onDragStart}
                            onDrag={onDrag}
                            onStop={onDragEnd}
                        >
                            <div
                                ref={rightResizerRef}
                                className={clsx(classes.selectionAreaKnob, 'right')}
                            >
                                <Icon className="icon" fontSize="small">drag_handle</Icon>
                            </div>
                        </Draggable>
                    </div>
                </div>

                <div className={clsx(classes.selectionMarkersBar)}>
                    <div className={clsx(classes.selectionMarkers)}>
                        <div
                            className={clsx(classes.selectionMarker, 'dummy')}
                        >
                            <div className={clsx('timestamp')}>0</div>
                            <div className={clsx('pointer', 'top')} />
                        </div>
                        <div
                            className={clsx(classes.selectionMarker, 'end-time')}
                            style={{
                                left: `${selectionEndTimeInPixel}px`,
                            }}
                        >
                            <div className={clsx('pointer', 'bottom')} />
                            <div
                                className={clsx('timestamp', (props.onPickEndTime || props.onPickSelectionInterval) && 'clickable')}
                                onClick={() => {
                                    if (props.selectionIntervalType === SelectionIntervalType.TIME_RANGE && props.onPickEndTime) {
                                        props.onPickEndTime(
                                            selectionStartTime + 1,
                                            absoluteStartTime + timelineShiftAmountInMS + (absoluteInterval / zoomLevel),
                                        );
                                    }
                                    if (props.selectionIntervalType === SelectionIntervalType.DATA_SIZE && props.onPickSelectionInterval) {
                                        props.onPickSelectionInterval(selectionInterval);
                                    }
                                }}
                            >
                                {formattedSelectionEndValue}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {maxZoomLevel > 1 && (
                <div className={clsx(classes.zoomControls)}>
                    <Button
                        className="button"
                        size="small"
                        disabled={zoomLevel >= maxZoomLevel}
                        color="primary"
                        variant="contained"
                        startIcon={<Icon className="icon">add</Icon>}
                        onClick={() => {
                            onUpdateZoomLevel(zoomLevel + 1);
                        }}
                    />
                    <div className={clsx(classes.zoomCurrentValue)}>
                        <Icon>search</Icon>
                        <div className={clsx('zoom-value')}>{zoomLevel}x</div>
                    </div>
                    <Button
                        className="button"
                        size="small"
                        disabled={zoomLevel <= 1}
                        color="primary"
                        variant="contained"
                        startIcon={<Icon className="icon">remove</Icon>}
                        onClick={() => {
                            onUpdateZoomLevel(zoomLevel - 1);
                        }}
                    />
                </div>
            )}
        </div>
    );
};
