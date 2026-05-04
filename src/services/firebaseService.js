import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, query, orderBy, limit } from "firebase/firestore";
import { FIREBASE_CONFIG, IS_FIREBASE_ENABLED } from "./firebase";

// Inicializar solo si hay configuración
const app = IS_FIREBASE_ENABLED ? initializeApp(FIREBASE_CONFIG) : null;
export const db = app ? getFirestore(app) : null;

// ─── Funciones de Sincronización ──────────────────────────────────────────

// 1. Guardar pedido en la nube
export const saveOrderCloud = async (order) => {
  if (!db) return;
  try {
    await addDoc(collection(db, "orders"), {
      ...order,
      serverTimestamp: new Date()
    });
  } catch (e) { console.error("Error al subir pedido:", e); }
};

// 2. Escuchar pedidos en tiempo real
export const listenOrders = (callback) => {
  if (!db) return () => {};
  const q = query(collection(db, "orders"), orderBy("timestamp", "desc"), limit(50));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(orders);
  });
};

// 3. Actualizar estado de pedido
export const updateOrderStatusCloud = async (id, status) => {
  if (!db) return;
  try {
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status });
  } catch (e) { console.error("Error al actualizar pedido:", e); }
};

// 4. Sincronizar Configuración (Ubicación, etc)
export const syncConfig = (callback) => {
  if (!db) return () => {};
  return onSnapshot(doc(db, "config", "main"), (doc) => {
    if (doc.exists()) callback(doc.data());
  });
};
