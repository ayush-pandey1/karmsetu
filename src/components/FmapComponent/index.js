import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import { Button } from "../ui/button";
import { IoIosArrowForward } from "react-icons/io";
import { RiAccountPinCircleFill, RiRecordCircleLine } from "react-icons/ri";
import { renderToStaticMarkup } from "react-dom/server";
import { MdMyLocation } from "react-icons/md";
import Image from "next/image";
import { RiMapPinFill } from "react-icons/ri";

const FmapComponent = ({ myCoordinate, othersCoordinates, distance }) => {
  const [map, setMap] = useState(null);
  const [userLocation, setUserLocation] = useState(myCoordinate);
  const [userMarker, setUserMarker] = useState(null);
  const [circle, setCircle] = useState(null);
  const [markers, setMarkers] = useState([]);
  const freelancerId = "";
  //   Custom Freelacner location Marker Icon
  const iconMarkup2 = renderToStaticMarkup(
    <RiMapPinFill className="text-green-600 text-3xl bg-transparent relative right-[9px] bottom-[9px] animate-bounce " />
  );
  const customIcon4 = new L.DivIcon({
    html: iconMarkup2,
    className: "icon ",
  });

  useEffect(() => {
    if (userLocation && userLocation.latitude !== 0) {
      if (!map) {
        const initializedMap = L.map("map", {
          attributionControl: false,
        }).setView(
          [userLocation.latitude, userLocation.longitude],
          getZoomLevel(distance)
        );

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

        // const userMarker = L.marker(
        //   [userLocation.latitude, userLocation.longitude],
        //   { icon: customIcon3 }
        // )
        //   .addTo(initializedMap)
        //   .bindPopup(
        //     `<span className="text-black text-lg font-semibold">You are here!</span>`
        //   );
        // setUserMarker(userMarker);
        const userPopup = "<span> You are Here ! </span>";
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

        const circle = L.circle(
          [userLocation.latitude, userLocation.longitude],
          {
            color: "blue",
            fillColor: "#9BD3F2",
            fillOpacity: 0.3,
            radius: distance * 1000,
          }
        ).addTo(initializedMap);
        setCircle(circle);

        setMarkers([]);

        othersCoordinates &&
          othersCoordinates.forEach((coord) => {
            const marker = L.marker(
              [coord.coordinates.latitude, coord.coordinates.longitude],
              { icon: customIcon4 }
            ).addTo(initializedMap);

            const popupContent = document.createElement("div");
            marker.bindPopup(popupContent);

            ReactDOM.render(
              <div>
                <div className="p-4 border border-slate-300 shadow-md bg-white max-w-72 sm:max-w-90 rounded-xl">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                      <div>
                        <span className="text-xs font-medium flex flex-row gap-1 items-center">
                          Posted by
                          <p className="text-blue-500 cursor-pointer ">
                            {coord?.clientName}
                          </p>
                        </span>
                        <div className="text-black text-base sm:text-lg font-bold leading-tight">
                          {coord?.title}
                        </div>
                      </div>
                      <div>
                        <Link href={`/fl/jobdetails/${coord?._id}`}>
                          <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                            Details{" "}
                            <IoIosArrowForward className="text-white text-base" />
                          </Button>{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>,
              popupContent
            );

            marker.on("click", () => {});

            setMarkers((prevMarkers) => [...prevMarkers, marker]);
          });

        if (freelancerId && othersCoordinates) {
          const selectedFreelancer = othersCoordinates.find(
            (coord) => coord._id === freelancerId
          );
          if (selectedFreelancer && map) {
            const selectedMarker = L.marker(
              [
                selectedFreelancer.coordinates.latitude,
                selectedFreelancer.coordinates.longitude,
              ],
              { icon: customIcon4 }
            ).addTo(map);

            const popupContent = document.createElement("div");
            ReactDOM.render(
              <div>
                <div className="p-4 border border-slate-300 shadow-md bg-white max-w-72 sm:max-w-90 rounded-xl">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                      <div>
                        <span className="text-xs font-medium flex flex-row gap-1">
                          Posted by
                          <p className="text-blue-500 cursor-pointer ">
                            {coord?.clientName}
                          </p>
                        </span>
                        <div className="text-black text-base sm:text-lg font-bold leading-tight">
                          {coord?.title}
                        </div>
                      </div>
                      <div>
                        <Link href={`/fl/jobdetails/${coord?._id}`}>
                          <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                            Details{" "}
                            <IoIosArrowForward className="text-white text-base" />
                          </Button>{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>,
              popupContent
            );
            selectedMarker.bindPopup(popupContent);
          }
        }

        setMap(initializedMap);
      } else {
        map.setView(
          [userLocation.latitude, userLocation.longitude],
          getZoomLevel(distance),
          { animate: true }
        );

        if (userMarker) {
          userMarker.setLatLng([userLocation.latitude, userLocation.longitude]);
        } else {
          const iconMarkup = renderToStaticMarkup(
            <RiRecordCircleLine className="text-red-600 text-2xl bg-transparent relative right-[6px] bottom-[9px] " />
          );
          const customIcon3 = new L.DivIcon({
            html: iconMarkup,
            className: "icon ",
          });
          const newMarker = L.marker(
            [userLocation.latitude, userLocation.longitude],
            { icon: customIcon3 }
          )
            .addTo(map)
            .bindPopup(
              `<b>My location</b><br>Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`
            );
          setUserMarker(newMarker);
        }

        if (circle) {
          map.removeLayer(circle);
        }
        const newCircle = L.circle(
          [userLocation.latitude, userLocation.longitude],
          {
            color: "blue",
            fillColor: "#9BD3F2",
            fillOpacity: 0.2,
            radius: distance * 1000,
          }
        ).addTo(map);
        setCircle(newCircle);

        markers.forEach((marker) => map.removeLayer(marker));
        setMarkers([]);

        othersCoordinates &&
          othersCoordinates.forEach((coord) => {
            const marker = L.marker(
              [coord.coordinates.latitude, coord.coordinates.longitude],
              { icon: customIcon4 }
            ).addTo(map);

            const popupContent = document.createElement("div");
            marker.bindPopup(popupContent);

            ReactDOM.render(
              <div>
                <div className="p-4 border border-slate-300 shadow-md bg-white max-w-72 sm:max-w-90 rounded-xl">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-row gap-4">
                      <div>
                        <span className="text-xs font-medium flex flex-row gap-1">
                          Posted by
                          <p className="text-blue-500 cursor-pointer ">
                            {coord?.clientName}
                          </p>
                        </span>
                        <div className="text-black text-base sm:text-lg font-bold leading-tight">
                          {coord?.title}
                        </div>
                      </div>
                      <div>
                        <Link href={`/fl/jobdetails/${coord?._id}`}>
                          <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                            Details{" "}
                            <IoIosArrowForward className="text-white text-base" />
                          </Button>{" "}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>,
              popupContent
            );

            marker.on("click", () => {});

            setMarkers((prevMarkers) => [...prevMarkers, marker]);
          });
      }
    }
  }, [map, userLocation, othersCoordinates, distance, freelancerId]);

  const getZoomLevel = (distance) => {
    return distance <= 3 ? 14 : distance <= 6 ? 13 : distance <= 10 ? 12 : 10;
  };

  const handleRelocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          if (map) {
            map.setView([latitude, longitude], 13, { animate: true });

            if (userMarker) {
              map.removeLayer(userMarker);
            }

            const iconMarkup = renderToStaticMarkup(
              <RiRecordCircleLine className="text-red-600 text-2xl bg-transparent relative right-[6px] bottom-[9px] " />
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
                `<span className="text-black text-lg font-semibold">You are here!</span>`
              );

            setUserMarker(newMarker);
          }
        },
        (error) => {
          console.error("Error getting location: ", error);
          alert("Failed to get location. Please try again.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <div
        id="map"
        style={{ height: "", width: "100%" }}
        className="rounded-xl border border-sky-500 h-[300px] md:h-[500px] z-1"
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
          <Image
            src="/images/karmsetuLogo-cropped.svg"
            width="0"
            height="0"
            className="w-auto h-auto"
            alt="watermark"
          />
        </span>
      </div>
    </div>
  );
};

export default FmapComponent;
