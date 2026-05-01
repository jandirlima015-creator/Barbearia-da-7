import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  Timestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import { db, auth, handleFirestoreError } from '../lib/firebase';
import { Appointment, OperationType, BarberService, Barber } from '../types';

const APPOINTMENTS_COLLECTION = 'appointments';
const SERVICES_COLLECTION = 'services';
const BARBERS_COLLECTION = 'barbers';

export const bookingService = {
  async getServices(): Promise<BarberService[]> {
    try {
      const q = query(collection(db, SERVICES_COLLECTION), orderBy('price', 'asc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BarberService));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, SERVICES_COLLECTION);
      return [];
    }
  },

  async getBarbers(): Promise<Barber[]> {
    try {
      const q = query(collection(db, BARBERS_COLLECTION));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Barber));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, BARBERS_COLLECTION);
      return [];
    }
  },

  async createAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Promise<string> {
    try {
      const data = {
        ...appointment,
        createdAt: new Date().toISOString(),
      };
      const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), data);
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, APPOINTMENTS_COLLECTION);
      return '';
    }
  },

  async getMyAppointments(userId: string): Promise<Appointment[]> {
    try {
      const q = query(
        collection(db, APPOINTMENTS_COLLECTION), 
        where('customerId', '==', userId),
        orderBy('startTime', 'desc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Appointment));
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, APPOINTMENTS_COLLECTION);
      return [];
    }
  },

  async cancelAppointment(appointmentId: string): Promise<void> {
    try {
      const docRef = doc(db, APPOINTMENTS_COLLECTION, appointmentId);
      await updateDoc(docRef, { status: 'cancelled' });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, APPOINTMENTS_COLLECTION);
    }
  }
};
