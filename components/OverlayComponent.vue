<template>
  <div class="container">
    <h3 class="mt-3">WecanScape</h3>
    <search-component
      @stopRoute="$emit('stopRoute')"
      @selectRoute="$emit('selectRoute', $event)"
      @locationSelected="$emit('locationSelected', $event)"
    ></search-component>
    <div class="route-info pb-5" v-if="distance != 0 && time != 0">
      <strong>{{ distance }} km</strong>
      <strong>{{ formattedTime }}</strong>
    </div>
  </div>
</template>

<script>
import SearchComponent from "./SearchComponent.vue";
export default {
  components: { SearchComponent },
  props: {
    distance: {
      type: String,
      default: "0",
    },
    time: {
      type: String,
      default: "0",
    },
  },
  data() {
    return {
      routeDistance: 0, // Variable pour stocker la distance
      routeTime: 0, // Variable pour stocker le temps
    };
  },
  computed: {
    formattedTime() {
      const timeInMinutes = parseFloat(this.time);
      if (timeInMinutes >= 60) {
        const hours = Math.floor(timeInMinutes / 60);
        const minutes = timeInMinutes % 60;
        return `${hours} h ${minutes.toFixed(0)} minutes`;
      }
      return `${timeInMinutes.toFixed(2)} minutes`;
    },
  },
};
</script>

<style>
h3 {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}

/* Style pour afficher les informations de kilométrage et de temps */
.route-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.3),
    0 2px 6px 2px rgba(60, 64, 67, 0.15);
  display: flex;
  flex-direction: column;
  position: absolute;
  margin: 1%;
  border-radius: 15px;
  background-color: white;
  z-index: 2;
  align-items: stretch;
  width: 17%;
}
</style>
