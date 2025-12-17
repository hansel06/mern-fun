import type { User } from './user.types';

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  location: string;
  capacity: number;
  imageUrl: string;
  createdBy: User | string; // Can be populated or just ID
  attendees: (User | string)[]; // Can be populated or just IDs
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  capacity: number;
  image: File;
}

export interface UpdateEventData {
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  capacity?: number;
  image?: File;
}

export interface EventsResponse {
  success: boolean;
  count: number;
  events: Event[];
}

export interface EventResponse {
  success: boolean;
  event: Event;
  message?: string;
}

