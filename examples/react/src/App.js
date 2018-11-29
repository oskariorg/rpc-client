import React, { Component } from 'react';
import './App.css';
import Map from './Map';
import LocationList from './LocationList';
import idGenerator from './util/idGenerator';
import handleBinder from './util/handleBinder';

import pointInPolygon from './util/pointInPolygon';

class App extends Component {
  constructor() {
    super();
    this.state = {
      locations: [],
      isMapVisible: true,
      isDrawing: false
    };
    handleBinder(this);
  }
  handleMapClick({lon, lat}) {
    this.setState((state, props) => {
      const location = {
        lon,
        lat,
        id: idGenerator(),
        selected: false
      }
      const updatedLocations = state.locations.slice();
      updatedLocations.push(location);
      return {
        locations: updatedLocations
      }
    });
  }
  handleLocationDelete(locationId) {
    this.setState((state, props) => {
      const updatedLocations = state.locations.filter((location) => location.id !== locationId);
      return {
        locations: updatedLocations
      }
    });
  }
  handleMapToggle() {
    this.setState((state, props) => {
      return {
        isMapVisible: !state.isMapVisible
      }
    });
  }
  handleDrawToggle() {
    this.setState((state, props) => {
      return {
        isDrawing: !state.isDrawing
      }
    });
  }
  handleDraw(feature) {
    this.setState((state, props) => {
      const updatedLocations = state.locations.map((location) => {
        const shouldBeSelected = pointInPolygon(location.lon, location.lat, feature);
        if (location.selected === shouldBeSelected) {
          return location;
        }
        return Object.assign({}, location, {selected: shouldBeSelected})
      });
      return {
        isDrawing: false,
        locations: updatedLocations
      }
    });
  }
  render() {
    const mapState = {
      markers: this.state.locations,
      isDrawing: this.state.isDrawing
    };
    let mapWrapper;
    if (this.state.isMapVisible) {
      mapWrapper = (
        <div>
          <span className="info">{this.state.isDrawing ? 'Draw polygon on map to select markers' : 'Click on map to create markers'}</span>
          <Map onMapClick={this.handleMapClick} mapState={mapState} onDraw={this.handleDraw}/>
        </div>
      );
    }
    return (
      <div className="app">
        <h1>Oskari-rpc React demo</h1>
        <div className="horizontal">
        <div>
          <div>
            <button onClick={this.handleMapToggle}>{this.state.isMapVisible ? 'Remove' : 'Add'} map</button>
            <button onClick={this.handleDrawToggle}>{this.state.isDrawing ? 'Stop' : 'Start'} drawing selection</button>
          </div>
          {mapWrapper}
        </div>
          <LocationList locations={this.state.locations} onDelete={this.handleLocationDelete}/>
        </div>
      </div>
    );
  }
}

export default App;
