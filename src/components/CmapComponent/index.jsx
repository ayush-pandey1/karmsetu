import React, { useEffect, useState } from 'react';
import Image from "next/image";
import ReactDOM from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ myCoordinate, othersCoordinates, distance }) => {
    const [map, setMap] = useState(null);
    const [userLocation, setUserLocation] = useState(myCoordinate);
    const [userMarker, setUserMarker] = useState(null);
    const freelancerId = "";
    const zoomLevel = distance <= 3 ? 14 :
        distance <= 6 ? 13 :
            distance <= 10 ? 12 : 10;

    useEffect(() => {
        if (userLocation && userLocation.latitude !== 0 && !map) {
            const initializedMap = L.map('map', {
                attributionControl: false
            }).setView([userLocation?.latitude, userLocation?.longitude], zoomLevel);
            setMap(initializedMap);


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

            const customIcon2 = new L.Icon({
                iconUrl: '/icon-for.png',
                iconSize: [30, 40],
                iconAnchor: [15, 40],
                popupAnchor: [0, -35],
                shadowSize: [40, 50],
            });


            const userMarker = L.marker([userLocation?.latitude, userLocation?.longitude], { icon: customIcon1 })
                .addTo(initializedMap)
                .bindPopup(`<span className="text-black text-lg font-semibold">You are here!</span>`);
            setUserMarker(userMarker);


            L.circle([userLocation?.latitude, userLocation?.longitude], {
                color: 'blue',
                fillColor: '#9BD3F2',
                fillOpacity: 0.3,
                radius: distance * 1000 // 5 km radius
            }).addTo(initializedMap);


            othersCoordinates && othersCoordinates.forEach(coord => {
                const marker = L.marker([coord.coordinates.latitude, coord.coordinates.longitude], { icon: customIcon2 }).addTo(initializedMap);

                const popupContent = document.createElement('div');
                marker.bindPopup(popupContent);


                ReactDOM.render(
                    <div className="p-4 flex flex-col gap-4 border bg-white border-gray-200 w-72 rounded-xl">
                        <div className="flex flex-row items-center gap-3">
                            <Image src="/images/user/user-02.png" height="45" width="45" className="border border-green-500 rounded-full" />
                            <div className="flex flex-col">
                                <span className="text-black text-lg font-semibold">{coord?.fullname}</span>
                                <span className="text-xs">{coord?.professionalTitle}</span>
                            </div>
                        </div>
                    </div>,
                    popupContent
                );


                marker.on('click', () => {
                    if (map) {
                        map.setView([coord.coordinates.latitude, coord.coordinates.longitude], 11, { animate: true }); // Zoom level 11
                    }
                });
            });


            if (freelancerId && othersCoordinates) {
                const selectedFreelancer = othersCoordinates.find(coord => coord._id === freelancerId);
                if (selectedFreelancer && map) {

                    const selectedMarker = L.marker([selectedFreelancer.coordinates.latitude, selectedFreelancer.coordinates.longitude], { icon: customIcon2 }).addTo(map);


                    const popupContent = document.createElement('div');
                    ReactDOM.render(
                        <div className="p-4 flex flex-col gap-4 border bg-white border-gray-200 w-72 rounded-xl">
                            <div className="flex flex-row items-center gap-3">
                                <Image src="/images/user/user-02.png" height="45" width="45" className="border border-green-500 rounded-full" />
                                <div className="flex flex-col">
                                    <span className="text-black text-lg font-semibold">{selectedFreelancer.fullname}</span>
                                    <span className="text-xs">{selectedFreelancer.professionalTitle}</span>
                                </div>
                            </div>
                        </div>,
                        popupContent
                    );
                    selectedMarker.bindPopup(popupContent);


                    map.setView([selectedFreelancer.coordinates.latitude, selectedFreelancer.coordinates.longitude], 10, { animate: true });
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
                        .bindPopup(`<b>My location</b><br>Latitude: ${latitude}, Longitude: ${longitude}`);

                    setUserMarker(newMarker);
                }
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

export default MapComponent;
