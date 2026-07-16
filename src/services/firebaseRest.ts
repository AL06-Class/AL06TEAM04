type FirestoreFieldValue =
  | { stringValue: string }
  | { integerValue: string }
  | { doubleValue: number }
  | { booleanValue: boolean }
  | { timestampValue: string }
  | { nullValue: null }
  | { arrayValue: { values?: FirestoreFieldValue[] } }
  | { mapValue: { fields?: Record<string, FirestoreFieldValue> } };

type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreFieldValue>;
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
};

export function isFirebaseRestConfigured() {
  return Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);
}

function getBaseUrl() {
  if (!isFirebaseRestConfigured()) return null;
  return `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents`;
}

function decodeFirestoreValue(value: FirestoreFieldValue): unknown {
  if ("stringValue" in value) return value.stringValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("nullValue" in value) return null;
  if ("arrayValue" in value) return (value.arrayValue.values ?? []).map(decodeFirestoreValue);
  if ("mapValue" in value) return decodeFirestoreFields(value.mapValue.fields ?? {});
  return undefined;
}

function decodeFirestoreFields(fields: Record<string, FirestoreFieldValue>) {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeFirestoreValue(value)]));
}

function encodeFirestoreValue(value: unknown): FirestoreFieldValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return /^\d{4}-\d{2}-\d{2}T/.test(value) ? { timestampValue: value } : { stringValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeFirestoreValue) } };
  if (typeof value === "object") {
    return {
      mapValue: {
        fields: Object.fromEntries(
          Object.entries(value as Record<string, unknown>)
            .filter(([, itemValue]) => itemValue !== undefined)
            .map(([key, itemValue]) => [key, encodeFirestoreValue(itemValue)])
        )
      }
    };
  }
  return { stringValue: String(value) };
}

function encodeFirestoreFields(data: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(data)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, encodeFirestoreValue(value)])
  );
}

export async function getFirestoreCollection<T>(
  collectionName: string,
  mapDocument: (data: Record<string, unknown>, id: string) => T
) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return [];

  const response = await fetch(`${baseUrl}/${collectionName}?key=${firebaseConfig.apiKey}`);
  if (!response.ok) {
    throw new Error(`Firestore collection read failed: ${response.status}`);
  }

  const payload = (await response.json()) as { documents?: FirestoreDocument[] };
  return (payload.documents ?? []).map((document) => {
    const id = document.name.split("/").pop() ?? "";
    return mapDocument(decodeFirestoreFields(document.fields ?? {}), id);
  });
}

export async function saveFirestoreDocument(collectionName: string, documentId: string, data: Record<string, unknown>) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error("Firebase REST config is missing");
  }

  const response = await fetch(`${baseUrl}/${collectionName}/${documentId}?key=${firebaseConfig.apiKey}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fields: encodeFirestoreFields(data)
    })
  });

  if (!response.ok) {
    throw new Error(`Firestore document save failed: ${response.status}`);
  }
}
