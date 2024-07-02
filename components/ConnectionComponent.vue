<!-- src/components/Login.vue -->
<template>
  <div>
    <h1>Connexion</h1>
    <form @submit.prevent="login">
      <input type="email" v-model="email" placeholder="Email" required />
      <input
        type="password"
        v-model="password"
        placeholder="Mot de passe"
        required
      />
      <button type="submit">Se connecter</button>
    </form>
    <p>{{ error }}</p>
    <button @click="loginWithGoogle">Se connecter avec Google</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useNuxtApp } from "#app";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

const { $auth } = useNuxtApp();

const email = ref("");
const password = ref("");
const error = ref("");

const login = async () => {
  try {
    await signInWithEmailAndPassword($auth, email.value, password.value);
    console.log("oui");
    // Redirection ou autre logique après connexion réussie
  } catch (err) {
    error.value = err.message;
  }
};

const loginWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup($auth, provider);
    console.log("oui");
    // Redirection ou autre logique après connexion réussie
  } catch (err) {
    error.value = err.message;
  }
};

// return { email, password, error, login, loginWithGoogle };
</script>