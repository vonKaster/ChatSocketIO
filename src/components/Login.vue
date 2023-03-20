<template>
  <v-container class="">
    <v-row>
      <v-container class="formLoginContainer">
        <h1 class="text-center">Acceso</h1>
        <br />
        <v-form
          @submit.prevent="
            signIn({
              provider: 'email',
              credentials: { email: $v.email.$model, passwd: $v.passwd.$model },
            })
          "
        >
          <v-text-field
            color="#e6105b"
            outlined
            type="email"
            placeholder="Ingrese su correo electŕonico"
            v-model.trim="$v.email.$model"
            append-icon="mdi-account"
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
            :error-messages="emailErrors"
          />
          <div class="d-flex">
            <v-text-field
              class="flex-grow-1"
              color="#e6105b"
              outlined
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingrese su contraseña"
              v-model.trim="$v.passwd.$model"
              append-icon="mdi-lock"
              @input="$v.passwd.$touch()"
              @blur="$v.passwd.$touch()"
              :error-messages="passwdErrors"
            />
            <v-btn
              icon
              @click="showPassword = !showPassword"
              :color="showPassword ? '#e6105b' : undefined"
              class="ml-2 mt-2"
            >
              <v-icon>{{ showPassword ? "mdi-eye-off" : "mdi-eye" }}</v-icon>
            </v-btn>
          </div>
          <v-btn
            :disabled="$v.$invalid"
            style="color: #ffffff"
            color="#e6105b"
            type="submit"
            >Ingresar</v-btn
          >
        </v-form>
        <p
          v-show="error === 'auth/user-not-found'"
          style="color: #ff5252"
          class="text-center mt-4 text-overline"
        >
          Usuario Incorrecto
        </p>
        <p
          v-if="error === 'auth/wrong-password'"
          style="color: #ff5252"
          class="text-center mt-4 text-overline"
        >
          Contraseña incorrecta
        </p>
        <p
          v-if="error === 'auth/too-many-requests'"
          style="color: #ff5252"
          class="text-center mt-4 text-overline"
        >
          Se congeló el acceso a esta cuenta temporalmente debido a muchos
          intentos fallidos.
        </p>
        <br />
        <v-divider :thickness="4"></v-divider>
        <v-container>
          <div class="mx-auto text-center">
            <v-btn
              @click="signIn({ provider: 'google' })"
              x-large
              icon
              color="#e6105b"
              ><v-icon>mdi-google</v-icon></v-btn
            >
            <v-btn
              @click="signIn({ provider: 'github' })"
              x-large
              icon
              color="#e6105b"
              ><v-icon>mdi-github</v-icon></v-btn
            >
            <v-btn
              @click="signIn({ provider: 'facebook' })"
              x-large
              icon
              color="#e6105b"
              ><v-icon>mdi-facebook</v-icon></v-btn
            >
          </div>
        </v-container>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { required, minLength, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";

export default {
  name: "Login",
  mixins: [validationMixin],

  data() {
    return {
      email: "",
      passwd: "",
      showPassword: false,
    };
  },

  created() {
    document.title = "MVCShop | Acceso";
    const style = document.createElement("style");
    style.setAttribute("id", "custom-main-style");
    style.textContent = `
    main {
        background-image: url(https://svgur.com/i/qnR.svg);
        background-position: bottom center;
      }
    .v-footer {
      background-color: #e6105b!important;
      color: white!important;
    }
    .v-footer .footerLink {
      color: white!important;
      text-decoration: none;
      }
      .v-application .elevation-3 {
      box-shadow: none!important;
    }
    .theme--dark .custom-footer{
      background-color: #e6105b!important;
      color: white!important;
    }
      @media (max-width: 600px) {
        main {
          padding-top: 168px!important;
        }
      }
    `;
    document.head.appendChild(style);
  },

  updated() {
    if (
      this.error === "auth/user-not-found" ||
      this.error === "auth/wrong-password" ||
      this.error === "auth/too-many-requests"
    ) {
      this.createSpacer();
    }
  },

  beforeDestroy() {
    const style = document.getElementById("custom-main-style");
    const spacer = document.getElementById("custom-spacer");
    if (style) {
      document.head.removeChild(style);
    }
    if (spacer) {
      document.head.removeChild(spacer);
    }
    this.setError(null);
  },

  computed: {
    ...mapState(["error"]),
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("El email es inválido");
      !this.$v.email.required && errors.push("El email es requerido");
      return errors;
    },
    passwdErrors() {
      const errors = [];
      if (!this.$v.passwd.$dirty) return errors;
      !this.$v.passwd.minLength &&
        errors.push("Las contraseñas contienen al menos 6 caracteres");
      !this.$v.passwd.required && errors.push("La contraseña es requerida");
      return errors;
    },
  },

  methods: {
    ...mapActions(["signIn"]),
    ...mapMutations(["setError"]),

    createSpacer() {
      const style = document.createElement("style");
      style.setAttribute("id", "custom-spacer");
      style.textContent = `
      @media (max-width: 600px) {
        .formLoginContainer {
           height: 80vh;
        }
      }
      
    `;
      document.head.appendChild(style);
    },
  },

  validations: {
    email: { required, email },
    passwd: { required, minLength: minLength(6) },
  },
};
</script>

<style>
.text-field-wrapper {
  width: 100%;
  display: inline-block;
}

.formLoginContainer {
  width: 500px !important;
  height: 305px;
  border-radius: 5px;
}
.formLoginContainer button {
  width: 100%;
}
.formLoginContainer h1,
h2 {
  font-weight: 400;
}
</style>
