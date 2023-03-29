<template>
  <div>
    <div class="text-center mt-6 text-overline" v-if="!isLoaded">
      <h2>Cargando Contenido</h2>
    </div>
    <div v-if="isLoaded">
      <div class="left-panel">
        <div class="ms-4 mr-4 container-users">
          <h2 class="text-center title">usuarios</h2>
          <div>
            <v-text-field
              solo
              label="Buscar usuario"
              v-model="searchTerm"
              type="text"
            />
            <v-divider class="mb-4"></v-divider>
          </div>
          <div
            class="mb-2 user-container"
            v-for="user in filteredUsers"
            :key="user.email"
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
              <div>
                <v-chip
                  v-if="Object.keys(message.replyTo).length > 0"
                  style="color: #ffffff"
                  color="rgba(89, 114, 238, 0.3)"
                  class="mt-2"
                >
                  <v-avatar class="mr-1">
                    <img :src="message.replyTo.sender_photo" />
                  </v-avatar>
                  <h4 class="mr-1">{{ message.replyTo.sender_name }}:</h4>
                  <h4 class="mr-1">{{ message.replyTo.text }}</h4>
                  <v-icon small>mdi-reply-all</v-icon>
                </v-chip>
                <div>
                  <v-chip
                    style="color: #ffffff; overflow-y: auto; min-height: 40px"
                    color="indigo"
                    class="mt-2"
                    @mouseover="hoveredMessage = message"
                    @mouseleave="hoveredMessage = null"
                  >
                    <v-avatar class="mr-1">
                      <img :src="message.sender_photo" />
                    </v-avatar>
                    <h4 class="mr-1">{{ message.sender_name }}:</h4>
                    <h4
                      class="font-weight-regular"
                      style="white-space: pre-line"
                    >
                      {{ message.text }}
                    </h4>
                    <button
                      text
                      class="btn-reply ms-2"
                      v-if="hoveredMessage === message"
                      @click="selectMessage(message)"
                    >
                      <v-icon>mdi-reply-outline</v-icon>
                    </button>
                    <button
                      text
                      class="btn-reply ms-2"
                      v-if="
                        hoveredMessage === message &&
                        message.sender_uid === user.uid
                      "
                      @click="openDeleteDialog(message)"
                    >
                      <v-icon>mdi-delete</v-icon>
                    </button>
                    <button
                      class="btn-reply ms-2"
                      v-if="
                        hoveredMessage === message &&
                        message.sender_uid === user.uid
                      "
                      @click="editingMessage = message"
                    >
                      <v-icon>mdi-pencil</v-icon>
                    </button>
                  </v-chip>
                </div>
              </div>
              <div class="d-inline-flex">
                <p class="caption mr-2">{{ message.timestamp }}</p>
                <p v-if="message.wasEdited" class="caption mr-2">(editado)</p>
              </div>
              <div v-if="editingMessage && editingMessage.id === message.id">
                <v-form @submit.prevent="updateMessage">
                  <v-textarea v-model="editingMessage.text"></v-textarea>
                  <v-btn class="mr-2" @click="editingMessage = null"
                    >Cancelar</v-btn
                  >
                  <v-btn type="submit">Guardar cambios</v-btn>
                </v-form>
              </div>
            </div>
          </div>

          <div
            v-if="selectedMessage.id && !deleteDialog"
            class="selected-message d-flex align-center"
          >
            <div>
              <v-btn text @click="selectedMessage = {}"
                ><v-icon>mdi-close</v-icon></v-btn
              >
              <v-chip style="color: #ffffff" color="indigo">
                <v-avatar class="mr-1">
                  <img :src="selectedMessage.sender_photo" />
                </v-avatar>
                <h4 class="mr-1">{{ selectedMessage.sender_name }}:</h4>
                {{ selectedMessage.text }}
              </v-chip>
            </div>
          </div>
          <form class="message-form" @submit.prevent="sendMessage">
            <v-text-field
              solo
              type="text"
              v-model="messageText"
              placeholder="Escribe un mensaje"
            />
            <v-btn text class="ms-2 mt-1" type="submit"
              ><v-icon>mdi-send</v-icon></v-btn
            >
          </form>
        </div>
      </div>
    </div>
    <v-dialog width="500px" v-model="deleteDialog" persistent>
      <v-card class="text-center">
        <v-form
          @submit.prevent="
            deleteMessage(selectedMessage);
            deleteDialog = false;
          "
        >
          <v-card-title class="headline"> Eliminar Mensaje </v-card-title>
          <v-card-text>
            <h3>¿Estás seguro de eliminar este mensaje?</h3>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              @click="
                deleteDialog = false;
                selectedMessage = {};
              "
              >Cancelar</v-btn
            >
            <v-btn type="submit" color="green" text>Confirmar</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import SocketIOService from "../services/SocketIO";
import { mapState } from "vuex";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
export default {
  name: "Home",

  data() {
    return {
      isLoaded: false,
      messageText: "",
      serverMessages: [],
      chatGlobalActive: true,
      selectedMessage: {},
      hoveredMessage: null,
      deleteDialog: false,
      searchTerm: "",
      editingMessage: null,
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
    SocketIOService.socket.on("messageDeleted", (id) => {
      this.messageDeleted(id);
    });

    SocketIOService.socket.on("messageUpdated", (message) => {
      const index = this.serverMessages.findIndex((m) => m.id === message.id);
      if (index !== -1) {
        this.$set(this.serverMessages, index, message);
      }
    });

    console.log("Usuarios: ", this.onlineUsers);
    console.log("Usuario Actual: ", this.user);
  },

  beforeUnmount() {
    SocketIOService.disconnect();
  },

  methods: {
    sendMessage() {
      if (this.messageText.trim() !== "") {
        const message = {
          id: uuidv4(),
          sender_email: this.user.email,
          sender_uid: this.user.uid,
          sender_name: this.user.name,
          sender_photo: this.user.photosrc,
          text: this.messageText,
          timestamp: moment().format("MMM Do YY, h:mm a"),
          replyTo: this.selectedMessage || null, // Agregamos la referencia al mensaje seleccionado
        };

        SocketIOService.sendMessage(message);
        this.messageText = "";
        this.recipientId = null;
        this.selectedMessage = {}; // Limpiamos el mensaje selecciona
      }
    },

    addMessage(message) {
      this.serverMessages.push(message);
      SocketIOService.emitMessage(message);
    },

    selectMessage(message) {
      this.selectedMessage = message;
    },

    openDeleteDialog(message) {
      this.deleteDialog = true;
      this.selectedMessage = message;
    },

    deleteMessage(message) {
      SocketIOService.deleteMessage(message.id);
      this.selectedMessage = {};
    },

    messageDeleted(id) {
      const messageIndex = this.serverMessages.findIndex((m) => m.id === id);
      if (messageIndex !== -1) {
        this.serverMessages.splice(messageIndex, 1);
      }
    },

    updateMessage() {
      SocketIOService.updateMessage(this.editingMessage);
      this.editingMessage = null;
    },
  },

  computed: {
    ...mapState(["onlineUsers", "user"]),
    filteredUsers() {
      const regex = new RegExp(this.searchTerm, "i");
      return this.onlineUsers.filter((user) => {
        return regex.test(user.name) || regex.test(user.email);
      });
    },
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
  width: 320px;
  overflow-x: hidden;
  background-color: #3f51b5;
  color: white;
}

.right-panel {
  margin-left: 260px;
}

.messages-container {
  height: 75vh;
  max-height: 75vh;
  overflow-y: scroll;
  padding: 20px;
}

.message-form {
  display: flex;
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
  margin-top: 25%;
}

.user-container {
  background-color: #495dc4;
  border-radius: 5px;
  padding: 10px 10px 10px 10px;
}

::-webkit-scrollbar {
  width: 3px;
  margin-left: 16px !important;
}

::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.selected-message {
  background-color: #f5f5f5;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  height: 50px;
}

.theme--dark .selected-message {
  background-color: #272727;
}

.theme--dark .v-btn {
  color: white;
}

.theme--dark .v-btn:before {
  background-color: #272727 !important;
}

.v-btn {
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
