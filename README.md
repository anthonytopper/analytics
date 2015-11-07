# Analytics

A basic web-based analytics engine
----------------------------------
Only one javascript import is needed, and reporting automatically begins once the page loads. 
Specific events can be tracked as well, such as an outgoing URL click event. Assign your own event ID, and trigger javascript to log it:
```javascipt
ts.analytics.track.outgoingEvent('EVENT_NAME','EVENT_URL');
```

Or for tracking all mouseovers and clicks on a DOM element, just use the property "tsan_id", and set it to whatever custom ID you want.
```HTML
<div tsan_id="ELEMENT_ID">
```

All mouse movements, by default, are recorded. The page view and interaction can then be "replayed" from admin reporting, found by hitting analytics.php
