<!-- <template>
  <div class="body">
    <v-card class="mx-auto pa-12" elevation="8" max-width="1000" rounded="lg">
      <div class="header">
        <v-btn
          variant="text"
          @click="retourPagePrecedente"
          icon="mdi-arrow-left"
        ></v-btn>
        <h1 class="title">WecanScape</h1>
      </div>
      <div class="content">
        <v-form class="text-center" ref="form" v-model="valid" lazy-validation>
          <div class="mb-5">
            <h2>On se connait pas encore ?</h2>
            <h3>Remédions à ça !</h3>
          </div>
          <v-row>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="user.firstName"
                :rules="[rules.required]"
                label="Prénom"
                variant="solo-filled"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="6">
              <v-text-field
                v-model="user.lastName"
                :rules="[rules.required]"
                label="Nom"
                variant="solo-filled"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.birthDate"
                :rules="[rules.required]"
                label="Date de naissance"
                type="date"
                variant="solo-filled"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.email"
                :rules="[rules.required, rules.email]"
                label="E-mail"
                variant="solo-filled"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                v-model="user.password"
                :rules="[rules.required]"
                label="Mot de passe"
                type="password"
                variant="solo-filled"
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn class="mt-5" :disabled="!valid" color="blue" @click="submit">
            En route !
          </v-btn>
        </v-form>
        <img
          class="img-form"
          src="@/assets/img/form.png"
          alt="Illustration formulaire"
        />
      </div>
    </v-card>
  </div>
</template>


<script>
export default {
  data() {
    return {
      valid: false,
      user: {
        firstName: "",
        lastName: "",
        birthDate: "",
        email: "",
        password: "",
      },
      rules: {
        required: (value) => !!value || "Ce champ est requis.",
        email: (value) => {
          const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return pattern.test(value) || "E-mail invalide.";
        },
      },
    };
  },
  methods: {
    submit() {
      if (this.$refs.form.validate()) {
        // Handle form submission, e.g., send data to the server
        console.log("Form data:", this.user);
      }
    },
    retourPagePrecedente() {
      this.$router.go(-1);
    },
  },
};
</script>
<style scoped>
html {
  overflow-y: hidden;
}

.body {
  background: linear-gradient(115deg, #4faaf5 0%, #1f30c9 100%) !important;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

.v-card {
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.header .title {
  flex: 1;
  text-align: center;
}

.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.v-form {
  max-width: 50%;
}

.img-form {
  width: 50%;
}

.mb-5 {
  margin-bottom: 32px;
}
</style> -->
<!-- src/components/Register.vue -->
<!-- <template>
  <div>
    <h1>Inscription</h1>
    <form @submit.prevent="register">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="password" v-model="password" placeholder="Mot de passe" required />
      <button type="submit">S'inscrire</button>
    </form>
    <p>{{ error }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../plugins/firebaseConfig';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const error = ref('');

    const register = async () => {
      try {
        await createUserWithEmailAndPassword(auth, email.value, password.value);
        // Redirection ou autre logique après inscription réussie
      } catch (err) {
        error.value = err.message;
      }
    };

  },
};
</script> -->
<template>
  <div>
    <h1>Inscription</h1>
    <form @submit.prevent="register">
      <input type="email" v-model="email" placeholder="Email" required />
      <input
        type="password"
        v-model="password"
        placeholder="Mot de passe"
        required
      />
      <button type="submit">S'inscrire</button>
    </form>
    <p>{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app";
import { createUserWithEmailAndPassword } from "firebase/auth";

const { $auth } = useNuxtApp();

const email = ref("");
const password = ref("");
const error = ref("");

const register = async () => {
  try {
    await createUserWithEmailAndPassword($auth, email.value, password.value);
  } catch (err) {
    error.value = err.message;
  }
};
</script>
