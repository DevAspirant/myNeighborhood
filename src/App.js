import React, {Component} from 'react';
import './App.css';
import Map from './Map' // import the Map component
import {Locations} from './locations' // import the locations.js file that have the all location data
import escapeRegExp from 'escape-string-regexp'
import sortBy from 'sort-by'
import LocationList from './locationList' // import LocationList Component

class App extends Component {
// create a query, selectedItem for the search
  state = {
    location_query: '',
    item_select: ''
  }
//  this method will send to locationList Component
  updateQuery = (location_query) => {
    this.setState({location_query: location_query})
  }
//  this method for when the user choose one item from the list
  update_selected_item = (item) => {
    this.setState({item_select: item})
  }

/* ===/ Start Render /=== */
  render() {
    let show_locations // this variable is for check if the search is working or not
    // This is for search into the locations list
    if (this.state.location_query) {
      const match = new RegExp(escapeRegExp(this.state.location_query), 'i')
      show_locations = Locations.filter((location) => match.test(location.title))
    } else {
      show_locations = Locations
    }
    show_locations.sort(sortBy('title'))
    return (
      // the app is running
    <div className = "App" >
      <header className = "App-header" role = "banner" >
        <h1 className = "App-title" > My &#x2661; Neighborhood places in Jeddah < /h1>
      </header>
      {
        // Run the  & send informtion to the Components
      }
    <Map Locations = {show_locations} item_select = { this.state.item_select} />
    <LocationList Locations={show_locations} updateQuery={this.updateQuery} update_selected_item ={this.update_selected_item}/>

</div>);
    }
}

export default App;
