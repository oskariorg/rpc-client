/**
 * Oskari RPC client
 * Version: 2.1.0
 */
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jschannel'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jschannel'));
    } else {
        // Browser globals (root is window)
        root.OskariRPC = factory(root.Channel);
    }
}(this, function (JSChannel) {

    'use strict';
    var rpcClientVersion = '2.1.0';
    return {
        VERSION: rpcClientVersion,
        connect: function (target, origin) {
            if (JSChannel === null || JSChannel === undefined) {
                throw new Error('JSChannel not found.');
            }

            if (target === null || target === undefined) {
                throw new TypeError('Missing target element.');
            }

            if (!target.contentWindow) {
                throw new TypeError('Target is missing contentWindow.');
            }

            if (origin === null || origin === undefined) {
                throw new TypeError('Missing origin.');
            }

            if (origin.indexOf('http') !== 0) {
                throw new TypeError('Invalid origin: ' + origin + '.');
            }

            var ready = false;
            var readyCallbacks = [];
            var isDebug = false;
            var RPC_API = {};

            /**
             * API
             * @param  {[type]} blnEnabled [description]
             * @return {[type]}            [description]
             */
            RPC_API.enableDebug = function (blnEnabled) {
                isDebug = !!blnEnabled;
            };

            RPC_API.log = function () {
                if (window.console && window.console.log) {
                    window.console.log.apply(window.console, arguments);
                }
            };

            var defaultErrorHandler = function () {
                RPC_API.log('Error', arguments);
                throw new Error('RPC call failed!');
            };

            RPC_API.isReady = function () {
                return ready;
            };

            RPC_API.onReady = function (cb) {
                if (typeof cb !== 'function') {
                    // not a function
                    return;
                }

                if (ready) {
                    // if ready before adding the listener
                    // -> don't store reference/trigger callback immediately
                    cb();
                } else {
                    // otherwise save reference so we can call it when done
                    readyCallbacks.push(cb);
                }
            };

            RPC_API.destroy = function () {
                channel.destroy();
            };

            var eventHandlers = {};
            /**
             * @public @method handleEvent
             *
             * @param {string}   eventName   Event name
             * @param {function} success Callback function
             */
            RPC_API.handleEvent = function (eventName, handler) {
                if (!eventName) {
                    throw new Error('Event name not specified');
                }

                if (typeof handler !== 'function') {
                    throw new Error('Handler is not a function');
                }

                if (!eventHandlers[eventName]) {
                    eventHandlers[eventName] = [];
                }

                eventHandlers[eventName].push(handler);
                if (eventHandlers[eventName].length !== 1) {
                    // not the first one so we are already listening to the event
                    return;
                }

                // first one, bind listening to it
                channel.bind(eventName, function (trans, data) {
                    // loop eventHandlers[eventName] and call handlers
                    var handlers = eventHandlers[eventName];
                    for (var i = 0; i < handlers.length; ++i) {
                        handlers[i](data);
                    }
                });

                // Listen to event
                channel.call({
                    method: 'handleEvent',
                    params: [eventName, true],
                    success: function () { return undefined; },

                    error: defaultErrorHandler
                });
            };

            RPC_API.unregisterEventHandler = function (eventName, handler) {
                if (!eventName) {
                    throw new Error('Event name not specified');
                }

                var handlers = eventHandlers[eventName];
                if (!handlers || !handlers.length) {
                    if (window.console && window.console.log) {
                        console.log('Trying to unregister listener, but there are none for event: ' + eventName);
                    }

                    return;
                }

                var remainingHandlers = [];
                for (var i = 0; i < handlers.length; ++i) {
                    if (handlers[i] !== handler) {
                        remainingHandlers.push(handlers[i]);
                    }
                }

                eventHandlers[eventName] = remainingHandlers;

                // if last handler ->
                if (!remainingHandlers.length) {
                    channel.unbind(eventName);

                    // unregister listening to event
                    channel.call({
                        method: 'handleEvent',
                        params: [eventName, false],
                        success: function () { return undefined; },

                        error: defaultErrorHandler
                    });
                }
            };

            /**
             * @public @method postRequest
             *
             * @param {string}   request Request name
             * @param {Any[]}       params  Request params
             * @param {function} error   Error handler
             *
             */
            RPC_API.postRequest = function (request, params, error) {
                channel.call({
                    method: 'postRequest',
                    params: [request, params],
                    success: function () { return undefined; },

                    error: error || defaultErrorHandler
                });
            };

            // connect and setup allowed functions
            var __bindFunctionCall = function (name) {
                /**
                 * Any of the allowed functions. Arguments are shifted if params is a function so there's no need to give an empty params array.
                 * @param {Array} params optional array of parameters for the function. Treated as success callback if a function instead.
                 * @param {function} success Callback function
                 * @param {function} error   Error handler
                 */
                RPC_API[name] = function (params, success, error) {
                    if (name === 'getInfo') {
                        // hide params from external getInfo calls
                        error = success;
                        success = params;
                        params = [rpcClientVersion];
                    }

                    if (typeof params === 'function') {
                        error = success;
                        success = params;
                        params = [];
                    }

                    channel.call({
                        method: name,
                        params: params,
                        success: success,
                        error: error || defaultErrorHandler
                    });
                };
            };

            var info;
            RPC_API.isSupported = function (expectedOskariVersion, callback) {
                if (typeof expectedOskariVersion === 'function') {
                    callback = expectedOskariVersion;
                    expectedOskariVersion = null;
                }

                if (typeof callback !== 'function') {
                    callback = function (bln) {
                        RPC_API.log('Callback function for isSupported() not provided. Client supported: ' + bln);
                    };
                }

                var handle = function (oskariInfo) {
                    info = oskariInfo;
                    var supported = oskariInfo.clientSupported;
                    if (expectedOskariVersion) {
                        supported = supported && oskariInfo.version === expectedOskariVersion;
                    }

                    callback(supported);
                };

                if (info) {
                    handle(info);
                } else if (typeof RPC_API.getInfo === 'function') {
                    RPC_API.getInfo(handle);
                } else if (ready) {
                    callback(false);
                } else {
                    throw new Error('Map not connected yet');
                }
            };

            var channel = JSChannel.build({
                window: target.contentWindow,
                origin: origin,
                scope: 'Oskari',
                onReady: function () {
                    channel.call({
                        method: 'getSupportedFunctions',
                        success: function (funcnames) {
                            // setup allowed functions to RPC_API
                            for (var name in funcnames) {
                                if (!funcnames.hasOwnProperty(name)) {
                                    continue;
                                }

                                __bindFunctionCall(name);
                            }

                            // setup ready flag
                            ready = true;

                            // call onReady listeners
                            for (var i = 0; i < readyCallbacks.length; ++i) {
                                readyCallbacks[i]();
                            }
                        },

                        error: function () {
                            // communicate failure
                            throw new Error("Couldn't setup allowed functions");
                        }
                    });
                }
            });
            return RPC_API;
        },
        synchronizerFactory: function (channel, handlers) {
            var latestState = null;
            function synchronizeAll (state) {
                for (var i = 0; i < handlers.length; ++i) {
                    handlers[i].synchronize(channel, state);
                }
            }
            channel.onReady(function () {
                for (var i = 0; i < handlers.length; ++i) {
                    handlers[i].init(channel);
                }
                if (!latestState) {
                    return;
                }
                synchronizeAll(latestState);
            });
            return {
                synchronize: function (state) {
                    latestState = state;
                    if (!channel.isReady) {
                        return;
                    }
                    synchronizeAll(state);
                },
                destroy: function () {
                    for (var i = 0; i < handlers.length; ++i) {
                        if (typeof handlers[i].destroy === 'function') {
                            handlers[i].destroy();
                        }
                    }
                    channel.destroy();
                }
            }
        }
    };
}));
