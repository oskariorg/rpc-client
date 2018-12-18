import React, { Component } from 'react';

import './LocationList.css';

class LocationList extends Component {
  render() {
    const rows = this.props.locations.map((location) => {
        return (<li key={location.id} className={location.selected ? 'selected' : ''}>
            id: {location.id}, lon: {location.lon.toFixed(4)}, lat: {location.lat.toFixed(4)}.
            <button onClick={() => this.props.onDelete(location.id)}>DELETE</button>
        </li>);
    });
    return (
      <div className="location-list">
        <h2>Your locations</h2>
        <ul>
            {rows}
        </ul>
      </div>
    );
  }
}

export default LocationList;
