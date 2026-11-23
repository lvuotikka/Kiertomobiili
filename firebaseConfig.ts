import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyCrKPGd7cyvMLA5chen4kFipCWXF_Qrm24',
  authDomain: 'kiertomobiili.firebaseapp.com',
  databaseURL: 'https://kiertomobiili-default-rtdb.firebaseio.com',
  projectId: 'kiertomobiili',
  storageBucket: 'kiertomobiili.firebasestorage.app',
  messagingSenderId: '1056379460588',
  appId: '1:1056379460588:web:12ef3657aa74a28fb8fec9',
};

// Alustetaan Firebase vain kerran
const app = getApps().length > 0
  ? getApp()
  : initializeApp(firebaseConfig);

// Yhdistetään Realtime Databaseen
export const database = getDatabase(app);