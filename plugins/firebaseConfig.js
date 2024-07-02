// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Remplacez ces valeurs par celles de votre configuration Firebase
export default defineNuxtPlugin((nuxtApp) => {
    const firebaseConfig = {
        apiKey: "AIzaSyAdIom0qlw9C5B3BfLJ2-uhBEX_KMxYqAs ",
        authDomain: "wekanscape.web.app",
        projectId: "wekanscape",
        storageBucket: "gs://wekanscape.appspot.com",
        messagingSenderId: "803651484787",
        appId: "1:803651484787:web:736c6d72fac9994ae77e06"
    };
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    nuxtApp.provide("auth", auth)
})
