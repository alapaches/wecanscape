import startIconUrl from "@/assets/img/start.png";
import endIconUrl from "@/assets/img/end.png";
import stepIconUrl from "@/assets/img/step.png";

async function loadLeaflet() {
    const [L, LRM, LCG] = await Promise.all([
        import("leaflet"),
        import("leaflet-routing-machine"),
        import("leaflet-control-geocoder")
    ]);

    console.log("Leaflet: ", L);
    console.log("Leaflet Routing Machine: ", LRM);
    console.log("Leaflet Control Geocoder: ", LCG);

    L.Routing = LRM.default;
    L.Control.Geocoder = LCG.default;

    return L;
}

export default defineNuxtPlugin(() => {
    return {
        provide: {
            createMarker: async (map, location) => {
                const L = await loadLeaflet();
                return L.marker([location.lat, location.lng], {
                    icon: L.icon({
                        iconUrl: stepIconUrl,
                        iconRetinaUrl: stepIconUrl,
                        iconSize: [41, 41],
                        popupAnchor: [1, -34],
                    }),
                }).addTo(map);
            },
            createRouteControl: async (map, route) => {
                const L = await loadLeaflet();

                let waypoints = [];
                if (route.waypoints) {
                    waypoints = [
                        L.latLng(route.coordinates[0]),
                        ...route.waypoints.map((coord) => L.latLng(coord)),
                        L.latLng(route.coordinates[1]),
                    ];
                } else {
                    waypoints = [
                        L.latLng(route.coordinates[0]),
                        L.latLng(route.coordinates[1]),
                    ];
                }

                return L.Routing.control({
                    waypoints: waypoints,
                    lineOptions: {
                        styles: [{ color: "blue", opacity: 0.6, weight: 3 }],
                    },
                    createMarker: function (i, waypoint, n) {
                        let iconUrl;
                        if (i === 0) {
                            iconUrl = startIconUrl;
                        } else if (i === n - 1) {
                            iconUrl = endIconUrl;
                        } else {
                            iconUrl = stepIconUrl;
                        }
                        return L.marker(waypoint.latLng, {
                            icon: L.icon({
                                iconUrl: iconUrl,
                                iconRetinaUrl: iconUrl,
                                iconSize: [41, 41],
                                popupAnchor: [1, -34],
                            }),
                        });
                    },
                    router: L.Routing.osrmv1({
                        language: "fr",
                        serviceUrl: "https://router.project-osrm.org/route/v1",
                    }),
                }).addTo(map);
            },
            fitMapToBounds: async (map, startPoint, endPoint) => {
                const L = await loadLeaflet();

                if (startPoint && endPoint) {
                    const bounds = L.latLngBounds([startPoint, endPoint]);
                    map.fitBounds(bounds);
                }
            }
        }
    };
});
