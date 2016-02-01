# rpc-client

Client library for interacting with Oskari.org embedded maps

Builds on top of JSChannel fork from https://github.com/adtile/jschannel.

## Usage

### 1) Publish a map from an Oskari instance (oskari.org) like http://www.paikkatietoikkuna.fi. 

Publishing a map will give you an iframe html-fragment like this:

```html
	<iframe src="http://www.mydomain.com/idofpublishedmap"></iframe>
```

### 2) Add an id to the iframe-element and add it to your page with a script to load the rpc-client.js and to initialize the connection:

* rpc-client.min.js can be found in the dist-folder in this repository

```html
	<iframe id="map" src="http://www.mydomain.com/idofpublishedmap"></iframe>
	<script src="dist/rpc-client.min.js"></script>
	<script>
	// init connection
	var IFRAME_DOMAIN = "http://www.mydomain.com";
	var channel = OskariRPC.connect(document.getElementById('map'), IFRAME_DOMAIN);
	</script>
```

Notice that the value of IFRAME_DOMAIN must match the domain given when the map was published (ie. where you intend to use the map).

### 3) onReady-function is called when the connection to the map has been established successfully.

You can get additional information and check that the client version you are using is supported by the running Oskari-instance when connected:


```javascript
	channel.onReady(function() {
	    //channel is now ready and listening.
	    channel.log('Map is now listening');
	    var expectedOskariVersion = '1.35.0';
	    channel.isSupported(expectedOskariVersion, function(blnSupported) {
	        if(blnSupported) {
	            channel.log('Client is supported and Oskari version is ' + expectedOskariVersion);
	        } else {
	            channel.log('Oskari-instance is not the one we expect (' + expectedOskariVersion + ') or client not supported');
	            // getInfo can be used to get the current Oskari version
	            channel.getInfo(function(oskariInfo) {
	                channel.log('Current Oskari-instance reports version as: ', oskariInfo);
	            });
	        }
	    });
	    channel.isSupported(function(blnSupported) {
	        if(!blnSupported) {
	            channel.log('Oskari reported client version (' + OskariRPC.VERSION + ') is not supported.' +
	            'The client might work, but some features are not compatible.');
	        } else {
	            channel.log('Client is supported by Oskari.');
	        }
	    });
	});
```

### 4) After this you can start using the API.

You can check supported features in the Oskari-instance you are using:

```javascript
	channel.getSupportedEvents(function(supported) {
		channel.log('Supported events', supported);
	});

	channel.getSupportedRequests(function(supported) {
		channel.log('Supported requests', supported);
	});

	channel.getSupportedFunctions(function(supported) {
		channel.log('Supported functions', supported);
	});

	// supported functions can also be detected by
	if (typeof channel.getAllLayers === 'function') {
		channel.getAllLayers(function(layers) {
			channel.log('Available layers', layers);
		});
	}
```

* Events are used as notification of something that happened on the map like the user clicked the map, the map moved etc.
* Requests are used to command the map like move the viewport of the map to show certain location.
* Functions can be used to get information about the map like current bounding box or zoom level.

You can find the API documentation including an API changelog in https://github.com/nls-oskari/oskari/tree/develop/api.
Also more information can be found in oskari.org and http://oskari.org/examples/rpc-api/rpc_example.html

## npm support

You can also get the client as an npm dependency for you app with:

	npm install oskari-rpc --save

## Building the dist packages

1. Run `npm install`

2. Run `npm run build`

3. Find the updated `rpc-client.js` and `rpc-client.min.js` in `dist`-folder.
