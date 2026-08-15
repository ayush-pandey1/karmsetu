import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { MdMyLocation } from "react-icons/md";
import { RiRecordCircleLine, RiAccountPinCircleFill } from "react-icons/ri";

const MapComponent = ({
  myCoordinate,
  othersCoordinates = [],
  distance = 5,
  selectedFreelancerId,
}) => {
  const mapRef = useRef(null);
  const markersLayerRef = useRef(null);
  const userMarkerRef = useRef(null);
  const circleLayerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(myCoordinate);

  useEffect(() => {
    if (myCoordinate && myCoordinate.latitude && myCoordinate.longitude) {
      setUserLocation(myCoordinate);
    }
  }, [myCoordinate]);

  // 1. Initialize Map once
  useEffect(() => {
    if (!userLocation || !userLocation.latitude || !userLocation.longitude) return;

    if (mapRef.current) return;

    const zoomLevel =
      distance <= 3 ? 14 : distance <= 6 ? 13 : distance <= 10 ? 12 : 10;

    const mapInstance = L.map("map", {
      attributionControl: false,
    }).setView([userLocation.latitude, userLocation.longitude], zoomLevel);

    L.tileLayer(
      "https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=82TNCEqBnaGf8BT2qYU2",
      {
        attribution:
          '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors',
      }
    ).addTo(mapInstance);

    const markersGroup = L.layerGroup().addTo(mapInstance);
    markersLayerRef.current = markersGroup;
    mapRef.current = mapInstance;

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [userLocation?.latitude, userLocation?.longitude]);

  // 2. Update user marker & radius circle when userLocation or distance changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !userLocation || !userLocation.latitude || !userLocation.longitude) return;

    // Remove existing user marker & circle
    if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
    }
    if (circleLayerRef.current) {
      map.removeLayer(circleLayerRef.current);
    }

    const iconMarkup = renderToStaticMarkup(
      <RiRecordCircleLine className="text-red-600 text-2xl bg-transparent relative right-[6px] bottom-[9px]" />
    );
    const customUserIcon = new L.DivIcon({
      html: iconMarkup,
      className: "icon",
    });

    const userPopup = "<span class='text-red-500 font-semibold'>You are Here!</span>";
    const userMarker = L.marker([userLocation.latitude, userLocation.longitude], {
      icon: customUserIcon,
    })
      .addTo(map)
      .bindPopup(userPopup);
    userMarkerRef.current = userMarker;

    const circle = L.circle([userLocation.latitude, userLocation.longitude], {
      color: "blue",
      fillColor: "#9BD3F2",
      fillOpacity: 0.2,
      radius: (distance || 5) * 1000,
    }).addTo(map);
    circleLayerRef.current = circle;
  }, [userLocation, distance]);

  // 3. Update freelancer markers dynamically
  useEffect(() => {
    const map = mapRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    const iconMarkupFreelancer = renderToStaticMarkup(
      <RiAccountPinCircleFill className="text-blue-600 text-3xl bg-transparent relative right-[9px] bottom-[9px] animate-bounce" />
    );
    const customFreelancerIcon = new L.DivIcon({
      html: iconMarkupFreelancer,
      className: "icon",
    });

    const iconMarkupSelected = renderToStaticMarkup(
      <RiAccountPinCircleFill className="text-green-600 text-4xl bg-transparent relative right-[12px] bottom-[12px] animate-bounce" />
    );
    const customSelectedIcon = new L.DivIcon({
      html: iconMarkupSelected,
      className: "icon",
    });

    if (Array.isArray(othersCoordinates)) {
      othersCoordinates.forEach((coord) => {
        if (
          !coord ||
          !coord.coordinates ||
          coord.coordinates.latitude == null ||
          coord.coordinates.longitude == null
        ) {
          return;
        }

        const isSelected = coord._id === selectedFreelancerId;
        const marker = L.marker(
          [coord.coordinates.latitude, coord.coordinates.longitude],
          { icon: isSelected ? customSelectedIcon : customFreelancerIcon }
        );

        const imgUrl = coord.imageLink || "/images/user/user-02.png";
        const title = coord.professionalTitle || "Freelancer";
        const name = coord.fullname || "Anonymous";

        const popupHtml = `
          <div style="font-family: sans-serif; min-width: 180px; padding: 4px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <img src="${imgUrl}" style="width: 40px; height: 40px; border-radius: 50%; border: 2px solid #22c55e; object-fit: cover;" alt="${name}" />
              <div>
                <a href="/cl/user/${coord._id}" style="font-size: 14px; font-weight: bold; color: #111; text-decoration: none;">${name}</a>
                <p style="font-size: 11px; color: #6b7280; margin: 2px 0 0 0;">${title}</p>
              </div>
            </div>
            ${coord.distance ? `<p style="font-size: 11px; color: #16a34a; font-weight: 600; margin: 6px 0 0 0;">📍 ${coord.distance} km away</p>` : ""}
          </div>
        `;

        marker.bindPopup(popupHtml);
        markersGroup.addLayer(marker);

        marker.on("click", () => {
          map.setView(
            [coord.coordinates.latitude, coord.coordinates.longitude],
            13,
            { animate: true }
          );
        });

        if (isSelected) {
          marker.openPopup();
          map.setView(
            [coord.coordinates.latitude, coord.coordinates.longitude],
            13,
            { animate: true }
          );
        }
      });
    }
  }, [othersCoordinates, selectedFreelancerId]);

  const handleRelocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 13, { animate: true });
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
        id="map"
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

export default MapComponent;

