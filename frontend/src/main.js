import { createApp } from "vue"
import "./style.css"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import axios from "axios"

// Set axios base URL
axios.defaults.baseURL = 'http://localhost:3000'

const app = createApp(App)

app.use(router)
app.use(store)
app.mount("#app")
