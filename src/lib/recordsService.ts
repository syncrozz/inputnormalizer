import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import { NormalizationMode, SavedRecord } from '../types';

/**
 * Save a newly formatted record to the user's private workspace
 * /users/{userId}/records/{recordId}
 */
export async function saveUserRecord(
  userId: string,
  data: {
    rawInput: string;
    formattedOutput: string;
    mode: NormalizationMode;
    title?: string;
    isSaved?: boolean;
  }
): Promise<string> {
  const recordsCol = collection(db, 'users', userId, 'records');
  const docRef = await addDoc(recordsCol, {
    userId,
    title: data.title || (data.formattedOutput.slice(0, 40) + (data.formattedOutput.length > 40 ? '...' : '')),
    rawInput: data.rawInput,
    formattedOutput: data.formattedOutput,
    mode: data.mode,
    isSaved: data.isSaved ?? false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

/**
 * Subscribe to user's private records with real-time updates
 */
export function subscribeUserRecords(
  userId: string,
  onUpdate: (records: SavedRecord[]) => void,
  onError?: (err: Error) => void
) {
  const recordsCol = collection(db, 'users', userId, 'records');
  const q = query(recordsCol, orderBy('createdAt', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const records: SavedRecord[] = snapshot.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          userId: d.userId,
          title: d.title || 'Untitled Snippet',
          rawInput: d.rawInput || '',
          formattedOutput: d.formattedOutput || '',
          mode: d.mode as NormalizationMode,
          isSaved: Boolean(d.isSaved),
          createdAt: d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : new Date().toISOString(),
          updatedAt: d.updatedAt?.toDate ? d.updatedAt.toDate().toISOString() : undefined,
        };
      });
      onUpdate(records);
    },
    (err) => {
      console.error('Error fetching user records:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Delete a specific record from user's private records
 */
export async function deleteUserRecord(userId: string, recordId: string): Promise<void> {
  const recordDoc = doc(db, 'users', userId, 'records', recordId);
  await deleteDoc(recordDoc);
}

/**
 * Toggle favorite/saved status for a snippet
 */
export async function toggleSaveUserRecord(userId: string, recordId: string, currentStatus: boolean): Promise<void> {
  const recordDoc = doc(db, 'users', userId, 'records', recordId);
  await updateDoc(recordDoc, {
    isSaved: !currentStatus,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Clear all records for a user
 */
export async function clearAllUserRecords(userId: string): Promise<void> {
  const recordsCol = collection(db, 'users', userId, 'records');
  const snap = await getDocs(recordsCol);
  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    batch.delete(d.ref);
  });
  await batch.commit();
}
