## Oskari-rpc React demo

This repo serves an an example how to use `oskari-rpc` in a React app.

The map content is modeled as react app state and works like any state in React. The `synchronizerFactory` helper provided by `oskari-rpc` is used to implement state synchronization from React component state to Oskari map state. The synchronizer has the same function as the [Virtual DOM](https://reactjs.org/docs/faq-internals.html) has in React. In response to React state change, the synchronizer makes the needed `postRequest` calls to update the Oskari map state to match.

How the synchronizer achieves this is app specific. The logic is implemented in handlers (see [MarkerHandler.js](src/handlers/MarkerHandler.js) & [DrawHandler.js](src/handlers/DrawHandler.js)) that are given when the synchronizer is created (see [Map.js](src/Map.js)).

The synchronizer API is documented at [oskariorg/rpc-client](https://github.com/oskariorg/rpc-client)

### Live demo

https://data-ux.github.io/oskari-rpc-react/

### Running

```
npm install
npm start
```

Open browser at `http://localhost:3000`


This repo was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).