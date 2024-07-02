<template>
  <v-dialog max-width="500">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn icon="fa-user" v-bind="activatorProps" class="account-button">
        <i :class="{ fas: true, 'fa-user': true }"></i>
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="mx-auto pa-12 pb-3" elevation="8" width="480" rounded="lg">
        <h2 class="pb-4 text-center">On se connait ?</h2>

        <v-text-field
          placeholder="Adresse mail"
          prepend-inner-icon="mdi-email-outline"
          variant="solo-filled"
        ></v-text-field>

        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          placeholder="Mot de passe"
          prepend-inner-icon="mdi-lock-outline"
          variant="solo-filled"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <!-- <div
            class="text-subtitle-1 mb-5 text-medium-emphasis d-flex align-center justify-end"
          >  
            <a
              class="text-caption text-decoration-none text-blue"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              Mot de passse oublié ?
            </a>
          </div> -->

        <v-btn
          class="mb-2"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="isActive.value = false"
        >
          Me connecter
        </v-btn>
        <v-card-text class="text-center">
          <RouterLink
            class="text-blue text-decoration-none"
            to="/inscription"
          >
            Créez votre compte ici
            <v-icon icon="mdi-chevron-right"></v-icon>
          </RouterLink>
          <RouterLink
            class="text-blue text-decoration-none"
            to="/connexion"
          >
            Connexion bis
            <v-icon icon="mdi-chevron-right"></v-icon>
          </RouterLink>
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>
</template>

<script>
export default {
  data: () => ({
    visible: false,
  }),
};
</script>

<style>
.account-button {
  right: 0px;
  position: absolute;
  margin: 1%;
  z-index: 2;
}
</style>