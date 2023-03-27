import Vue from "vue";
import Vuex from "vuex";
import router from "@/router";
import Auth from "@/services/Authentication";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    Auth: new Auth(),
    user: null,
    error: null,
    success: null,
    loader: false,
    onlineUsers: [],
  },
  getters: {},
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setSuccess(state, payload) {
      state.success = payload;
    },
    setOnlineUsers(state, users) {
      state.onlineUsers = users;
    },
  },
  actions: {
    async createUser(state, credentials) {
      return new Promise(async (resolve, reject) => {
        try {
          let createdUser = await state.state.Auth.createUser(credentials);
          state.commit("setUser", createdUser);
          router.push("/chat");
          location.reload();
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    async signIn(state, { provider, credentials }) {
      return new Promise(async (resolve, reject) => {
        try {
          let userLoggedIn = await state.state.Auth.signIn({
            provider,
            credentials,
          });
          console.log("STATE USER ANTES", state.state.user);
          state.commit("setUser", userLoggedIn);
          console.log("STATE USER", state.state.user);
          router.push("/");
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    async signOut(state) {
      const user = state.state.user;
      return new Promise(async (resolve, reject) => {
        try {
          console.log("user antes", user);
          await state.state.Auth.signOut(user);
          router.push("/login");
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    detectUser({ commit }, user) {
      commit("setUser", user);
    },

    async changeUserName(state, name) {
      const user = state.state.user;
      return new Promise(async (resolve, reject) => {
        try {
          let response = await state.state.Auth.changeUserName(name, user);
          if (response) {
            state.commit("setSuccess", "nameSuccess");
            state.commit("setError", null);
          } else {
            state.commit("setError", "nameErr");
            state.commit("setSuccess", null);
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    async changePassword(state, passwd) {
      return new Promise(async (resolve, reject) => {
        try {
          let response = await state.state.Auth.changePassword(passwd);
          if (response === "success") {
            state.commit("setError", null);
            state.commit("setSuccess", "passwdSuccess");
          } else {
            state.commit("setError", response.code);
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },

    async listUsers(state) {
      return new Promise(async (resolve, reject) => {
        try {
          let users = await state.state.Auth.listUsers();
          console.log("response users", users);
          state.commit("setOnlineUsers", users);
          resolve(true);
        } catch (error) {
          reject(error);
        }
      });
    },
  },
  modules: {},
  getters: {
    userExists(state) {
      if (state.user === null) {
        return false;
      } else {
        return true;
      }
    },
  },
});
