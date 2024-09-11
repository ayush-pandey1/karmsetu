import React, { useEffect, useState } from "react";
import Image from "next/image";
import ReactDOM from "react-dom";
import L from "leaflet";
// import { divIcon } from 'leaflet';
import { renderToStaticMarkup } from "react-dom/server";
import "leaflet/dist/leaflet.css";
import { MdMyLocation } from "react-icons/md";
import { RiRecordCircleLine } from "react-icons/ri";
import { RiAccountPinCircleFill, RiAccountPinCircleLine } from "react-icons/ri";
import Link from "next/link";

const MapComponent = ({ myCoordinate, othersCoordinates, distance }) => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(myCoordinate);
  const [userMarker, setUserMarker] = useState(null);
  const freelancerId = "";
  const zoomLevel =
    distance <= 3 ? 14 : distance <= 6 ? 13 : distance <= 10 ? 12 : 10;

  useEffect(() => {
    if (userLocation && userLocation.latitude !== 0 && !map) {
      const initializedMap = L.map("map", {
        attributionControl: false,
      }).setView([userLocation?.latitude, userLocation?.longitude], zoomLevel); // Zoom level 13 for ~8 km radius
      setMap(initializedMap);

      // Replace OpenStreetMap layer with MapTiler layer
      L.tileLayer(
        "https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=82TNCEqBnaGf8BT2qYU2",
        {
          attribution:
            '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors',
        }
      ).addTo(initializedMap);

      //   Custom My location Marker Icon
      const iconMarkup = renderToStaticMarkup(
        <RiRecordCircleLine className="text-red-600 text-2xl bg-transparent relative right-[6px] bottom-[9px] " />
      );
      const customIcon3 = new L.DivIcon({
        html: iconMarkup,
        className: "icon ",
      });
      
      //   Custom Freelacner location Marker Icon
      const iconMarkup2 = renderToStaticMarkup(
        <RiAccountPinCircleFill className="text-blue-600 text-3xl bg-transparent relative right-[9px] bottom-[9px] animate-bounce " />
      );
      const customIcon4 = new L.DivIcon({
        html: iconMarkup2,
        className: "icon ",
      });

      // const customIcon1 = new L.Icon({ 
      //   iconUrl: "/marker-shadow.png",
      //   iconSize: [30, 40], // Adjusted size
      //   iconAnchor: [15, 40], // Adjusted anchor position
      //   popupAnchor: [0, -35], // Adjusted popup position
      //   shadowSize: [40, 50], // Adjusted shadow size
      // });

      // const customIcon2 = new L.Icon({
      //   iconUrl: "/icon-for.png",
      //   iconSize: [30, 40], // Adjusted size
      //   iconAnchor: [15, 40], // Adjusted anchor position
      //   popupAnchor: [0, -35], // Adjusted popup position
      //   shadowSize: [40, 50], // Adjusted shadow size
      // });

      // Add marker for user location
      //   `<span className="text-red-500 text-lg font-semibold" style={{ font-weight: 600; }}>You are here!</span>`
      const userPopup = "<span> You are Here! </span>";
      const userPopupOptions = {
        maxWidth: "auto", // set max-width
        className: "text-red-500 text-md font-semibold w-[140px]", // name custom popup
      };
      const userMarker = L.marker(
        [userLocation?.latitude, userLocation?.longitude],
        { icon: customIcon3 }
      )
        .addTo(initializedMap)
        .bindPopup(userPopup, userPopupOptions);
      setUserMarker(userMarker);

      // Add a circle with a radius of 5 km around the user
      L.circle([userLocation?.latitude, userLocation?.longitude], {
        color: "blue",
        fillColor: "#9BD3F2",
        fillOpacity: 0.2,
        radius: distance * 1000, // 5 km radius
      }).addTo(initializedMap);

      // Add markers for other freelancers
      othersCoordinates &&
        othersCoordinates.forEach((coord) => {
          const marker = L.marker(
            [coord.coordinates.latitude, coord.coordinates.longitude],
            { icon: customIcon4 }
          ).addTo(initializedMap);

          const popupContent = document.createElement("div");
          marker.bindPopup(popupContent);

          // Render the FreelancerCard component into the popup
          ReactDOM.render(
            <div className="flex flex-col gap-4  bg-white border-gray-200 w-72 rounded-xl">
              <div className="flex flex-row items-center gap-3">
                <Link href={`/cl/user/${coord._id}`}>
                  <Image
                    src="/images/user/user-02.png"
                    height="45"
                    width="45"
                    className="border border-green-500 rounded-full cursor-pointer"
                  />
                </Link>
                <div className="flex flex-col gap-1">
                  <span className="text-black text-lg font-semibold leading-none">
                    {coord?.fullname}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {coord?.professionalTitle}
                  </span>
                </div>
              </div>
            </div>,
            popupContent
          );

          // Add event listener to center the map and zoom when marker is clicked
          marker.on("click", () => {
            if (map) {
              map.setView(
                [coord.coordinates.latitude, coord.coordinates.longitude],
                11,
                { animate: true }
              ); // Zoom level 11
            }
          });
        });

      // Find the freelancer by ID and center the map on their location
      if (freelancerId && othersCoordinates) {
        const selectedFreelancer = othersCoordinates.find(
          (coord) => coord._id === freelancerId
        );
        if (selectedFreelancer && map) {
          // Create a marker for the selected freelancer
          const selectedMarker = L.marker(
            [
              selectedFreelancer.coordinates.latitude,
              selectedFreelancer.coordinates.longitude,
            ],
            { icon: customIcon3 }
          ).addTo(map);

          // Set popup content for the selected freelancer
          const popupContent = document.createElement("div");
          ReactDOM.render(
            <div className="p-4 flex flex-col gap-4 border bg-white border-gray-200 w-72 rounded-xl">
              <div className="flex flex-row items-center gap-3">
                <Image
                  src="/images/user/user-02.png"
                  height="45"
                  width="45"
                  className="border border-green-500 rounded-full"
                />
                <div className="flex flex-col">
                  <span className="text-black text-lg font-semibold">
                    {selectedFreelancer.fullname}
                  </span>
                  <span className="text-xs">
                    {selectedFreelancer.professionalTitle}
                  </span>
                </div>
              </div>
            </div>,
            popupContent
          );
          selectedMarker.bindPopup(popupContent);

          // Center and zoom the map on the selected freelancer
          map.setView(
            [
              selectedFreelancer.coordinates.latitude,
              selectedFreelancer.coordinates.longitude,
            ],
            10,
            { animate: true }
          );
        }
      }
    }
  }, [map, userLocation, othersCoordinates, freelancerId]);

  const handleRelocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ latitude, longitude });

        if (map) {
          // Set the zoom level to 13 and center the map to the new location
          map.setView([latitude, longitude], 13, { animate: true });

          if (userMarker) {
            // Remove the old marker
            map.removeLayer(userMarker);
          }
          const customIcon1 = new L.Icon({
            iconUrl: "/marker-shadow.png",
            iconSize: [30, 40], // Adjusted size
            iconAnchor: [15, 40], // Adjusted anchor position
            popupAnchor: [0, -35], // Adjusted popup position
            shadowSize: [40, 50], // Adjusted shadow size
          });

          const iconMarkup = renderToStaticMarkup(
            <RiRecordCircleLine className="text-green-600 text-xl bg-transparent relative right-[9px] bottom-[9px]" />
          );
          const customIcon3 = new L.DivIcon({
            html: iconMarkup,
            className: "icon ",
          });

          const newMarker = L.marker([latitude, longitude], {
            icon: customIcon3,
          })
            .addTo(map)
            .bindPopup(
              `<b>My location</b><br>Latitude: ${latitude}, Longitude: ${longitude}`
            );

          setUserMarker(newMarker);
        }
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="">
      <div
        id="map"
        style={{ height: "", width: "100%" }}
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
          className="leaflet-bottom leaflet-right z-[1001] hover:bg-white hover:scale-95 text-xl bg-white border border- text-green-500  "
        >
          <MdMyLocation />
        </button>

        <span className="leaflet-top leaflet-right w-24 opacity-55 p-2">
        <Image src="/images/karmsetuLogo-cropped.svg" width="0" height="0" className="w-auto h-auto"/>
        </span>
      </div>
    </div>
  );
};

export default MapComponent;
