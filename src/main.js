import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueMeta from "vue-meta";
import { auth, database } from "./firebase";
import Vuelidate from "vuelidate";
import vuetify from "./plugins/vuetify";
import moment from "moment";

Vue.use(VueMeta);
Vue.use(Vuelidate);
Vue.config.productionTip = false;

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log(user);
    const detectedUser = {
      name: user.displayName,
      email: user.email,
      uid: user.uid,
      photosrc: user.photoURL,
      provider: user.providerData[0].providerId,
    };
    const userRef = database.ref(`users/${user.uid}`);
    userRef.set({
      uid: user.uid,
      name: user.displayName,
      email: user.email,
      online: true,
      lastSeen: 'en línea', // Agrega el campo lastSeen vacío
    });
    userRef.onDisconnect().update({
      online: false,
      lastSeen: moment().format("MMM Do YY, h:mm a"), // Actualiza lastSeen con la fecha y hora de desconexión formateada
    });
    store.dispatch("detectUser", detectedUser);
    store.dispatch("listenToOnlineUsers");
  } else {
    store.dispatch("detectUser", user);
  }

  new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
  }).$mount("#app");
});
