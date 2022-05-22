# About mode-ui-state Module
This module was created to help developers add some common UI feature for their React apps e.g. show loading spinner, show notifications/alerts,
show dialogs, show drawer menu, etc... without having to implement everything from scratch.

Almost every app needs to display alert/notifications, dialog, loading spinner. It is not difficult to implement these features, it just takes time
to set these up and it takes even more time to implement them the right way by making them reusable so that we don't have to copy and paste the
code in multiple places. Therefore, this module is created to provide the framework to implement these features. Note that this module only provides
a way to create or manage these UI features but does not provide the actual UI. The developer will need to implement the UI.

This module adopts the Flux architecture to implement the framework for creating common UI features. The way this module work is that it provides
a `Global` state of the UI such as whether or not the app is loading, showing notification, showing dialog, etc... The App components can subscribe
to this Global state and update the UI accordingly. For example: An Alert/Notification component can subscribe to the alert/notification part of
the global state and show/hide alert accordingly. Same for Loading component, Dialog component, etc... And then for any component that need to show
alert, loading, dialog, they can just dispatch one of the actions provided by the framework. The action will take care of updating the state which
will then trigger an event to notify the state subscribers, Alert Components, Dialog Component, to update the UI. 

# Requirements
This module is only to be used with React apps. This module does not provide any UI but it does depends on some of React's hooks such as useContext
and useReducer.
