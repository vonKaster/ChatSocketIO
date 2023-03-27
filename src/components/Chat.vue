<template>
  <div>
    <div class="text-center mt-6 text-overline" v-if="!isLoaded">
      <h2>Cargando Contenido</h2>
    </div>
    <div v-if="isLoaded">
      <div class="left-panel">
        <div class="ms-4 mr-4 container-users">
          <h2 class="text-center title">charla global</h2>
          <div class="user-container" @click="chatGlobalActive = !chatGlobalActive">
            <strong>Charla #1</strong>
          </div>
          <h2 class="text-center title">usuarios</h2>
          <div
            class="mb-2 user-container"
            v-for="user in onlineUsers"
            :key="user.email"
            @click="chatPrivateActive = !chatPrivateActive"
          >
            <div class="d-flex flex-column">
              <div class="d-flex justify-space-between">
                <p class="mb-0">
                  <strong>{{ user.name }}</strong>
                </p>
                <span v-if="user.online">
                  <v-icon color="white">mdi-circle-slice-8</v-icon>
                </span>
                <span v-else>
                  <v-icon color="white">mdi-circle-outline</v-icon>
                </span>
              </div>
              {{ user.lastSeen }}
            </div>
          </div>
        </div>
      </div>
      <div class="right-panel">
        <div v-if="chatGlobalActive">
          <div class="messages-container mt-6">
            <div
              v-for="message in serverMessages"
              :key="message.id"
              :class="
                message.sender_uid === user.uid ? 'text-right' : 'text-left'
              "
            >
              <v-chip style="color: #ffffff" color="indigo" class="mt-2">
                <v-avatar class="mr-1">
                  <img :src="message.sender_photo" />
                </v-avatar>
                <h4 class="mr-1">{{ message.sender_name }}:</h4>
                {{ message.text }}
              </v-chip>
              <p class="caption mr-2">{{ message.timestamp }}</p>
            </div>
          </div>

          <form class="message-form" @submit.prevent="sendMessage">
            <v-text-field
              solo
              type="text"
              v-model="messageText"
              placeholder="Escribe un mensaje"
            />
            <v-btn type="submit">Enviar</v-btn>
          </form>
        </div>

        <div v-if="chatPrivateActive">
          <div class="messages-container mt-6">
            <div
              v-for="message in serverPrivateMessages"
              :key="message.id"
              :class="
                message.sender_uid === user.uid ? 'text-right' : 'text-left'
              "
            >
              <v-chip style="color: #ffffff" color="indigo" class="mt-2">
                <v-avatar class="mr-1">
                  <img :src="message.sender_photo" />
                </v-avatar>
                <h4 class="mr-1">{{ message.sender_name }}:</h4>
                {{ message.text }}
              </v-chip>
              <p class="caption mr-2">{{ message.timestamp }}</p>
            </div>
          </div>

          <form class="message-form" @submit.prevent="sendMessage">
            <v-text-field
              solo
              type="text"
              v-model="messageText"
              placeholder="Escribe un mensaje"
            />
            <v-btn type="submit">Enviar</v-btn>
          </form>
        </div>

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
      messageText: "",
      serverMessages: [],
      serverPrivateMessages: [],
      chatGlobalActive: true,
      chatPrivateActive: false,
    };
  },

  created() {
    document.title = "SocketIO | Chat";
    moment.locale("es");
    SocketIOService.getInitialMessages((messages) => {
      this.serverMessages = messages;
    });
    this.isLoaded = true;
  },

  mounted() {
    SocketIOService.setupSocketConnection(this.user, this.addMessage);
    SocketIOService.socket.on("newMessage", (message) => {
      this.addMessage(message);
    });

    console.log("Usuarios Online: ", this.onlineUsers);
    console.log("Usuario Actual: ", this.user);
  },

  beforeUnmount() {
    SocketIOService.disconnect();
  },

  methods: {
    sendMessage() {
      if (this.messageText.trim() !== "") {
        const message = {
          sender_email: this.user.email,
          sender_uid: this.user.uid,
          sender_name: this.user.name,
          sender_photo: this.user.photosrc,
          text: this.messageText,
          timestamp: moment().format("MMM Do YY, h:mm a"),
        };
        SocketIOService.sendMessage(message);
        this.messageText = "";
      }
    },

    addMessage(message) {
      this.serverMessages.push(message);
      SocketIOService.emitMessage(message);
    },

    openPrivateChat(user) {
      this.chatGlobalActive = false;
      this.chatPrivateActive = true;

    },
    
  },

  computed: {
    ...mapState(["onlineUsers", "user"]),
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
  background-color: #3f51b5;
  color: white;
}

.right-panel {
  margin-left: 260px;
}

.messages-container {
  height: 60vh;
  max-height: 60vh;
  overflow-y: scroll;
}

.message-form {
  display: flex;
  margin-top: 20px;
}

.message-form input[type="text"] {
  flex-grow: 1;
  margin-right: 10px;
}

.title {
  font-size: 0.95rem !important;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.1666666667em !important;
  font-family: "Roboto", sans-serif !important;
  text-transform: uppercase !important;
}

.container-users {
  margin-top: 30%;
}

.user-container {
  background-color: #495dc4;
  border-radius: 5px;
  padding: 10px 10px 10px 10px;
}
</style>
