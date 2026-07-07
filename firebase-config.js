const firebaseConfig = {
  apiKey: "AIzaSyAdLIflAGWVMVV9ilKS8PePp-A12gSPzJA",
  authDomain: "heetherapy.firebaseapp.com",
  databaseURL: "https://heetherapy-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "heetherapy",
  storageBucket: "heetherapy.firebasestorage.app",
  messagingSenderId: "425707085929",
  appId: "1:425707085929:web:939ded5dc4d3f7a73ec2f8",
  measurementId: "G-TS7HT29NWF"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();
window.db = db;
window.firebaseReady = true;