import {
  database,
  auth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
} from "../firebase";
import moment from "moment";

class Auth {
  createUser(credentials) {
    return auth
      .createUserWithEmailAndPassword(credentials.email, credentials.passwd)
      .then((res) => {
        console.log(res);
        auth.currentUser.updateProfile({
          displayName: credentials.name,
          photoURL:
            "https://raw.githubusercontent.com/vonKaster/CRUDFirebase/204e35cdc01abf6dd34869facb8badcde772b7a7/src/assets/user.jpg",
        });
        const createdUser = {
          email: res.user.email,
          uid: res.additionalUserInfo.uid,
          photosrc: res.photoURL,
        };
        return createdUser;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  signIn({ provider, credentials }) {
    let authMethod = null;
    if (provider === "email") {
      authMethod = auth.signInWithEmailAndPassword(
        credentials.email,
        credentials.passwd
      );
    } else if (provider === "google") {
      const provider = new GoogleAuthProvider();
      authMethod = auth.signInWithPopup(provider);
    } else if (provider === "facebook") {
      const provider = new FacebookAuthProvider();
      authMethod = auth.signInWithPopup(provider);
    } else if (provider === "github") {
      const provider = new GithubAuthProvider();
      authMethod = auth.signInWithPopup(provider);
    } else {
      console.error("Invalid provider");
      return;
    }

    return authMethod
      .then((res) => {
        const userLoggedIn = {
          email: res.user.email,
          uid: res.user.uid,
          photosrc: res.user.photoURL,
          name: res.user.displayName,
        };
        return userLoggedIn;
      })
      .catch((err) => {
        console.log(err);
        throw err;
      });
  }

  signOut(user) {
    return auth.signOut().then(() => {
      // Actualizar el valor de online del usuario a false en la base de datos
      database.ref(`users/${user.uid}`).update({
        online: false,
        lastSeen: moment().format("MMM Do YY, h:mm a"),
      });
    });
  }

  changeUserName(name, user) {
    if (name.length >= 3 && name.length < 24) {
      auth.currentUser.updateProfile({
        displayName: name,
      });
      database.ref(`users/${user.uid}`).update({
        name: name,
      });
      return true;
    } else {
      return false;
    }
  }

  changePassword(passwd) {
    return auth.currentUser
      .updatePassword(passwd)
      .then(() => {
        return "success";
      })
      .catch(function (error) {
        return error;
      });
  }

  async listUsers(callback) {
    database.ref("users").on("value", (snapshot) => {
      const users = [];
      snapshot.forEach((childSnapshot) => {
        const user = childSnapshot.val();
        users.push(user);
      });
      callback(users);
    });
  }
  
}

export default Auth;
