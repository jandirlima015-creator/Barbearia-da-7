import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { BarberService, Barber } from '../types';
import { format, addMinutes, setHours, setMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../hooks/useAuth';
import { bookingService } from '../services/bookingService';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Clock, User as UserIcon, Scissors } from 'lucide-react';

interface BookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  service: BarberService | null;
  barbers: Barber[];
}

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
];

export function BookingDialog({ isOpen, onClose, service, barbers }: BookingDialogProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState<string>('');
  const [barberId, setBarberId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!service) return null;

  const handleNext = () => setStep(s => s + 1);
  const handleBack = () => setStep(s => s - 1);

  const confirmBooking = async () => {
    if (!user || !date || !time || !barberId || !service) return;

    setIsSubmitting(true);
    try {
      const [hours, minutes] = time.split(':').map(Number);
      const start = setMinutes(setHours(date, hours), minutes);
      const end = addMinutes(start, service.duration);

      await bookingService.createAppointment({
        customerId: user.uid,
        barberId,
        serviceId: service.id,
        startTime: start.toISOString(),
        endTime: end.toISOString(),
        status: 'pending',
        totalPrice: service.price,
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setStep(1);
        setSuccess(false);
        setTime('');
        setBarberId('');
      }, 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-ink border-zinc-800 text-white max-w-md">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center mb-6">
                <Check className="text-gold w-10 h-10" />
              </div>
              <h2 className="text-2xl font-display mb-2">Agendamento Confirmado!</h2>
              <p className="text-zinc-500">Enviamos os detalhes para o seu e-mail.</p>
            </motion.div>
          ) : (
            <div className="py-4">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display text-gold">Agendar {service.name}</DialogTitle>
                <DialogDescription className="text-zinc-500">
                  Passo {step} de 3 - {step === 1 ? 'Selecione o Profissional' : step === 2 ? 'Escolha o Horário' : 'Confirme os Detalhes'}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-8">
                {step === 1 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                  >
                    <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">Escolha seu Barbeiro</label>
                    <div className="grid grid-cols-1 gap-3">
                      {barbers.map(b => (
                        <button
                          key={b.id}
                          onClick={() => setBarberId(b.id)}
                          className={`flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                            barberId === b.id 
                            ? 'bg-gold/10 border-gold border-2' 
                            : 'bg-zinc-900 border-zinc-800 hover:border-zinc-600'
                          }`}
                        >
                          <img src={b.photoUrl || 'https://via.placeholder.com/40'} alt={b.name} className="w-12 h-12 rounded-full object-cover" />
                          <div>
                            <p className="font-medium">{b.name}</p>
                            <p className="text-xs text-zinc-500">{b.specialties?.join(', ')}</p>
                          </div>
                          {barberId === b.id && <Check className="ml-auto text-gold w-5 h-5" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="bg-zinc-900 p-2 rounded-2xl border border-zinc-800 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border-none"
                        locale={ptBR}
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <label className="text-xs uppercase tracking-widest font-bold text-zinc-500">Horários Disponíveis</label>
                      <div className="grid grid-cols-3 gap-2">
                        {TIME_SLOTS.map(t => (
                          <Button
                            key={t}
                            variant={time === t ? 'default' : 'outline'}
                            onClick={() => setTime(t)}
                            className={`h-12 rounded-lg ${
                              time === t 
                                ? 'bg-gold text-ink hover:bg-gold/90' 
                                : 'border-zinc-800 text-zinc-400 hover:border-zinc-600'
                            }`}
                          >
                            {t}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-6"
                  >
                    <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800 divide-y divide-zinc-800">
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Scissors className="text-gold w-5 h-5" />
                          <span className="text-zinc-400">Serviço</span>
                        </div>
                        <span className="font-medium">{service.name}</span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <UserIcon className="text-gold w-5 h-5" />
                          <span className="text-zinc-400">Barbeiro</span>
                        </div>
                        <span className="font-medium">{barbers.find(b => b.id === barberId)?.name}</span>
                      </div>
                      <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="text-gold w-5 h-5" />
                          <span className="text-zinc-400">Data & Hora</span>
                        </div>
                        <span className="font-medium">
                          {date && format(date, "dd 'de' MMMM", { locale: ptBR })} às {time}
                        </span>
                      </div>
                      <div className="p-6 bg-gold/5 flex items-center justify-between">
                        <span className="text-lg font-display">Total</span>
                        <span className="text-2xl text-gold font-bold">R$ {service.price}</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <DialogFooter className="mt-8 gap-2">
                {step > 1 && (
                  <Button variant="outline" onClick={handleBack} disabled={isSubmitting} className="border-zinc-800 flex-1 h-12 rounded-full">
                    Voltar
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button 
                    onClick={handleNext} 
                    disabled={(step === 1 && !barberId) || (step === 2 && !time)}
                    className="gold-button flex-[2] h-12"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button 
                    onClick={confirmBooking} 
                    disabled={isSubmitting}
                    className="gold-button flex-[2] h-12"
                  >
                    {isSubmitting ? 'Processando...' : 'Confirmar Reserva'}
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
