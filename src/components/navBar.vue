<template>
  <div>
    <v-app-bar id="navbar" class="marginBottom" app fixed>
      <v-toolbar-title>
        <router-link :to="{ name: 'home' }">
          <img class="mt-4" :src="require('../assets/logodigicard.png')" />
        </router-link>
      </v-toolbar-title>
      <v-spacer />
      <v-menu
        offset-y
        v-if="!showMenu && $vuetify.breakpoint.smAndDown"
        bottom
        left
      >
        <template v-slot:activator="{ on }">
          <v-btn color="black" v-on="on" icon>
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list color="black">
          <v-list-item
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'home' }"
            >Inicio</v-list-item
          >
          <v-list-item
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'sales' }"
            >Ventas</v-list-item
          >
          <v-list-item
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'providers' }"
            >Proveedores</v-list-item
          >
          <v-list-item
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'test' }"
            >Test</v-list-item
          >
          <v-list-item
            v-if="!userExists"
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'login' }"
            >Ingresar</v-list-item
          >
          <v-list-item
            v-if="!userExists"
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'register' }"
            >Registro</v-list-item
          >
          <v-list-item
            v-if="userExists"
            class="px-5 white--text font-weight-bold"
            :to="{ name: 'profile' }"
            >Perfil</v-list-item
          >
          <v-list-item
            class="px-5 white--text font-weight-bold"
            @click="toggleDarkMode"
            >{{
              darkModeIcon === "mdi-white-balance-sunny"
                ? "Modo Claro"
                : "Modo Oscuro"
            }}</v-list-item
          >
          <v-list-item
            v-if="userExists"
            class="px-5 white--text font-weight-bold"
            @click="signOut()"
            >Cerrar Sesión</v-list-item
          >
        </v-list>
      </v-menu>
      <v-toolbar-items v-if="!showMenu && $vuetify.breakpoint.mdAndUp">
        <v-btn color="black" v-if="userExists" :to="{ name: 'chat' }"
          ><v-icon class="mr-1">mdi-message-bulleted</v-icon>Chat</v-btn
        >
        <v-btn color="black" v-if="!userExists" :to="{ name: 'login' }"
          ><v-icon class="mr-1">mdi-login</v-icon>Ingresar</v-btn
        >
        <v-btn color="black" v-if="!userExists" :to="{ name: 'register' }"
          ><v-icon class="mr-1">mdi-account-plus</v-icon>Registro</v-btn
        >
        <v-btn color="black" v-if="userExists" :to="{ path: 'profile' }"
          ><v-avatar color="#d9d9d9" size="24" class="mr-1"
            ><img :src="user.photosrc" /></v-avatar
          >Perfil</v-btn
        >
        <v-btn
          @click="signOut()"
          v-if="userExists"
          style="color: red !important"
          ><v-icon class="mr-1">mdi-logout</v-icon>cerrar sesión</v-btn
        >
        <v-btn color="black" @click="toggleDarkMode">
          <v-icon>{{ darkModeIcon }}</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "navBar",
  data() {
    return {
      showMenu: false,
      darkModeIcon: "mdi-weather-night",
    };
  },
  mounted() {
    const isDarkMode = localStorage.getItem("isDarkMode") === "true";
    this.$vuetify.theme.dark = isDarkMode;
    this.darkModeIcon = isDarkMode
      ? "mdi-white-balance-sunny"
      : "mdi-weather-night";
  },
  methods: {
    ...mapActions(["signOut"]),
    toggleDarkMode() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark;
      this.darkModeIcon = this.$vuetify.theme.dark
        ? "mdi-white-balance-sunny"
        : "mdi-weather-night";
      localStorage.setItem("isDarkMode", this.$vuetify.theme.dark);
    },
  },
  computed: {
    ...mapGetters(["userExists"]),
    ...mapState(["user"]),
  },
};
</script>

<style scoped>
#navbar {
  background-color: #ffffff;
}

.theme--dark #navbar {
  background-color: #272727;
}
.theme--dark .v-btn {
  background-color: #272727 !important;
  color: white;
}

.theme--dark .v-btn:before {
  background-color: #272727 !important;
}

.v-btn {
  background-color: #ffffff !important;
  color: black;
}

.v-btn:hover {
  color: #3f51b5;
}

.v-btn--active {
  color: #3f51b5 !important;
}

.v-btn--is-elevated {
  box-shadow: none !important;
}

.v-btn:before {
  background-color: #ffffff !important;
}
</style>
