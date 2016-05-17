# Release notes

## 2.0.2

Removed trailing commas and fixed jscs config/npm lint script.

## 2.0.1

Updated jschannel to use v1.0.1 from https://github.com/nls-oskari/jschannel.git. Jschannel v1.0.1 version fixes errors when sending more than one parameter with null values.

## 2.0.0

Requires Oskari version 1.35.0 or greater due to JSChannel update.

- Added JSChannel as dependency in package.json: https://github.com/yochannah/jschannel.git#f2bcb860911d36ccbc3fabd4a09f7074dd9f289e
- Wrapped OskariRPC.js with UMD pattern https://github.com/umdjs/umd
- OskariRPC.VERSION now returns the client version
- channel (from OskariRPC.connect()) now has getInfo(callback, errorcb)-function. This returns generic info about Oskari as callback parameter.
- channel (from OskariRPC.connect()) now has isSupported()-function. This returns a boolean value true if client is supported by Oskari-instance

This can be used to detect that Oskari version is the one you expect.
The developer could for example send a notification email to self for manually inspecting for any breaking API changes.

	channel.onReady(function() {
		channel.isSupported('1.35.0', function(blnSupported) {
			if(!blnSupported) {
				// Oskari instance is not the version you expect.
				// There might be breaking API changes, but RPC app can work
			}
		});

		channel.isSupported(function(blnSupported) {
			if(!blnSupported) {
				// fatal error - The running Oskari instance has notified that the
				// client version is NOT supported and RPC propably won't work
			}
		});
	});

## 1.1.0

Works with Oskari version 1.34.x or less.

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