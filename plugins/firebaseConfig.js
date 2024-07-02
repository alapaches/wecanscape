// src/firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Remplacez ces valeurs par celles de votre configuration Firebase
export default defineNuxtPlugin((nuxtApp) => {
    const firebaseConfig = {
        apiKey: "AIzaSyCcC8CrT_hX9V-p69oVI1Q6VcpeB2WGvTc",
        authDomain: "wecanscape-8ce7e.firebaseapp.com",
        projectId: "wecanscape-8ce7e",
        storageBucket: "wecanscape-8ce7e.appspot.com",
        messagingSenderId: "646211129427",
        appId: "1:646211129427:web:a09496cbe56e7cc1daf6a6"
    };
    const app = initializeApp(firebaseConfig)
    const auth = getAuth(app)
    nuxtApp.provide("auth", auth)
})
