import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { renderToStaticMarkup } from "react-dom/server";
import Image from "next/image";
import { MdMyLocation } from "react-icons/md";

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
      style={{ height: "", width: "100%" }}
      className="rounded-xl border border-green-500 h-[300px] md:h-[500px] z-1"
    >
      <button
        
        style={{
          margin: "7px",
          padding: "7px",
          pointerEvents: "auto",
          borderRadius: "50px",
        }}
        className="leaflet-bottom leaflet-right z-[1001] hover:bg-white hover:scale-95 text-xl bg-white border border- text-green-500  "
      >
        <MdMyLocation />
      </button>
      <span className="leaflet-top leaflet-right w-24 opacity-55 p-2">
          <Image
            src="/images/karmsetuLogo-cropped.svg"
            width="0"
            height="0"
            className="w-auto h-auto"
          />
        </span>
    </div>
  );
};

export default HeatMapComponent;
