import React, {Component} from 'react';
import './App.css';

class LocationList extends Component {
  /* handleKeyPress when the user press enter in the list view location */
  handleKeyPress(event) {
    if (event.charCode === 13) {
      this.props.update_selected_item(event.target.textContent.trim())
    }
  }
/* ====/ Render start /====*/
  render() {
    return (
      // create list view container that show into the map
      <div className = "LocationList-container" role = "main">
      <input type = "text" tabIndex = "0" placeholder = "search locations"
       onChange={(event) => this.props.updateQuery(event.target.value.trim())}/>

    <ul className = "locationList" tabIndex = "0" aria-label = "location list"  > {
      this.props.Locations.map((location, index) => (
        <li tabIndex = "0" aria-label = {
        "View Details for " + location.title
      }
      key = { index } // this is for accessbility when the user press  Enter button
      // when press the key
      onClick = {(event) => this.props.update_selected_item(event.target.textContent.trim())}
      onKeyPress = { (event) => this.handleKeyPress(event)}>
      {
        location.title
      } </li>))}
      </ul >
      </div>
    )
    }
}
export default LocationList;
