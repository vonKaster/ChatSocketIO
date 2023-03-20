<template>
  <v-container>
    <v-row>
      <v-container class="formLoginContainer">
        <h1 class="text-center">Registro</h1>
        <br />
        <v-form
          @submit.prevent="
            createUser({
              email: $v.email.$model,
              passwd: $v.passwd.$model,
              name: $v.name.$model,
            })
          "
        >
          <v-text-field
            color="#e6105b"
            append-icon="mdi-email"
            outlined
            type="email"
            placeholder="Ingrese su correo electŕonico"
            v-model="$v.email.$model"
            @input="$v.email.$touch()"
            @blur="$v.email.$touch()"
            :error-messages="emailErrors"
          />
          <v-text-field
            color="#e6105b"
            append-icon="mdi-account"
            outlined
            type="text"
            placeholder="Ingrese un usuario"
            v-model="$v.name.$model"
            @input="$v.name.$touch()"
            @blur="$v.name.$touch()"
            :error-messages="nameErrors"
          />
          <div class="d-flex">
            <v-text-field
              color="#e6105b"
              append-icon="mdi-lock"
              outlined
              :type="showPassword ? 'text' : 'password'"
              placeholder="Ingrese su contraseña"
              v-model="$v.passwd.$model"
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
          <div class="d-flex">
            <v-text-field
              color="#e6105b"
              append-icon="mdi-lock-check"
              outlined
              :type="showPasswordConfirm ? 'text' : 'password'"
              placeholder="Repita su contraseña"
              v-model="$v.passwdConfirm.$model"
              @input="$v.passwdConfirm.$touch()"
              @blur="$v.passwdConfirm.$touch()"
              :error-messages="passwdConfirmErrors"
            />
            <v-btn
              icon
              @click="showPasswordConfirm = !showPasswordConfirm"
              :color="showPasswordConfirm ? '#e6105b' : undefined"
              class="ml-2 mt-2"
            >
              <v-icon>{{
                showPasswordConfirm ? "mdi-eye-off" : "mdi-eye"
              }}</v-icon>
            </v-btn>
          </div>
          <v-btn
            class="mb-2"
            :disabled="$v.$invalid"
            color="#e6105b"
            style="color: #ffffff"
            type="submit"
            >Registrarse</v-btn
          >
          <p
            v-if="error === 'auth/email-already-in-use'"
            style="color: #ff5252"
            class="text-center mt-4 text-overline"
          >
            Ese email ya se encuentra asociado a una cuenta
          </p>
        </v-form>
      </v-container>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from "vuex";
import { required, minLength, email, sameAs } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
export default {
  name: "Register",
  mixins: [validationMixin],

  data() {
    return {
      email: "",
      name: "",
      passwd: "",
      passwdConfirm: "",
      showPassword: false,
      showPasswordConfirm: false,
    };
  },

  created() {
    document.title = "MVCShop | Registro";
    const style = document.createElement("style");
    style.setAttribute("id", "custom-main-style");
    style.textContent = `
    main {
        background-image: url(https://svgshare.com/i/qnp.svg)!important;
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
          padding-top: 90px!important;
        }
      }
    `;
    document.head.appendChild(style);
  },

  updated() {
    if (this.error === "auth/email-already-in-use") {
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

  methods: {
    ...mapActions(["createUser"]),
    ...mapMutations(["setError"]),

    createSpacer() {
      const style = document.createElement("style");
      style.setAttribute("id", "custom-spacer");
      style.textContent = `
      @media (max-width: 600px) {
        .formLoginContainer {
           height: 90vh;
        }
      }
      
    `;
      document.head.appendChild(style);
    },
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
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.minLength &&
        errors.push("Debe contener al menos 3 carácteres");
      !this.$v.name.required && errors.push("El nombre es requerido");
      return errors;
    },
    passwdErrors() {
      const errors = [];
      if (!this.$v.passwd.$dirty) return errors;
      !this.$v.passwd.minLength &&
        errors.push("Debe contener al menos 6 carácteres");
      !this.$v.passwd.required && errors.push("La contraseña es requerida");
      return errors;
    },
    passwdConfirmErrors() {
      const errors = [];
      if (!this.$v.passwdConfirm.$dirty) return errors;
      !this.$v.passwdConfirm.sameAs &&
        errors.push("Las contraseñas no coinciden");
      !this.$v.passwdConfirm.required &&
        errors.push("La confirmación de contraseña es requerida");
      return errors;
    },
  },

  validations: {
    email: { required, email },
    name: { required, minLength: minLength(3) },
    passwd: { required, minLength: minLength(6) },
    passwdConfirm: { required, sameAs: sameAs("passwd") },
  },
};
</script>
