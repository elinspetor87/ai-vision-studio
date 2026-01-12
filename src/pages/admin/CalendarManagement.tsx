import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import { Loader2, Plus, Edit, Trash2, Calendar, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const EVENT_TYPES = [
  { value: 'post_scheduled', label: '📝 Post Agendado', color: 'bg-blue-500' },
  { value: 'reminder', label: '⏰ Lembrete', color: 'bg-yellow-500' },
  { value: 'deadline', label: '⚠️ Prazo', color: 'bg-red-500' },
  { value: 'meeting', label: '👥 Reunião', color: 'bg-purple-500' },
  { value: 'other', label: '📅 Outro', color: 'bg-gray-500' },
];

const CalendarManagement = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewFilter, setViewFilter] = useState<'all' | 'upcoming'>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    allDay: false,
    type: 'other' as const,
    location: '',
    attendees: '',
    notifyBefore: 60,
  });

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['calendar-events', viewFilter],
    queryFn: () => viewFilter === 'upcoming'
      ? calendarService.getUpcomingEvents()
      : calendarService.getEvents(),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) => {
      const eventData = {
        ...data,
        attendees: data.attendees ? data.attendees.split(',').map(e => e.trim()) : [],
      };
      return calendarService.createEvent(eventData);
    },
    onSuccess: () => {
      toast.success('Evento criado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      handleCancel();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Falha ao criar evento');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const eventData = {
        ...data,
        attendees: data.attendees ? data.attendees.split(',').map(e => e.trim()) : [],
      };
      return calendarService.updateEvent(id, eventData);
    },
    onSuccess: () => {
      toast.success('Evento atualizado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
      handleCancel();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Falha ao atualizar evento');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => calendarService.deleteEvent(id),
    onSuccess: () => {
      toast.success('Evento deletado com sucesso');
      queryClient.invalidateQueries({ queryKey: ['calendar-events'] });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Falha ao deletar evento');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingId(event._id);
    setFormData({
      title: event.title,
      description: event.description || '',
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: new Date(event.endDate).toISOString().slice(0, 16),
      allDay: event.allDay,
      type: event.type,
      location: event.location || '',
      attendees: event.attendees?.join(', ') || '',
      notifyBefore: event.notifyBefore || 60,
    });
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      allDay: false,
      type: 'other',
      location: '',
      attendees: '',
      notifyBefore: 60,
    });
  };

  const getEventTypeInfo = (type: string) => {
    return EVENT_TYPES.find(t => t.value === type) || EVENT_TYPES[EVENT_TYPES.length - 1];
  };

  const sortedEvents = [...events].sort((a, b) =>
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold mb-2">Calendário</h1>
          <p className="font-body text-muted-foreground">
            Gerencie seus eventos e lembretes
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex gap-1 bg-secondary rounded-lg p-1">
            <button
              onClick={() => setViewFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewFilter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setViewFilter('upcoming')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewFilter === 'upcoming'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Próximos 7 dias
            </button>
          </div>

          {!isAdding && (
            <Button className="gap-2" onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4" />
              Novo Evento
            </Button>
          )}
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-semibold mb-4">
            {editingId ? 'Editar' : 'Adicionar'} Evento
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label>Título *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Título do evento"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Descrição</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição do evento"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Data/Hora Início *</Label>
                <Input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Data/Hora Fim *</Label>
                <Input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label>Notificar antes (minutos)</Label>
                <Input
                  type="number"
                  value={formData.notifyBefore}
                  onChange={(e) => setFormData({ ...formData, notifyBefore: parseInt(e.target.value) })}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label>Local</Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Local do evento"
                />
              </div>

              <div className="space-y-2">
                <Label>Participantes (emails separados por vírgula)</Label>
                <Input
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="allDay"
                checked={formData.allDay}
                onChange={(e) => setFormData({ ...formData, allDay: e.target.checked })}
                className="w-4 h-4"
              />
              <Label htmlFor="allDay" className="cursor-pointer">
                Dia inteiro
              </Label>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? 'Atualizar' : 'Criar'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Events List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : sortedEvents.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="font-body text-muted-foreground mb-4">
            {viewFilter === 'upcoming' ? 'Nenhum evento nos próximos 7 dias' : 'Nenhum evento ainda'}
          </p>
          <Button className="gap-2" onClick={() => setIsAdding(true)}>
            <Plus className="w-4 h-4" />
            Criar primeiro evento
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedEvents.map((event) => {
            const typeInfo = getEventTypeInfo(event.type);
            const isPast = new Date(event.endDate) < new Date();

            return (
              <div
                key={event._id}
                className={`bg-card border border-border rounded-xl p-6 hover:bg-secondary/50 transition-colors ${
                  isPast ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${typeInfo.color} rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0`}>
                    {format(new Date(event.startDate), 'dd', { locale: ptBR })}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h3 className="font-body font-semibold text-lg text-foreground mb-1">
                          {event.title}
                        </h3>
                        {event.description && (
                          <p className="font-body text-sm text-muted-foreground mb-2">
                            {event.description}
                          </p>
                        )}
                      </div>

                      <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${typeInfo.color} text-white`}>
                        {typeInfo.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(event.startDate), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </div>

                      {!event.allDay && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(event.startDate), 'HH:mm')} - {format(new Date(event.endDate), 'HH:mm')}
                        </div>
                      )}

                      {event.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(event)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja deletar este evento?')) {
                          deleteMutation.mutate(event._id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CalendarManagement;
