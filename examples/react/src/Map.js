import React, { Component } from 'react';
import OskariRPC from 'oskari-rpc';
import MarkerHandler from './handlers/MarkerHandler';
import DrawHandler from './handlers/DrawHandler';

import './Map.css';

class Map extends Component {
  componentDidMount() {
    this.synchronizer = OskariRPC.synchronizerFactory(
      OskariRPC.connect(this.refs.mapEl, 'https://kartta.paikkatietoikkuna.fi'),
      [
        new MarkerHandler(this.props.onMapClick),
        new DrawHandler(this.props.onDraw)
      ]
    );
    this.synchronizer.synchronize(this.props.mapState);
  }
  shouldComponentUpdate(nextProps, nextState) {
    this.synchronizer.synchronize(nextProps.mapState);
    return false; // no need to update DOM ever
  }
  componentWillUnmount() {
    this.synchronizer.destroy();
  }
  render() {
    return (
      <div className="map">
        <iframe ref="mapEl" title="Embedded map" src="https://kartta.paikkatietoikkuna.fi/published/en/1bd4c3fb-9b19-4329-881c-36c02da8a809"/>
      </div>
    );
  }
}

export default Map;