import { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Clock, User, Mail, MessageSquare, CheckCircle, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, addDays, isWeekend } from 'date-fns';
import { toast } from 'sonner';
import { contactService } from '@/services/contactService';
import api from '@/config/api';

const allTimeSlots = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
];

const MeetingScheduler = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState<'date' | 'time' | 'details' | 'confirmed'>('date');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const sectionRef = useRef<HTMLElement>(null);

  // Fetch available time slots when a date is selected
  const { data: availabilityData, isLoading: isLoadingAvailability } = useQuery({
    queryKey: ['available-slots', selectedDate],
    queryFn: async () => {
      if (!selectedDate) return null;
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const response = await api.get(`/api/calendar/available-slots?date=${dateString}`);
      return response.data.data;
    },
    enabled: !!selectedDate && step === 'time',
  });

  const availableSlots = availabilityData?.availableSlots || allTimeSlots;
  const busySlots = availabilityData?.busySlots || [];

  const submitMutation = useMutation({
    mutationFn: contactService.submitContactForm,
    onSuccess: () => {
      setStep('confirmed');
      toast.success('Meeting scheduled successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to schedule meeting. Please try again.');
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setStep('time');
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep('details');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !selectedDate || !selectedTime) {
      toast.error('Please fill in all required fields');
      return;
    }

    submitMutation.mutate({
      name: formData.name,
      email: formData.email,
      date: format(selectedDate, 'yyyy-MM-dd'),
      time: selectedTime,
      message: formData.message || 'Meeting request',
    });
  };

  const handleReset = () => {
    setStep('date');
    setSelectedDate(undefined);
    setSelectedTime(null);
    setFormData({ name: '', email: '', message: '' });
  };

  // Disable weekends and past dates
  const disabledDays = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today || isWeekend(date);
  };

  return (
    <section
      id="schedule"
      ref={sectionRef}
      className="relative py-32 bg-background overflow-hidden"
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section header */}
        <div className={`text-center mb-16 ${isVisible ? 'animate-fade-up' : 'opacity-0'}`}>
          <p className="font-body text-sm tracking-[0.2em] uppercase text-primary mb-4">
            Book a Meeting
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Let's <span className="text-gradient">Connect</span>
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Schedule a call to discuss your project, explore collaboration opportunities,
            or just chat about the future of AI filmmaking.
          </p>
        </div>

        {/* Scheduler Card */}
        <div className={`max-w-4xl mx-auto ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}>
          <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-3xl overflow-hidden">
            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 p-6 border-b border-border bg-card/30">
              {['date', 'time', 'details', 'confirmed'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex items-center justify-center font-body text-sm font-medium transition-all duration-300',
                      step === s || ['date', 'time', 'details', 'confirmed'].indexOf(step) > i
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {i + 1}
                  </div>
                  {i < 3 && (
                    <div
                      className={cn(
                        'w-12 h-0.5 mx-2 transition-all duration-300',
                        ['date', 'time', 'details', 'confirmed'].indexOf(step) > i
                          ? 'bg-primary'
                          : 'bg-muted'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="p-6 md:p-10">
              {/* Step 1: Select Date */}
              {step === 'date' && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-8">
                    <CalendarDays className="w-6 h-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Select a Date</h3>
                  </div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    disabled={disabledDays}
                    className="rounded-xl border border-border bg-card p-4 pointer-events-auto"
                    classNames={{
                      day_selected: 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
                      day_today: 'bg-accent text-accent-foreground',
                    }}
                  />
                  <p className="mt-6 font-body text-sm text-muted-foreground">
                    Available Monday - Friday
                  </p>
                </div>
              )}

              {/* Step 2: Select Time */}
              {step === 'time' && selectedDate && (
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Select a Time</h3>
                  </div>
                  <p className="font-body text-muted-foreground mb-8">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </p>
                  {isLoadingAvailability ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-sm text-muted-foreground">Checking availability...</span>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full max-w-lg">
                        {allTimeSlots.map((time) => {
                          const isBusy = busySlots.includes(time);
                          const isAvailable = availableSlots.includes(time);

                          return (
                            <button
                              key={time}
                              onClick={() => !isBusy && handleTimeSelect(time)}
                              disabled={isBusy}
                              className={cn(
                                'px-4 py-3 rounded-xl font-body text-sm font-medium border transition-all duration-300',
                                isBusy && 'opacity-50 cursor-not-allowed bg-muted border-muted line-through',
                                !isBusy && selectedTime === time && 'bg-primary text-primary-foreground border-primary',
                                !isBusy && selectedTime !== time && 'bg-card border-border hover:border-primary hover:bg-primary/10'
                              )}
                              title={isBusy ? 'This time slot is not available' : 'Select this time slot'}
                            >
                              {time}
                            </button>
                          );
                        })}
                      </div>
                      {busySlots.length > 0 && (
                        <p className="mt-4 text-xs text-muted-foreground">
                          {busySlots.length} time slot{busySlots.length > 1 ? 's' : ''} unavailable due to existing commitments
                        </p>
                      )}
                    </>
                  )}
                  <button
                    onClick={() => setStep('date')}
                    className="mt-8 font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    ← Change date
                  </button>
                </div>
              )}

              {/* Step 3: Enter Details */}
              {step === 'details' && selectedDate && selectedTime && (
                <div className="max-w-md mx-auto">
                  <div className="flex items-center gap-3 mb-8 justify-center">
                    <User className="w-6 h-6 text-primary" />
                    <h3 className="font-display text-2xl font-bold">Your Details</h3>
                  </div>

                  {/* Selected slot summary */}
                  <div className="mb-8 p-4 bg-primary/10 rounded-xl border border-primary/20 text-center">
                    <p className="font-body text-sm text-primary font-medium">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')} at {selectedTime}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label className="font-body text-sm text-foreground flex items-center gap-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="bg-card border-border focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-body text-sm text-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="bg-card border-border focus:border-primary"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="font-body text-sm text-foreground flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        What would you like to discuss?
                      </label>
                      <Textarea
                        placeholder="Tell me about your project or questions..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="bg-card border-border focus:border-primary min-h-[100px]"
                      />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep('time')}
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button type="submit" className="flex-1 gap-2" disabled={submitMutation.isPending}>
                        {submitMutation.isPending ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Scheduling...
                          </>
                        ) : (
                          <>
                            Schedule Meeting
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              )}

              {/* Step 4: Confirmed */}
              {step === 'confirmed' && selectedDate && selectedTime && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-display text-3xl font-bold mb-4">You're All Set!</h3>
                  <p className="font-body text-muted-foreground mb-6 max-w-sm mx-auto">
                    I'll send you a calendar invite and meeting link to <span className="text-primary">{formData.email}</span>
                  </p>
                  <div className="inline-block p-4 bg-card rounded-xl border border-border mb-8">
                    <p className="font-display text-lg font-bold text-foreground">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <p className="font-body text-primary font-medium">{selectedTime}</p>
                  </div>
                  <div>
                    <Button onClick={handleReset} variant="outline" className="gap-2">
                      <CalendarDays className="w-4 h-4" />
                      Schedule Another Meeting
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetingScheduler;
