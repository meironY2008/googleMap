import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import locations from "../csvjson.json";
// import Search from './Search';

const namedLocations = locations.filter((location) => {
  if (location.Y && location.X && location.placeName) return location;
});

function haversine_distance(selected, correct) {
  let R = 3958.8; // Radius of the Earth in miles
  let rlat1 = selected.lat * (Math.PI/180); // Convert degrees to radians
  let rlat2 = correct.Y * (Math.PI/180); // Convert degrees to radians
  let difflat = rlat2-rlat1; // Radian difference (latitudes)
  let difflon = (correct.X-selected.lng) * (Math.PI/180); // Radian difference (longitudes)

  let distance = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return Math.round(1000 * distance);
}

const MapContainer = () => {
  const [randomIndex, setRandomIndex] = useState(Math.round(Math.random() * namedLocations.length));
  const [newMarker, setNewMarker] = useState({});
  const [isClicked, setIsClicked] = useState(null);

  console.log("Hello I'm Rendered");

  const mapStyles = {
    height: "65vh",
    width: "50vw",
  };

  const defaultCenter = {
    lat: 31.58503,
    lng: 35,
  };

  const options = {
    disableDefaultUI: true,
  };

  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback((event) => {
    setNewMarker({
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    });
    setIsClicked(true);
  }, []);

  return (
    <>
      <div id="map-container">
        <h2>{namedLocations[randomIndex].placeName}</h2>
        <LoadScript
          libraries={["places"]}
          googleMapsApiKey={process.env.GOOGLE_API_KEY}
        >
          {/* <Search lat={defaultCenter.lat} lng={defaultCenter.lng} /> */}
          <GoogleMap
            mapContainerStyle={mapStyles}
            zoom={7}
            center={defaultCenter}
            options={options}
            onClick={(e) => {
              !isClicked && onMapClick(e);
            }}
            onLoad={onMapLoad}
          >
            {isClicked && (
              <Marker
                position={{
                  lat: newMarker.lat,
                  lng: newMarker.lng,
                }}
                icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
              />
            )}

            {isClicked && (
              <Marker
                position={{
                  lat: namedLocations[randomIndex].Y,
                  lng: namedLocations[randomIndex].X,
                }}
                icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              />
            )}
          </GoogleMap>
        </LoadScript>
        <button
          onClick={() => {
            setRandomIndex(Math.round(Math.random() * namedLocations.length));
            setIsClicked(null);
          }}
        >
          New Location
        </button>
        <div>
          <span><img src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" alt="blue" /> - Goal</span>
          <span><img src="http://maps.google.com/mapfiles/ms/icons/red-dot.png" alt="red"  /> - Your Choice</span>
        </div>
        {isClicked && <div>Distance from goal: { haversine_distance(newMarker, namedLocations[randomIndex]) } meters </div>}
      </div>
    </>
  );
};
export default MapContainer;