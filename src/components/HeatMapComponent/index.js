import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { renderToStaticMarkup } from "react-dom/server";

const HeatMapComponent = ({ myCoordinate, othersCoordinates }) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (myCoordinate && myCoordinate.latitude !== 0 && !map && othersCoordinates) {
      const initializedMap = L.map("heatmap", {
        attributionControl: false,
      }).setView([myCoordinate.latitude, myCoordinate.longitude], 11); 
      setMap(initializedMap);

      L.tileLayer(
        "https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=82TNCEqBnaGf8BT2qYU2",
        {
          attribution:
            '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors',
        }
      ).addTo(initializedMap);

      const heatMapPoints = othersCoordinates.map(coord => [
        coord.coordinates.latitude,
        coord.coordinates.longitude,
        15, 
      ]);

     
      const heat = L.heatLayer(heatMapPoints, {
        radius: 25, 
        blur: 15,
        maxZoom: 17, 
      }).addTo(initializedMap);
    }
  }, [myCoordinate, othersCoordinates, map]);

  return (
    <div
      id="heatmap"
      style={{ height: "500px", width: "100%" }}
      className="rounded-xl border border-green-500"
    ></div>
  );
};

export default HeatMapComponent;
