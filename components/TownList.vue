<template>
  <div class="town-list">
    <p
      class="list-element"
      v-for="option in options"
      :key="option.place_id"
      @click="selectOption(option)"
    >
      <i class="fas fa-map-marker-alt"></i>
      {{ option.display_name }}
    </p>
  </div>
</template>

<script>
import mapApiService from '@/services/mapApiService';
export default {
  props: {
    searchOption: String,
    type: String, // "from" or "to"
  },
  data() {
    return {
      options: [],
    };
  },
  watch: {
    async searchOption(newVal) {
      if (newVal.length < 3) {
        this.options = [];
        return;
      }
      try {
        const response = await mapApiService.searchLocation(newVal);
        this.options = response;
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des suggestions :",
          error
        );
      }
    },
  },
  methods: {
    selectOption(option) {
      this.$emit('option-selected', { option, type: this.type });
    },
  },
};
</script>

<style>
.town-list {
  border-top: none;
  max-height: 50vh;
  overflow-y: auto;
  padding: 1vh;
  margin: 1vh;
  padding-top: 0px;
  margin-top: 0px;
  padding-bottom: 0px;
  margin-bottom: 0px;
  z-index: 10;
  position: relative;
}

.list-element {
  padding: 10px;
  cursor: pointer;
  border: none;
  font-weight: bold;
  font-size: small;
  border-radius: 10px;
  
}

.list-element:hover {
  background-color: #f0f0f0;
  text-decoration: underline;
}
</style>
