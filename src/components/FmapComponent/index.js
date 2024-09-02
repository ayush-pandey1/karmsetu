import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Button } from '../ui/button';
import { IoIosArrowForward } from 'react-icons/io';

const FmapComponent = ({ myCoordinate, othersCoordinates, distance }) => {
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(myCoordinate);
    const [userMarker, setUserMarker] = useState(null);
    const [circle, setCircle] = useState(null);
    const [markers, setMarkers] = useState([]); // Track markers to clear old ones
    const freelancerId = "";
    const customIcon2 = new L.Icon({
        iconUrl: '/icon-for.png',
        iconSize: [30, 40],
        iconAnchor: [15, 40],
        popupAnchor: [0, -35],
        shadowSize: [40, 50],
    });

    useEffect(() => {
        if (userLocation && userLocation.latitude !== 0) {
            if (!map) {
                // Initialize map if it doesn't exist
                const initializedMap = L.map('map', {
                    attributionControl: false
                }).setView([userLocation.latitude, userLocation.longitude], getZoomLevel(distance));

                L.tileLayer('https://api.maptiler.com/maps/openstreetmap/256/{z}/{x}/{y}.jpg?key=82TNCEqBnaGf8BT2qYU2', {
                    attribution: '&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors'
                }).addTo(initializedMap);

                const customIcon1 = new L.Icon({
                    iconUrl: '/marker-shadow.png',
                    iconSize: [30, 40],
                    iconAnchor: [15, 40],
                    popupAnchor: [0, -35],
                    shadowSize: [40, 50],
                });

                const userMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: customIcon1 })
                    .addTo(initializedMap)
                    .bindPopup(`<span className="text-black text-lg font-semibold">You are here!</span>`);
                setUserMarker(userMarker);

                const circle = L.circle([userLocation.latitude, userLocation.longitude], {
                    color: 'blue',
                    fillColor: '#9BD3F2',
                    fillOpacity: 0.3,
                    radius: distance * 1000
                }).addTo(initializedMap);
                setCircle(circle);

                // Initialize markers array
                setMarkers([]);

                othersCoordinates && othersCoordinates.forEach(coord => {
                    const marker = L.marker([coord.coordinates.latitude, coord.coordinates.longitude], { icon: customIcon2 }).addTo(initializedMap);

                    const popupContent = document.createElement('div');
                    marker.bindPopup(popupContent);

                    ReactDOM.render(
                        <div>
                        <div className="p-4 border border-slate-300 shadow-md bg-white max-w-72 sm:max-w-90 rounded-xl">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-4">
                              <div>
                                <span className="text-xs font-medium flex flex-row gap-1">
                                  Posted by
                                  <p className="text-blue-500 cursor-pointer ">{coord?.clientName}</p>
                                </span>
                                <div className="text-black text-base sm:text-lg font-bold leading-tight">
                                  {coord?.title}
                                </div>
                              </div>
                              <div>
                                <Link href={`/fl/jobdetails/${coord?._id}`} >
                                  <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                                    Details <IoIosArrowForward className="text-white text-base" />
                                  </Button>{" "}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>,
                        popupContent
                    );

                    // Remove zoom functionality on click
                    marker.on('click', () => {
                        // Perform other actions if needed, but don't change the view
                    });

                    // Add marker to markers array
                    setMarkers(prevMarkers => [...prevMarkers, marker]);
                });

                if (freelancerId && othersCoordinates) {
                    const selectedFreelancer = othersCoordinates.find(coord => coord._id === freelancerId);
                    if (selectedFreelancer && map) {
                        const selectedMarker = L.marker([selectedFreelancer.coordinates.latitude, selectedFreelancer.coordinates.longitude], { icon: customIcon2 }).addTo(map);

                        const popupContent = document.createElement('div');
                        ReactDOM.render(
                            <div>
                        <div className="p-4 border border-slate-300 shadow-md bg-white max-w-72 sm:max-w-90 rounded-xl">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-4">
                              <div>
                                <span className="text-xs font-medium flex flex-row gap-1">
                                  Posted by
                                  <p className="text-blue-500 cursor-pointer ">{coord?.clientName}</p>
                                </span>
                                <div className="text-black text-base sm:text-lg font-bold leading-tight">
                                  {coord?.title}
                                </div>
                              </div>
                              <div>
                                <Link href={`/fl/jobdetails/${coord?._id}`} >
                                  <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                                    Details <IoIosArrowForward className="text-white text-base" />
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
                // Update map if it already exists
                map.setView([userLocation.latitude, userLocation.longitude], getZoomLevel(distance), { animate: true });

                if (userMarker) {
                    userMarker.setLatLng([userLocation.latitude, userLocation.longitude]);
                } else {
                    const customIcon1 = new L.Icon({
                        iconUrl: '/marker-shadow.png',
                        iconSize: [30, 40],
                        iconAnchor: [15, 40],
                        popupAnchor: [0, -35],
                        shadowSize: [40, 50],
                    });
                    const newMarker = L.marker([userLocation.latitude, userLocation.longitude], { icon: customIcon1 }).addTo(map)
                        .bindPopup(`<b>My location</b><br>Latitude: ${userLocation.latitude}, Longitude: ${userLocation.longitude}`);
                    setUserMarker(newMarker);
                }

                if (circle) {
                    map.removeLayer(circle);
                }
                const newCircle = L.circle([userLocation.latitude, userLocation.longitude], {
                    color: 'blue',
                    fillColor: '#9BD3F2',
                    fillOpacity: 0.3,
                    radius: distance * 1000
                }).addTo(map);
                setCircle(newCircle);

                // Remove old markers
                markers.forEach(marker => map.removeLayer(marker));
                setMarkers([]);

                // Add new markers
                othersCoordinates && othersCoordinates.forEach(coord => {
                    const marker = L.marker([coord.coordinates.latitude, coord.coordinates.longitude], { icon: customIcon2 }).addTo(map);

                    const popupContent = document.createElement('div');
                    marker.bindPopup(popupContent);

                    ReactDOM.render(
                        <div>
                        <div className="p-4 border border-slate-300 shadow-md bg-white max-w-72 sm:max-w-90 rounded-xl">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-4">
                              <div>
                                <span className="text-xs font-medium flex flex-row gap-1">
                                  Posted by
                                  <p className="text-blue-500 cursor-pointer ">{coord?.clientName}</p>
                                </span>
                                <div className="text-black text-base sm:text-lg font-bold leading-tight">
                                  {coord?.title}
                                </div>
                              </div>
                              <div>
                                <Link href={`/fl/jobdetails/${coord?._id}`} >
                                  <Button className="flex flex-row gap- items-center bg-primary active:bg-primaryho hover:bg-primary mt-4">
                                    Details <IoIosArrowForward className="text-white text-base" />
                                  </Button>{" "}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>,
                        popupContent
                    );

                    // Remove zoom functionality on click
                    marker.on('click', () => {
                        // Perform other actions if needed, but don't change the view
                    });

                    // Add marker to markers array
                    setMarkers(prevMarkers => [...prevMarkers, marker]);
                });
            }
        }
    }, [map, userLocation, othersCoordinates, distance, freelancerId]);

    const getZoomLevel = (distance) => {
        return distance <= 3 ? 14 :
            distance <= 6 ? 13 :
                distance <= 10 ? 12 : 10;
    };

    const handleRelocate = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setUserLocation({ latitude, longitude });

                if (map) {
                    map.setView([latitude, longitude], 13, { animate: true });

                    if (userMarker) {
                        map.removeLayer(userMarker);
                    }

                    const customIcon1 = new L.Icon({
                        iconUrl: '/marker-shadow.png',
                        iconSize: [30, 40],
                        iconAnchor: [15, 40],
                        popupAnchor: [0, -35],
                        shadowSize: [40, 50],
                    });
                    const newMarker = L.marker([latitude, longitude], { icon: customIcon1 }).addTo(map)
                        .bindPopup(`<span className="text-black text-lg font-semibold">You are here!</span>`);

                    setUserMarker(newMarker);
                }
            }, (error) => {
                console.error("Error getting location: ", error);
                alert("Failed to get location. Please try again.");
            });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    };

    return (
        <div>
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
            <button onClick={handleRelocate} style={{ margin: '10px', padding: '10px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '5px' }}>
                Relocate to My Location
            </button>
        </div>
    );
};

export default FmapComponent;
