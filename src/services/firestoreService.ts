import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Transaction, BudgetConfig } from '../types';

/**
 * Subscribe to the real-time transactions collection for an authenticated user.
 */
export function subscribeToTransactions(
  userId: string,
  onUpdate: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void
) {
  const txCollectionRef = collection(db, 'users', userId, 'transactions');
  
  return onSnapshot(
    txCollectionRef,
    (snapshot) => {
      const items: Transaction[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Transaction;
        items.push({
          ...data,
          id: docSnap.id
        });
      });
      // Sort in descending order by date
      items.sort((a, b) => (b.date > a.date ? 1 : b.date < a.date ? -1 : 0));
      onUpdate(items);
    },
    (err) => {
      console.error('Firestore transactions subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a single transaction in Firestore
 */
export async function saveTransactionToFirestore(userId: string, transaction: Transaction): Promise<void> {
  const txDocRef = doc(db, 'users', userId, 'transactions', transaction.id);
  await setDoc(txDocRef, {
    ...transaction,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Delete a transaction from Firestore
 */
export async function deleteTransactionFromFirestore(userId: string, transactionId: string): Promise<void> {
  const txDocRef = doc(db, 'users', userId, 'transactions', transactionId);
  await deleteDoc(txDocRef);
}

/**
 * Subscribe to the user's budget configuration
 */
export function subscribeToBudgetConfig(
  userId: string,
  onUpdate: (config: BudgetConfig | null) => void,
  onError?: (error: Error) => void
) {
  const budgetDocRef = doc(db, 'users', userId, 'budget', 'current');
  
  return onSnapshot(
    budgetDocRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as BudgetConfig;
        onUpdate(data);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.error('Firestore budget subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save the user's budget configuration
 */
export async function saveBudgetConfigToFirestore(userId: string, config: BudgetConfig): Promise<void> {
  const budgetDocRef = doc(db, 'users', userId, 'budget', 'current');
  await setDoc(budgetDocRef, {
    ...config,
    updatedAt: new Date().toISOString()
  });
}

/**
 * Seed initial sample/demo transactions and budget into Firestore if user's account is empty
 */
export async function seedInitialFirestoreData(
  userId: string, 
  initialTransactions: Transaction[],
  initialBudget: BudgetConfig
): Promise<void> {
  const txCollectionRef = collection(db, 'users', userId, 'transactions');
  const existingDocs = await getDocs(txCollectionRef);
  
  if (existingDocs.empty) {
    const batch = writeBatch(db);
    for (const tx of initialTransactions) {
      const docRef = doc(db, 'users', userId, 'transactions', tx.id);
      batch.set(docRef, {
        ...tx,
        updatedAt: new Date().toISOString()
      });
    }
    const budgetDocRef = doc(db, 'users', userId, 'budget', 'current');
    batch.set(budgetDocRef, {
      ...initialBudget,
      updatedAt: new Date().toISOString()
    });
    await batch.commit();
  }
}

/**
 * Reset all user transactions and budget in Firestore back to the initial dataset
 */
export async function resetFirestoreData(
  userId: string,
  initialTransactions: Transaction[],
  initialBudget: BudgetConfig
): Promise<void> {
  const txCollectionRef = collection(db, 'users', userId, 'transactions');
  const existingDocs = await getDocs(txCollectionRef);
  
  const batch = writeBatch(db);
  existingDocs.forEach((docSnap) => {
    batch.delete(docSnap.ref);
  });

  for (const tx of initialTransactions) {
    const docRef = doc(db, 'users', userId, 'transactions', tx.id);
    batch.set(docRef, {
      ...tx,
      updatedAt: new Date().toISOString()
    });
  }

  const budgetDocRef = doc(db, 'users', userId, 'budget', 'current');
  batch.set(budgetDocRef, {
    ...initialBudget,
    updatedAt: new Date().toISOString()
  });

  await batch.commit();
}
