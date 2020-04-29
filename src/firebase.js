import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import 'firebase/database';

//   // Your web app's Firebase configuration
//   var firebaseConfig = {
//     apiKey: "AIzaSyC2T-rpNz3MpGUi40Ady06Kp5iCNkZcSKI",
//     authDomain: "chat-4dd4f.firebaseapp.com",
//     databaseURL: "https://chat-4dd4f.firebaseio.com",
//     projectId: "chat-4dd4f",
//     storageBucket: "chat-4dd4f.appspot.com",
//     messagingSenderId: "310467800267",
//     appId: "1:310467800267:web:2beb0d9a3ce3617007ff4e",
//     measurementId: "G-6REQ41Q9R3"
//   };
//   // Initialize Firebase
//   firebase.initializeApp(firebaseConfig);
//   firebase.firestore().settings({timestampsInSnapshots: true})
//   firebase.analytics();

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCwJqUuRlJ6MH5KQurMd09k44udf8y_BJ8",
    authDomain: "chat-5546e.firebaseapp.com",
    databaseURL: "https://chat-5546e.firebaseio.com",
    projectId: "chat-5546e",
    storageBucket: "chat-5546e.appspot.com",
    messagingSenderId: "771445877239",
    appId: "1:771445877239:web:c01dbc7f4bf465dbfb26f2",
    measurementId: "G-DR259RRSNR"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const db = firebase.database();