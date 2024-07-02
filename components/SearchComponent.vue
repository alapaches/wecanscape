<template>
  <form>
    <div class="input-container">
      <!-- Départ -->
      <div>
        <div class="waypoint">
          <div class="input-wrapper">
            <!-- <v-text-field
            placeholder="Départ"
            v-model="from"
            prepend-inner-icon="mdi-map-marker"
            variant="solo-filled"
             @focus="showFromList"
            append-inner-icon="mdi-crosshairs-gps"
          @click:append-inner="useCurrentLocation()"
        ></v-text-field> -->
            <i class="fas fa-map-marker-alt searchIcon"></i>
            <input
              class="input-waypoint"
              v-model="from"
              placeholder="Départ"
              @focus="showFromList"
            />
            <button class="remove-button" @click.prevent="useCurrentLocation()">
              <i :class="{ fas: true, 'fa-crosshairs': true }"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Étapes -->
      <div
        v-for="(waypoint, index) in waypoints"
        :key="index"
        :class="{ dragging: dragIndex === index }"
      >
        <div class="waypoint">
          <div class="input-wrapper">
            <i class="far fa-regular fa-circle searchIcon"></i>
            <input
              class="input-waypoint"
              v-model="waypoint.location"
              placeholder="Ajouter une étape"
              @input="searchWaypointOptions(index)"
            />
            <button
              class="remove-button"
              @click.prevent="removeWaypoint(index)"
            >
              <i
                :class="{ 'fas fa-times': true, 'gray-cross': !hoverCross }"
              ></i>
            </button>
          </div>
        </div>
        <div class="town-list" v-if="waypoint.options.length">
          <p
            class="list-element"
            v-for="option in waypoint.options"
            :key="option.place_id"
            @click="selectWaypointOption(index, option)"
          >
            {{ option.display_name }}
          </p>
        </div>
      </div>

      
      <v-btn
        v-if="from && to"
        @click="addWaypoint"
        color="blue"
        variant="tonal"
        prepend-icon="mdi-plus"
        class="ma-3 text-none"
      >
        Ajouter une étape
      </v-btn>

      <!-- Destination -->
      <div>
        <div class="input-wrapper">
          <i class="fas fa-flag-checkered searchIcon"></i>
          <input v-model="to" placeholder="Destination" @focus="showToList" />
        </div>
      </div>

      <!-- Ajouter une Étapes -->


      <!-- <button
        v-if="from && to"
        class="add-waypoint"
        type="button"
        @click="addWaypoint"
      >
        <i class="fas fa-plus"></i>
        Ajouter une étape
      </button> -->

      <!-- Arrêter la recherche -->
      <a class="stopSearch" v-if="from && to" @click="stopRoute"> Stopper la recherche </a>
    </div>
    <town
      v-if="showFromOptions"
      :searchOption="from"
      type="from"
      @option-selected="handleOptionSelected"
    />
    <town
      v-if="showToOptions"
      :searchOption="to"
      type="to"
      @option-selected="handleOptionSelected"
    />
  </form>
</template>

<script>
import mapApiService from "@/services/mapApiService";
import geolocationService from "@/services/geolocationService";
import town from "./TownList.vue";

export default {
  components: { town },
  data() {
    return {
      from: "",
      to: "",
      toOptions: [],
      waypoints: [],
      route: [],
      dragging: false,
      dragIndex: null,
      dragOverIndex: null,
      dragStartY: 0,
      showFromOptions: false,
      showToOptions: false,
    };
  },
  methods: {
    async handleOptionSelected({ option, type }) {
      if (type === "from") {
        this.from = option.display_name;
        let latitude = parseFloat(option.lat);
        let longitude = parseFloat(option.lon);
        this.showFromOptions = false;
        if (this.to === "") {
          this.$emit("locationSelected", {
            lat: latitude,
            lng: longitude,
          });
        }
      } else if (type === "to") {
        this.to = option.display_name;
        let latitude = parseFloat(option.lat);
        let longitude = parseFloat(option.lon);
        this.showToOptions = false;
        if (this.from === "") {
          this.$emit("locationSelected", {
            lat: latitude,
            lng: longitude,
          });
        }
      }
      this.updateRoute();
    },

    //Met à jour le tracé de l'itinéraire
    async updateRoute() {
      try {
        let fromCoords;
        // On regarde si on ville à était séléctionner comme point de départ et on récupère ses coordonnées ou sinon on utilise la localisation
        if (this.from) {
          fromCoords = await mapApiService.getCoordinates(this.from);
        } else {
          const position = await geolocationService.getCurrentPosition();
          fromCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
        }

        //On récupére les coordonnées de la desination
        const toCoords = await mapApiService.getCoordinates(this.to);
        this.route = {
          coordinates: [
            [fromCoords.lat, fromCoords.lng],
            [toCoords.lat, toCoords.lng],
          ],

          // par défault, la liste d'étape est vide
          waypoints: [],
        };
        // On boucle sur les étapes
        for (let waypoint of this.waypoints) {
          // Si on a des étapes
          if (waypoint.location) {
            // On récupére les coordonnées
            const waypointCoords = await mapApiService.getCoordinates(
              waypoint.location
            );
            // On les ajoutent pour le tracer de la route
            this.route.waypoints.push([waypointCoords.lat, waypointCoords.lng]);
          }
        }

        this.$emit("selectRoute", this.route);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'itinéraire :",
          error
        );
      }
    },
    
    //Utilisation de la géolocalisation de l'utilisateur
    async useCurrentLocation() {
      try {
        // On récupère la position actuelle de l'utilisateur avec le service de geolocalisation
        const position = await geolocationService.getCurrentPosition();
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // A partir des coordonnées on récupère une adresse
        const locationData = await mapApiService.getLocationData(lat, lng);
        this.from = locationData.city;
        this.updateRoute();
      } catch (error) {
        if(error.code == 1) {
          console.error("Erreur de géolocalisation :", error);
        }
      }
    },

    //Permet d'ajouter une étape à l'itinéraire
    addWaypoint() {
      this.waypoints.push({ location: "", options: [] });
    },

    // Fait la recherche dans l'api pour récupérer la localisation de la waypoint
    async searchWaypointOptions(index) {
      const waypoint = this.waypoints[index];
      if (waypoint.location.length < 3) {
        waypoint.options = [];
        return;
      }
      try {
        const options = await mapApiService.searchLocation(waypoint.location);
        console.log(options);
        // Met à jour directement l'objet dans l'array réactif
        this.waypoints[index] = { ...waypoint, options };
      } catch (error) {
        console.error(
          `Erreur lors de la récupération des suggestions pour l'étape ${
            index + 1
          } :`,
          error
        );
      }
    },

    //Retire une étape de l'itinéraire et met à jour le tracé
    removeWaypoint(index) {
      this.waypoints.splice(index, 1);
      this.updateRoute();
    },

    selectWaypointOption(index, option) {
      // Met à jour directement l'objet dans l'array réactif
      this.waypoints[index] = {
        location: option.display_name,
        options: [],
      };
      this.updateRoute();
    },

    // Réinitialise les valeurs des variables de création d'une route et emet un signal pour le composant parent
    stopRoute() {
      this.from = "";
      this.to = "";
      this.waypoints = [];
      this.$emit("stopRoute");
    },
    // Affiche la recherche pour le from et cache celle du to
    showFromList() {
      this.showFromOptions = true;
      this.showToOptions = false;
    },
    // Affiche la recherche pour le to et cache celle du from
    showToList() {
      this.showToOptions = true;
      this.showFromOptions = false;
    },
    startDrag(event, index) {
      this.dragging = true;
      this.dragIndex = index;
      this.dragStartY = event.clientY;
      document.addEventListener("mousemove", this.onDrag);
      document.addEventListener("mouseup", this.endDrag);
    },
    onDrag(event) {
      if (!this.dragging) return;

      const dragOverElement = document.elementFromPoint(
        event.clientX,
        event.clientY
      );
      const newDragOverIndex = [
        ...dragOverElement.parentElement.children,
      ].indexOf(dragOverElement);

      console.log(
        `Dragging over index: ${newDragOverIndex}, Current drag index: ${this.dragIndex}`
      );

      if (
        newDragOverIndex !== this.dragOverIndex &&
        newDragOverIndex >= 0 &&
        newDragOverIndex < this.waypoints.length
      ) {
        this.dragOverIndex = newDragOverIndex;
        const draggedItem = this.waypoints.splice(this.dragIndex, 1)[0];
        this.waypoints.splice(this.dragOverIndex, 0, draggedItem);
        this.dragIndex = this.dragOverIndex;
      }
    },
    endDrag() {
      this.dragging = false;
      this.dragIndex = null;
      this.dragOverIndex = null;
      document.removeEventListener("mousemove", this.onDrag);
      document.removeEventListener("mouseup", this.endDrag);
      this.updateRoute();
    },
  },
};
</script>

<style scoped>
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css");

.input-container {
  padding: 1vh;
  display: flex;
  flex-direction: column;
}

.input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 10px;
  background-color: #f0f0f0;
  padding: 1vh;
  margin: 1vh;
  justify-content: flex-start;
}

.searchIcon {
  color: #b4b4b4;
}

.input-waypoint {
  flex: 1;
  padding-right: 2em;
}

input {
  border: none;
  padding: 5px;
  font-size: large;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande",
    "Lucida Sans", Arial, sans-serif;
  transition: width 0.3s;
  background-color: transparent;
  outline: none;
}

input::placeholder {
  color: #424242;
}

.stopSearch {
  display: flex;
  justify-content: center;
  padding: 1vh;
  cursor: pointer;
}

.stopSearch:hover {
  text-decoration: underline;
}

.waypoint {
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
}

.dragging {
  background-color: #f0f0f0;
  border-radius: 15px;
}

.add-waypoint {
  background-color: white;
  border: 1px solid gray;
  padding: 1vh;
  margin: 1vh;
  border-radius: 10px;
}

.add-waypoint:hover {
  color: white;
  background-color: black;
}

.remove-button {
  position: absolute;
  right: 0.5em;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-button i {
  pointer-events: none;
}

.remove-button:hover {
  background-color: #f0f0f0;
}
</style>
