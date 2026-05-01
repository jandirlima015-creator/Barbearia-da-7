import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { signInWithGoogle, logout } from '../lib/firebase';
import { 
  Scissors, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  LogOut, 
  Menu,
  ChevronRight,
  Star,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { bookingService } from '../services/bookingService';
import { BarberService, Barber, Appointment } from '../types';
import { BookingDialog } from '../components/BookingDialog';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function Home() {
  const { user, profile, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState<BarberService[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedService, setSelectedService] = useState<BarberService | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (user) {
      loadAppointments();
    }
  }, [user]);

  const loadData = async () => {
    const [s, b] = await Promise.all([
      bookingService.getServices(),
      bookingService.getBarbers()
    ]);
    setServices(s);
    setBarbers(b);
  };

  const loadAppointments = async () => {
    if (!user) return;
    const a = await bookingService.getMyAppointments(user.uid);
    setAppointments(a);
  };

  const handleCancel = async (id: string) => {
    if (confirm('Tem certeza que deseja cancelar este agendamento?')) {
      await bookingService.cancelAppointment(id);
      loadAppointments();
    }
  };

  const handleBooking = (service: BarberService) => {
    if (!user) {
      signInWithGoogle();
      return;
    }
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-ink">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Scissors className="text-gold w-12 h-12" />
        </motion.div>
        <p className="text-gold mt-4 font-display tracking-widest">BARBERHOUSE</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-20">
      <BookingDialog 
        isOpen={isBookingOpen} 
        onClose={() => {
          setIsBookingOpen(false);
          loadAppointments();
        }} 
        service={selectedService} 
        barbers={barbers} 
      />

      {/* Header */}
      <header className="px-6 py-6 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-ink/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <Scissors className="text-gold w-6 h-6" />
          <h2 className="text-xl tracking-tight">BARBER<span className="text-gold">HOUSE</span></h2>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <Avatar className="w-9 h-9 border border-zinc-700">
              <AvatarImage src={user.photoURL || ''} />
              <AvatarFallback>{user.displayName?.[0]}</AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="icon" onClick={logout} className="text-zinc-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        ) : (
          <Button onClick={signInWithGoogle} className="gold-button h-10 px-6">Entrar</Button>
        )}
      </header>

      <main className="max-w-6xl mx-auto w-full px-6 mt-8">
        <section className="mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-zinc-500 uppercase tracking-widest text-xs font-bold mb-2">Bem-vindo</p>
            <h1 className="text-4xl md:text-5xl mb-4">
              {user ? `Olá, ${user.displayName?.split(' ')[0]}!` : 'Evolua seu Estilo.'}
            </h1>
          </motion.div>
        </section>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <TabsList className="bg-zinc-900 border border-zinc-800 p-1 rounded-full h-12">
              <TabsTrigger value="services" className="px-6 rounded-full data-[state=active]:bg-gold data-[state=active]:text-ink">Serviços</TabsTrigger>
              <TabsTrigger value="barbers" className="px-6 rounded-full data-[state=active]:bg-gold data-[state=active]:text-ink">Barbeiros</TabsTrigger>
              <TabsTrigger value="my-bookings" className="px-6 rounded-full data-[state=active]:bg-gold data-[state=active]:text-ink">Meus Agendamentos</TabsTrigger>
            </TabsList>
            
            {isAdmin && (
              <Button variant="outline" className="border-gold/30 text-gold h-12 rounded-full px-6 hover:bg-gold/10">
                <Plus className="mr-2 w-4 h-4" /> Admin Panel
              </Button>
            )}
          </div>

          <TabsContent value="services" className="mt-0">
            {services.length === 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-64 bg-zinc-900/50 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="premium-card h-full flex flex-col group overflow-hidden">
                      {service.imageUrl && (
                        <div className="h-40 -mx-6 -mt-6 mb-6 overflow-hidden">
                          <img src={service.imageUrl} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                        </div>
                      )}
                      <CardContent className="p-0">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-xl font-display">{service.name}</h3>
                          <Badge variant="outline" className="text-gold border-gold/20">{service.duration} min</Badge>
                        </div>
                        <p className="text-zinc-500 text-sm mb-6 flex-grow">{service.description}</p>
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-2xl text-white font-semibold">R$ {service.price}</span>
                          <Button 
                            variant="ghost" 
                            onClick={() => handleBooking(service)}
                            className="text-gold hover:text-white p-0 group-hover:translate-x-1 transition-transform"
                          >
                            Agendar <ChevronRight className="ml-1 w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="barbers" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {barbers.map((barber, index) => (
                <motion.div
                  key={barber.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="premium-card flex flex-col md:flex-row gap-6 items-center">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gold/20">
                        <img src={barber.photoUrl} alt={barber.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                      
                    <div className="flex-grow text-center md:text-left">
                      <h3 className="text-xl mb-1">{barber.name}</h3>
                      <p className="text-gold text-xs uppercase tracking-wider mb-4">{barber.specialties?.join(' • ')}</p>
                      <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{barber.bio}</p>
                      <Button variant="outline" className="border-zinc-800 text-white rounded-full hover:bg-gold hover:text-ink transition-colors">
                        Ver Portfólio
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-bookings">
            <div className="flex flex-col gap-4">
              {appointments.length > 0 ? (
                appointments.map((apt) => {
                  const service = services.find(s => s.id === apt.serviceId);
                  const barber = barbers.find(b => b.id === apt.barberId);
                  return (
                    <Card key={apt.id} className="premium-card !p-4 flex items-center justify-between group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="text-gold w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{service?.name || 'Serviço'}</p>
                          <p className="text-xs text-zinc-500">
                            {format(new Date(apt.startTime), "dd MMM, HH:mm", { locale: ptBR })} • {barber?.name || 'Barbeiro'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={
                          apt.status === 'confirmed' ? 'bg-green-500/20 text-green-500 border-none' :
                          apt.status === 'pending' ? 'bg-gold/20 text-gold border-none' :
                          'bg-zinc-800 text-zinc-500 border-none'
                        }>
                          {apt.status === 'pending' ? 'Pendente' : 
                           apt.status === 'confirmed' ? 'Confirmado' : 
                           apt.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
                        </Badge>
                        
                        {apt.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCancel(apt.id)}
                            className="text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Cancelar
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-12 text-center">
                  <CalendarIcon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                  <h3 className="text-xl mb-2 text-zinc-400">Nenhum agendamento encontrado</h3>
                  <Button 
                    variant="ghost"
                    onClick={() => setActiveTab('services')}
                    className="text-gold"
                  >
                    Fazer meu primeiro agendamento
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Booking Drawer CTA for Mobile */}
      {!user && (
        <div className="fixed bottom-6 left-6 right-6 md:hidden">
          <Button onClick={signInWithGoogle} className="gold-button w-full h-14 shadow-2xl shadow-gold/20 flex items-center justify-between">
            <span>Comece seu Agendamento</span>
            <div className="bg-ink/20 p-2 rounded-full">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </Button>
        </div>
      )}
    </div>
  );
}
