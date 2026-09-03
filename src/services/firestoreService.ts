import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  getDocs,
  writeBatch,
  getDocFromServer
} from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { Transaction, BudgetConfig } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Test connectivity to Firestore on boot
 */
export async function testFirestoreConnection(userId: string): Promise<void> {
  try {
    await getDocFromServer(doc(db, 'users', userId));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore connectivity check: client is offline or starting up.');
    }
  }
}

/**
 * Subscribe directly to the real-time transactions for an authenticated user.
 */
export function subscribeToTransactions(
  userId: string,
  onUpdate: (transactions: Transaction[]) => void,
  onError?: (error: Error) => void
) {
  const path = `users/${userId}/transactions`;
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
      if (onError) {
        onError(err);
      } else {
        handleFirestoreError(err, OperationType.GET, path);
      }
    }
  );
}

/**
 * Directly save or update a single transaction in Firestore for an authenticated user.
 */
export async function saveTransactionToFirestore(userId: string, transaction: Transaction): Promise<void> {
  const path = `users/${userId}/transactions/${transaction.id}`;
  try {
    const txDocRef = doc(db, 'users', userId, 'transactions', transaction.id);
    await setDoc(txDocRef, {
      ...transaction,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Directly delete a transaction from Firestore for an authenticated user.
 */
export async function deleteTransactionFromFirestore(userId: string, transactionId: string): Promise<void> {
  const path = `users/${userId}/transactions/${transactionId}`;
  try {
    const txDocRef = doc(db, 'users', userId, 'transactions', transactionId);
    await deleteDoc(txDocRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

/**
 * Subscribe directly to the user's budget configuration from Firestore.
 */
export function subscribeToBudgetConfig(
  userId: string,
  onUpdate: (config: BudgetConfig | null) => void,
  onError?: (error: Error) => void
) {
  const path = `users/${userId}/budget/current`;
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
      if (onError) {
        onError(err);
      } else {
        handleFirestoreError(err, OperationType.GET, path);
      }
    }
  );
}

/**
 * Directly save the user's budget configuration to Firestore.
 */
export async function saveBudgetConfigToFirestore(userId: string, config: BudgetConfig): Promise<void> {
  const path = `users/${userId}/budget/current`;
  try {
    const budgetDocRef = doc(db, 'users', userId, 'budget', 'current');
    await setDoc(budgetDocRef, {
      ...config,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Clear all user transactions and reset budget in Firestore for an authenticated user.
 */
export async function clearAllUserDataInFirestore(
  userId: string,
  emptyBudget: BudgetConfig
): Promise<void> {
  const path = `users/${userId}/transactions`;
  try {
    const txCollectionRef = collection(db, 'users', userId, 'transactions');
    const existingDocs = await getDocs(txCollectionRef);
    
    const batch = writeBatch(db);
    existingDocs.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });

    const budgetDocRef = doc(db, 'users', userId, 'budget', 'current');
    batch.set(budgetDocRef, {
      ...emptyBudget,
      updatedAt: new Date().toISOString()
    });

    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}
