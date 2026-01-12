import api from '../config/api';

export interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type: 'post_scheduled' | 'reminder' | 'deadline' | 'meeting' | 'other';
  relatedTo?: {
    type: 'blog' | 'film' | 'video' | 'comment';
    id: string;
  };
  location?: string;
  attendees?: string[];
  notificationSent: boolean;
  notifyBefore?: number;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventData {
  title: string;
  description?: string;
  startDate: Date | string;
  endDate: Date | string;
  allDay?: boolean;
  type?: 'post_scheduled' | 'reminder' | 'deadline' | 'meeting' | 'other';
  location?: string;
  attendees?: string[];
  notifyBefore?: number;
  color?: string;
}

export interface EventsResponse {
  success: boolean;
  data: CalendarEvent[];
}

export interface EventResponse {
  success: boolean;
  message: string;
  data: CalendarEvent;
}

export const calendarService = {
  // Get all events
  getEvents: async (filters?: { start?: string; end?: string; type?: string }): Promise<CalendarEvent[]> => {
    const params = new URLSearchParams();
    if (filters?.start) params.append('start', filters.start);
    if (filters?.end) params.append('end', filters.end);
    if (filters?.type) params.append('type', filters.type);

    const response = await api.get<EventsResponse>(`/api/calendar?${params.toString()}`);
    return response.data.data;
  },

  // Get upcoming events
  getUpcomingEvents: async (): Promise<CalendarEvent[]> => {
    const response = await api.get<EventsResponse>('/api/calendar/upcoming');
    return response.data.data;
  },

  // Get single event
  getEvent: async (id: string): Promise<CalendarEvent> => {
    const response = await api.get<EventResponse>(`/api/calendar/${id}`);
    return response.data.data;
  },

  // Create event
  createEvent: async (data: CreateEventData): Promise<CalendarEvent> => {
    const response = await api.post<EventResponse>('/api/calendar', data);
    return response.data.data;
  },

  // Update event
  updateEvent: async (id: string, data: Partial<CreateEventData>): Promise<CalendarEvent> => {
    const response = await api.put<EventResponse>(`/api/calendar/${id}`, data);
    return response.data.data;
  },

  // Delete event
  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/api/calendar/${id}`);
  },
};
