import { createApp } from "vue";
import "./assets/main.css";
import "./assets/fonts.css";
import "./assets/themes.css";
import "floating-vue/dist/style.css";
import App from "./App.vue";

import FloatingVue from 'floating-vue';

const app = createApp(App)

app.use(FloatingVue)

app.mount("#app");