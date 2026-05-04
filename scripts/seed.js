
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initialData } from "../src/data/initialData.js";

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-mPqLqWqIqS7S7S7S7S7S7S7S7S7S7S7", // Esto se leerá del archivo real
  authDomain: "sazonllaneroapp.firebaseapp.com",
  projectId: "sazonllaneroapp",
  storageBucket: "sazonllaneroapp.firebasestorage.app",
  messagingSenderId: "10777927082023",
  appId: "1:10777927082023:web:777927082023"
};

// Intentar leer la config real del archivo firebase.js
import fs from 'fs';
const firebaseFile = fs.readFileSync('./src/services/firebase.js', 'utf8');
const apiKeyMatch = firebaseFile.match(/apiKey:\s*"([^"]+)"/);
if (apiKeyMatch) firebaseConfig.apiKey = apiKeyMatch[1];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function seed() {
  console.log("🚀 Iniciando carga de datos en Firebase...");
  
  try {
    await setDoc(doc(db, "config", "inventory"), {
      almuerzoEjecutivo: initialData.almuerzoEjecutivo,
      wokConfig: initialData.wokConfig,
      bebidas: initialData.bebidas
    }, { merge: true });
    
    console.log("✅ ¡Inventario y Bebidas sincronizados con éxito!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al sincronizar:", error);
    process.exit(1);
  }
}

seed();
