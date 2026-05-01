import { db } from './firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const SERVICES = [
  { 
    name: 'Corte Social', 
    price: 50, 
    duration: 40, 
    description: 'Corte tradicional com tesoura e máquina. Inclui lavagem.',
    imageUrl: 'https://images.unsplash.com/photo-1621605815841-2c70742bcb2a?w=400&h=400&fit=crop'
  },
  { 
    name: 'Barba Completa', 
    price: 35, 
    duration: 30, 
    description: 'Design de barba com toalha quente e finalização com óleo e balm.',
    imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop'
  },
  { 
    name: 'Combo Premium', 
    price: 75, 
    duration: 70, 
    description: 'Corte + Barba + Lavagem especial e relaxamento.',
    imageUrl: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&h=400&fit=crop'
  },
];

const BARBERS = [
  { 
    name: 'Ricardo Santos', 
    bio: 'Especialista em cortes clássicos e fades. 10 anos de experiência.', 
    photoUrl: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=400&h=400&fit=crop',
    specialties: ['Fade', 'Clássico', 'Tesoura']
  },
  { 
    name: 'Marcos Oliveira', 
    bio: 'Mestre em design de barbas e visagismo masculino.', 
    photoUrl: 'https://images.unsplash.com/photo-1621605815841-2c70742bcb2a?w=400&h=400&fit=crop',
    specialties: ['Barboterapia', 'Visagismo', 'Estilo']
  },
];

export async function seedDatabase() {
  const servicesSnap = await getDocs(collection(db, 'services'));
  if (servicesSnap.empty) {
    console.log('Seeding services...');
    for (const service of SERVICES) {
      await addDoc(collection(db, 'services'), service);
    }
  }

  const barbersSnap = await getDocs(collection(db, 'barbers'));
  if (barbersSnap.empty) {
    console.log('Seeding barbers...');
    for (const barber of BARBERS) {
      await addDoc(collection(db, 'barbers'), barber);
    }
  }
}
