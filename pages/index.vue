<template>
  <div id="map" style="height: 100vh">
    <overlay
      @stopRoute="stopRoute"
      @selectRoute="showRoute"
      @locationSelected="handleLocationSelected"
      :distance="routeDistance"
      :time="routeTime"
    ></overlay>

    <account></account>

    <client-only>
      <l-map :zoom="zoom" :center="center" style="height: 100%">
        <l-tile-layer
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          :subdomains="['mt0', 'mt1', 'mt2', 'mt3']"
        ></l-tile-layer>
        <l-marker
          v-if="startMarker"
          :lat-lng="[startMarker.lat, startMarker.lng]"
        ></l-marker>
        <l-marker
          v-if="endMarker"
          :lat-lng="[endMarker.lat, endMarker.lng]"
        ></l-marker>
      </l-map>
    </client-only>
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import Overlay from "~/components/OverlayComponent.vue";
import Account from "~/components/ConnexionComponent.vue";
import { onMounted, ref } from "vue";
import { useNuxtApp } from "#app";

const zoom = ref(null); //8
const center = ref(null); //[48.0061, 0.1996],
const map = ref(null); //null,
const routeControl = ref(null); //null,
const startMarker = ref(null); // null,
const endMarker = ref(null); // null,
const routeDistance = ref(null); //0,
const routeTime = ref(null); //0,

onMounted(async () => {
  zoom.value = 8;
  (center.value = [48.0061, 0.1996]),
    (map.value = null),
    (routeControl.value = null),
    (startMarker.value = null),
    (endMarker.value = null),
    (routeDistance.value = 0),
    (routeTime.value = 0);

});

const zoomToLocation = (lat, lng) => {
  zoom.value = 13;
  center.value = [lat, lng];
};

const handleLocationSelected = (location) => {
  zoomToLocation(location.lat, location.lng);
  startMarker.value = location;
};

const showRoute = async (route) => {
  const { $createRouteControl, $fitMapToBounds } = useNuxtApp();
  removeMarkers();
  if (routeControl.value) {
    map.value.removeControl(routeControl.value);
  }

  routeControl.value = await $createRouteControl(map.value, route);
  routeControl.value.on("routesfound", (e) => {
    var routes = e.routes;
    var summary = routes[0].summary;
    routeDistance.value = (summary.totalDistance / 1000).toFixed(0);
    routeTime.value = (summary.totalTime / 60).toFixed(2);

    // Emit events to update Overlay component
  });

  await $fitMapToBounds(map.value, route.coordinates[0], route.coordinates[1]);
};

const removeMarkers = () => {
  startMarker.value = null;
  endMarker.value = null;
};

const stopRoute = () => {
  if (routeControl.value) {
    map.value.removeControl(routeControl.value);
    routeDistance.value = 0;
    routeTime.value = 0;

    // Emit events to update Overlay component
  }
};
</script>

<script>
export default {
  name: "MapView",
  components: {
    Overlay,
    Account,
  },
};
</script>

<style>
.leaflet-container {
  z-index: 1;
  width: 100%;
  height: 100vh;
}

html {
  overflow: hidden;
}
</style>
