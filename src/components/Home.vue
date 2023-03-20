<template>
  <div>
    <div class="text-center mt-6 text-overline" v-if="loader">
      <h2>Cargando Contenido</h2>
      <pulse-loader :color="'#3f51b5'"></pulse-loader>
    </div>
    <div v-if="!loader">
      <v-card>
        <v-card-text>
          <h3 style="color: black" class="text-overline">
            Bienvenido {{ user.name }}
          </h3>
        </v-card-text>

        <v-card-text style="height: 60vh; overflow: auto" v-chat-scroll>
          <div
            :class="message.uid === user.uid ? 'text-right' : 'text-left'"
            v-for="(message, index) in messages"
            :key="index"
          >
            <v-chip color="indigo" style="color: #ffffff">
              <v-avatar class="mr-1"> <img :src="message.photo" /> </v-avatar>
              <h4 class="mr-1">{{ message.name }}:</h4>
              {{ message.message }}
            </v-chip>
            <p class="caption mr-2">{{ message.date }}</p>
          </div>
        </v-card-text>

        <v-card-text :style="{ height: cardHeight, bottom: '0' }" style="background-color: #3f51b5">
          <v-form ref="form">
            <v-textarea
              style="max-height: 260px; overflow-y: auto !important;"
              auto-grow
              rows="1"
              solo
              required
              append-icon="mdi-send"
              color="indigo"
              label="Escribe tu mensaje"
              class="mt-2"
              v-model.trim="message"
              :rules="rules"
              return-key="true"
              @keydown.enter.prevent="sendMessage"
              @input="updateCardHeight"
            ></v-textarea>
          </v-form>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import SocketIOService from '../services/SocketIO';
import { mapState, mapMutations } from "vuex";
import { db } from "../firebase";
import moment from "moment";
export default {
  name: "Home",

  data() {
    return {
      message: "",
      messages: [],
      rules: [(v) => !!v || "El mensaje es requerido"],
      cardHeight: "120px",
    };
  },

  created() {
    SocketIOService.setupSocketConnection();
    document.title = "CRUD | Chat";
    moment.locale("es");
    this.getMessages();
    const style = document.createElement("style");
    style.setAttribute("id", "custom-main-style");
    style.textContent = `
    .v-messages__message {
      color: white !important;
      font-size: 0.75rem !important;
      font-weight: 500;
      line-height: 2rem;
      letter-spacing: 0.1666666667em !important;
      font-family: "Roboto", sans-serif !important;
      text-transform: uppercase !important;
    }`;
    document.head.appendChild(style);
  },

  beforeUnmount() {
    SocketioService.disconnect();
  },

  beforeDestroy() {
    const style = document.getElementById("custom-main-style");
    if (style) {
      document.head.removeChild(style);
    }
  },

  methods: {
    sendMessage() {
      if (this.$refs.form.validate()) {
        db.collection("chats")
          .add({
            name: this.user.name,
            message: this.message,
            uid: this.user.uid,
            photo: this.user.photosrc,
            date: Date.now(),
          })
          .catch((err) => console.log(err));

        this.message = null;
        this.cardHeight = "120px";
      }
    },
    getMessages() {
      let ref = db.collection("chats").orderBy("date", "desc").limit(12);
      ref.onSnapshot((querySnapshot) => {
        this.messages = [];

        querySnapshot.forEach((doc) => {
          this.messages.unshift({
            name: doc.data().name,
            message: doc.data().message,
            photo: doc.data().photo,
            uid: doc.data().uid,
            date: moment(doc.data().date).format("lll"),
          });
        });
      });
      setTimeout(() => {
      }, 1000);
    },
    updateCardHeight() {
      const textarea = this.$refs.form.$el.querySelector("textarea");
      const scrollHeight = textarea.scrollHeight;
      this.cardHeight = scrollHeight > 120 ? "320px" : "120px";
    },
  },

  watch: {
    message(newMessage) {
      if (newMessage === "") {
        this.cardHeight = "120px";
      }
    },
  },

  computed: {
    ...mapState(["user", "loader"]),
  },
};
</script>