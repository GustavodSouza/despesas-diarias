import { boot } from 'quasar/wrappers';
import firebase from 'firebase/compat/app';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAeQbRS2O6udUDeGP4Ghkp701oqz-PbAQI',
  authDomain: 'despesas-diarias-b3fc8.firebaseapp.com',
  projectId: 'despesas-diarias-b3fc8',
  storageBucket: 'despesas-diarias-b3fc8.firebasestorage.app',
  messagingSenderId: '394740863311',
  appId: '1:394740863311:web:6d32902d18740a6252353a',
  measurementId: 'G-LBW8Y3004Q',
};

firebase.initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = firebase.firestore();

export { db, auth };

export default boot();
