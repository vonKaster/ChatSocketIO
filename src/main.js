import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueMeta from "vue-meta";
import { auth, database } from "./firebase";
import Vuelidate from "vuelidate";
import vuetify from "./plugins/vuetify";

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
    });
    userRef.onDisconnect().set({ uid: user.uid, name: user.displayName, email: user.email, online: false });
    store.dispatch("listenToOnlineUsers");
    store.dispatch("detectUser", detectedUser);
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
