import { initializeApp, applicationDefault, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function initFirebaseAdmin() {
  if (getApps().length) return;

  // Prefer a JSON string env (easy for deploy), fall back to GOOGLE_APPLICATION_CREDENTIALS.
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (serviceAccountJson) {
    const serviceAccount = JSON.parse(serviceAccountJson);
    initializeApp({ credential: cert(serviceAccount) });
    return;
  }

  initializeApp({ credential: applicationDefault() });
}

export function getFirebaseAuth() {
  initFirebaseAdmin();
  return getAuth();
}

