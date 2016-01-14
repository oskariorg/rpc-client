# Release notes

## 1.1.0

- added onReady callback to detect when we have a successful connection
- removed hardcoded RPC-functions that might be disabled on Oskari instance - functions are now generated based on what's available in the Oskari platform the client connects to. This means you can be sure the map is listening if the client has it (after onReady-triggers).
 - added default errorhandler to make it clear when an error happens. Used when custom errorhandler is not specified.
 - added enableDebug(blnEnabled) to log some more info to console when enabled.
 - Changed handleEvent to enable multiple listeners.
 - handleEvent can no longer be used to unregister listener.
 - Added unregisterEventHandler() for unregistering listeners (previously done with handleEvent without giving listener function).
 - Added log() for debug logging without the need to check if window.console.log() exists
 - function-calls can now have parameters as first argument array to allow multiple (treated as a success callback instead if type is function)

 ## 1.0.0

 Initial version