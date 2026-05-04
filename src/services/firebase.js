// ─── Configuración de Firebase para Sazón Llanero ─────────────────────────────
// Para que esto funcione, debes instalar firebase: npm install firebase

// IMPORTANTE: Sustituye estos valores con los de tu consola de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.appspot.com",
  messagingSenderId: "TU_ID",
  appId: "TU_APP_ID"
};

// Por ahora, exportamos un objeto vacío o simulado si no hay configuración
// para que la app no se rompa antes de que pegues tus llaves reales.
export const FIREBASE_CONFIG = firebaseConfig;
export const IS_FIREBASE_ENABLED = firebaseConfig.apiKey !== "TU_API_KEY";
