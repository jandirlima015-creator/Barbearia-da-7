import { motion } from 'motion/react';
import { Scissors, Calendar, MapPin, Clock, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Landing({ onExplore }: { onExplore: () => void }) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80")',
          filter: 'brightness(0.3)'
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <div className="flex items-center justify-center gap-2 mb-6">
            <Scissors className="text-gold w-8 h-8" />
            <span className="text-gold tracking-[0.3em] font-medium text-sm">SINCE 2024</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl mb-8 leading-none">
            BARBER<span className="text-gold">HOUSE</span>
          </h1>
          
          <p className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Onde a tradição encontra o estilo contemporâneo. 
            Uma experiência de barbearia exclusiva para o homem moderno.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={onExplore}
              className="gold-button w-full sm:w-auto h-14"
            >
              Agendar Agora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <Button 
              variant="outline" 
              className="border-zinc-700 text-white h-14 px-8 rounded-full hover:bg-white hover:text-ink transition-colors"
            >
              Nossos Serviços
            </Button>
          </div>
        </motion.div>
        
        {/* Features Floating */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-12 text-left"
        >
          <div className="flex items-start gap-4">
            <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
              <Clock className="text-gold w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Horário Flexível</h3>
              <p className="text-zinc-500 text-sm">Aberto até às 21h nos fins de semana.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
              <MapPin className="text-gold w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Localização Central</h3>
              <p className="text-zinc-500 text-sm">Fácil acesso e estacionamento gratuito.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="bg-zinc-900/80 p-3 rounded-lg border border-zinc-800">
              <Calendar className="text-gold w-6 h-6" />
            </div>
            <div>
              <h3 className="text-white font-medium mb-1">Reserva Online</h3>
              <p className="text-zinc-500 text-sm">Agende em segundos pelo nosso app.</p>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative lines */}
      <div className="absolute top-10 left-10 w-px h-24 bg-gold/30 hidden lg:block" />
      <div className="absolute top-10 right-10 w-px h-24 bg-gold/30 hidden lg:block" />
      <div className="absolute bottom-10 left-10 w-px h-24 bg-gold/30 hidden lg:block" />
      <div className="absolute bottom-10 right-10 w-px h-24 bg-gold/30 hidden lg:block" />
    </div>
  );
}
