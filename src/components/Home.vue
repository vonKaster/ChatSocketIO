<template>
  <div>
    <div class="text-center mt-6 text-overline" v-if="!isLoaded">
      <h2>Cargando Contenido</h2>
      <pulse-loader :color="'#3f51b5'"></pulse-loader>
    </div>
    <div v-if="isLoaded">
      <div class="left-panel">
      </div>
      <div class="right-panel">
        <h1
          style="color: black"
          v-for="user in onlineUsers"
          :key="user.uid"
        >
          {{ user.email }}
        </h1>
      </div>
    </div>
  </div>
</template>

<script>
import SocketIOService from "../services/SocketIO";
import { mapState } from "vuex";
import moment from "moment";
export default {
  name: "Home",

  data() {
    return {
      isLoaded: false,
    };
  },

  created() {
    SocketIOService.setupSocketConnection();
    document.title = "CRUD | Chat";
    moment.locale("es");
    this.isLoaded = true;
  },

  mounted() {
    console.log("Usuarios Online: ", this.onlineUsers);
  },

  beforeUnmount() {
    SocketIOService.disconnect();
  },

  methods: {},

  computed: {
    ...mapState(["onlineUsers"]),
  },

  watch: {
    onlineUsers: {
      immediate: true,
      handler(val) {
        console.log("Usuarios Online: ", val);
      },
    },
  },
};
</script>

<style scoped>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  overflow-x: hidden;
  background-color: #3f0e40;
  color: white;
}

.right-panel {
  margin-left: 260px;
}
</style>
