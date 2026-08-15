import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import Image from "next/image";
import { MdMyLocation } from "react-icons/md";

const HeatMapComponent = ({ myCoordinate, othersCoordinates = [] }) => {
  const mapRef = useRef(null);
  const heatLayerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(myCoordinate);

  useEffect(() => {
    if (myCoordinate && myCoordinate.latitude && myCoordinate.longitude) {
      setUserLocation(myCoordinate);
    }
  }, [myCoordinate]);

  useEffect(() => {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) return;

    if (mapRef.current) return;

    const initializedMap = L.map("heatmap", {
      attributionControl: false,
    }).setView([userLocation.latitude, userLocation.longitude], 11);

    L.tileLayer(
      "https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=82TNCEqBnaGf8BT2qYU2",
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors',
      }
    ).addTo(initializedMap);

    mapRef.current = initializedMap;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation?.latitude, userLocation?.longitude]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    const heatMapPoints = (othersCoordinates || [])
      .filter(
        (coord) =>
          coord &&
          coord.coordinates &&
          coord.coordinates.latitude != null &&
          coord.coordinates.longitude != null &&
          !isNaN(coord.coordinates.latitude) &&
          !isNaN(coord.coordinates.longitude)
      )
      .map((coord) => [
        coord.coordinates.latitude,
        coord.coordinates.longitude,
        15,
      ]);

    if (heatMapPoints.length > 0) {
      const heat = L.heatLayer(heatMapPoints, {
        radius: 25,
        blur: 15,
        maxZoom: 17,
      }).addTo(map);
      heatLayerRef.current = heat;
    }
  }, [othersCoordinates]);

  const handleRelocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 11, { animate: true });
          }
        },
        (error) => {
          console.error("Error fetching current position:", error);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="relative">
      <div
        id="heatmap"
        style={{ width: "100%" }}
        className="rounded-xl border border-green-500 h-[300px] md:h-[500px] z-1"
      >
        <button
          onClick={handleRelocate}
          style={{
            margin: "7px",
            padding: "7px",
            pointerEvents: "auto",
            borderRadius: "50px",
          }}
          title="My Location"
          className="leaflet-bottom leaflet-right z-[1001] hover:bg-white hover:scale-95 text-xl bg-white border border-gray-200 text-green-500 shadow-sm"
        >
          <MdMyLocation />
        </button>
        <span className="leaflet-top leaflet-right w-24 opacity-55 p-2 pointer-events-none">
          <Image
            src="/images/karmsetuLogo-cropped.svg"
            width={90}
            height={30}
            alt="KarmSetu Logo"
            className="w-auto h-auto"
          />
        </span>
      </div>
    </div>
  );
};

export default HeatMapComponent;

