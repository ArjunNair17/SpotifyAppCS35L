import React from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { initializeApp } from "firebase/app";

import './map.css';



const firebaseConfig = {
  apiKey: "AIzaSyDX1CXAtkqj9Tg1HVYwlcocpkMxB-Y4NTw",
  authDomain: "spotifybuds-e7e29.firebaseapp.com",
  databaseURL: "https://spotifybuds-e7e29-default-rtdb.firebaseio.com",
  projectId: "spotifybuds-e7e29",
  storageBucket: "spotifybuds-e7e29.appspot.com",
  messagingSenderId: "566960468786",
  appId: "1:566960468786:web:cb73617f63fc5f79e45d2b",
  measurementId: "G-N3X3577Z70"
};


initializeApp(firebaseConfig);
class Discover extends React.Component {
  componentDidMount() {
    this.fetchUserData();
    this.interval = setInterval(this.getLocation, 120000);
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }


  fetchUserData = () => {
    const db = getDatabase();
    const usersRef = ref(db, "users");


    onValue(usersRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        console.log(userData);
        const markers = Object.values(userData).map((user) => {
          const { latitude, longitude, currentSong, artists } = user;
          console.log("user: ", user);
          return [`${user.userName}'s Location`, latitude, longitude, currentSong, artists];
        });


        this.initMap(markers);
      }
    });
  };


  getLocation = () => {
    this.fetchUserData();
  };


  initMap = (markers) => {
    const loadMap = () => {
      console.log("Markers: " + markers[1]);
      const mapOptions = {
        center: { lat: markers[0][1], lng: markers[0][2] },
        zoom: 13,
        mapTypeId: 'roadmap'
      };


      const map = new window.google.maps.Map(document.getElementById("mapCanvas"), mapOptions);


      const bounds = new window.google.maps.LatLngBounds();


      const infoWindow = new window.google.maps.InfoWindow();


      markers.forEach((markerData) => {
        const [title, lat, lng, song, artists] = markerData;
        console.log("Title:", title);
        const position = new window.google.maps.LatLng(lat, lng);


        bounds.extend(position);


        const marker = new window.google.maps.Marker({
          position: position,
          map: map,
          title: title
        });
        console.log("Title:", title);


        window.google.maps.event.addListener(marker, 'click', () => {
          infoWindow.setContent(`<div class="info_content">
            <h2>${title}</h2>
            <h3>Latitude: ${lat}, Longitude: ${lng}</h3>
            <h3>Current song: ${song}</h3>
            <h3>Artists: ${artists[0].name}, ${artists[1].name}, ${artists[2].name}</h3>
          </div>`);
          infoWindow.open(map, marker);
        });
      });


      map.fitBounds(bounds);
      map.setZoom(14);
    };


    if (window.google && window.google.maps) {
      // Google Maps API is already loaded
      loadMap();
    } else {
      // Load the Google Maps API script
      const googleMapsScript = document.createElement('script');
      googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCGAxuT2e4fr6HcwemlAGCNJ6zsxlpUsdQ`;
      googleMapsScript.defer = true;
      googleMapsScript.onload = loadMap;
      document.head.appendChild(googleMapsScript);
    }
  };


  render() {
    return (

      <div className="App">
        <div id="mapCanvas" style={{ height: "600px" }}></div>
      </div>

    );
  }
}


export default Discover;