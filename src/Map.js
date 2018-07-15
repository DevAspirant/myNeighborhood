import React, {Component} from 'react';
import scriptLoader from 'react-async-script-loader';

class Map extends Component {

  state = {
    map: {},
    successfulMapLoaded: true,
    markers: [],
    allInfoWindow: []
  }
  /* ====/ Google API Map/====*/
  /* In componentWillReceiveProps: recive the google map API & check if  was Succeed then setting and load the map*/
  componentWillReceiveProps = ({isScriptLoaded, isScriptLoadSucceed}) => {
    if (isScriptLoaded && !this.props.isScriptLoaded) {
      if (isScriptLoadSucceed) {
        this.google_map_api_load();
      } else {
        this.google_map_api_Not_loading();
      }
    }
  }

  google_map_api_load = ()=>{
    console.log("map has been load"); // message for check if the map is work
    // create a map & location (on that location is Jeddah City)
    const map_load = new window.google.maps.Map(document.getElementById('map'), {
      center: {
        lat: 21.6253306,
        lng: 39.10800349
      },
      zoom: 13
    });
    this.setState({map: map_load});
  }

  google_map_api_Not_loading=()=>{
    console.log("erorr when map is load"); // message for check if the map is not loading
    this.setState({successfulMapLoaded: false});
  }
  /* ============/ MARKER /============*/
  /* In componentDidUpdate: I create markers & information window for the location */
  componentDidUpdate = () => {
    this.CreateMarker();
  }

  CreateMarker =()=>{
    let position,title,marker;
    let self = this; // ?
    const Locations = this.props.Locations; // recive the all locations properties
    let infowindow = new window.google.maps.InfoWindow(); // information window when the user press to the place icon in the map
    var bounds = new window.google.maps.LatLngBounds(); // ?


    if (this.state.successfulMapLoaded) {
      this.clearLocationMarker(); // clear the marker function
      this.clearInfoWindow(); // clear the inforwindo function
      // loop that show the marker into the map
      for (let i = 0; i < Locations.length; i++) {
        position = Locations[i].coordinates;
        title = Locations[i].title;
        marker = new window.google.maps.Marker({map: this.state.map, position: position, title: title, animation: window.google.maps.Animation.DROP, id: i});

        // here for showing the places information when the user press the icon
        marker.addListener('click', function() {
          let data = Locations[i].infoWindowData? Locations[i].infoWindowData.name: "sorry there are no data";
          self.markerInfoWidow(this, infowindow, data);
        });

        this.state.markers.push(marker); // push marker icon into the place
        bounds.extend(marker.position);
      }

      this.state.map.fitBounds(bounds); // ?

      if (this.props.item_select) {
        this.openSelectedInfowindow(infowindow);
      }
    }
  }

  /* in markerInfoWidow set infowindow and data for specific marker */
  markerInfoWidow = (marker, infowindow, data) => {
    this.clearInfoWindow();
    this.markerAnimation(marker);
    this.setContentInfoWindow(marker, infowindow, data);
  }


  /* make marker animation */
  markerAnimation = (marker) => {
    if (marker) {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        // set the animtion
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function() {
          marker.setAnimation(null);
        }, 3000);
      }
    }
  }

  /* ====/ Search /==== */
  // TODO: what clearArray method : this method is for the search
  // clearArray = (array) => {
  //   while (array.length > 0) {
  //     array.pop();
  //   }
  // }

  clearSearchArray = (array) => {
    while (array.length > 0) {
      array.pop();
    }
  }

  /* close all opened marker and clear the marker array */
  //   clearMarker = () => {
  //   for (let marker of this.state.markers) {
  //     marker.setMap(null);
  //   }
  //   this.clearSearchArray(this.state.markers)
  // }
  /* close all opened InfoWindow and clear the InfoWindow array */
  clearInfoWindow = () => {
    for (let infoWindow of this.state.allInfoWindow) {
      infoWindow.close();
    }
    this.clearSearchArray(this.state.allInfoWindow)
  }

  clearLocationMarker = () => {
  for (let marker of this.state.markers) {
    marker.setMap(null);
  }
  this.clearSearchArray(this.state.markers)
}


  /* make the content of the InfoWindow */
  setContentInfoWindow = (marker, infowindow, data) => {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker !== marker) {
      infowindow.marker = marker;
      infowindow.setContent('<div tabIndex="0">' + data + '</div>');
      infowindow.open(this.state.map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.setMarker = null;
      });
    }
    this.state.allInfoWindow.push(infowindow);
  }
  /*  open the Infowindow window when click on the list view */
    openSelectedInfowindow = (infowindow) => {
      // filter between the selectedItem
      let selectedMarker =  this.state.markers.filter((marker)=>{
          return marker.title === this.props.item_select
      })

      // filter between the locations
      let selectedLocation =  this.props.Locations.filter((location)=>{
        return location.title === this.props.item_select
      })
      // check the marker and location value
      if(selectedMarker && selectedMarker[0] && selectedLocation && selectedLocation[0]){
        var data =  selectedLocation[0].infoWindowData ? selectedLocation[0].infoWindowData.name :"sorry there are no data";
        this.markerInfoWidow(selectedMarker[0], infowindow, data);
      }
    }

  /*====/ Request FourSquare API /====*/
    componentDidMount =() => {
    this.FourSquareRequest();
  }

  FourSquareRequest = () => {
    const Locations = this.props.Locations;
    for (let  i = 0; i < Locations.length; i++){
      var clientId = "M535IAONQUNF2LTPWRIP452P0HRL0QNIVNSIG5UDMVZFXYHC";
      var clientSecret = "LMQRUTKPWSYCVO1ATHCMFT5A1AC3XT5Z1LKS10MH0HJP3LUM";
      var request = "https://api.foursquare.com/v2/venues/search?client_id=" + clientId + "&client_secret=" + clientSecret + "&v=20180323&ll=" + Locations[i].coordinates.lat+','+Locations[i].coordinates.lng + "&limit=1";
      // send & fetch the data from FourSquare API
try{
      fetch(request).then(function (response) {
        if (response.status !== 200) {
            return;
        }
        // get the response from the FourSquare API
        response.json().then(function (data){
              // check if the API is working
              Locations[i].infoWindowData = data.response.venues[0];

    });

      });
}catch(e){
  console.log("error when fetching the data");
}
    }
  }
  render() {
    return (
      this.state.successfulMapLoaded
      ? (< div className = "map-container" id = "map" role = "application" tabIndex = "-1" > < /div>) : (<div className="mapError-container" role="application" tabIndex="-1" >Error  in loading map</div >))
  }
}

export default scriptLoader(["https://maps.googleapis.com/maps/api/js?key=AIzaSyDBKjd61KYOh7z8PZRMtNuX9Of1T171Z_U&v=3"])(Map)
