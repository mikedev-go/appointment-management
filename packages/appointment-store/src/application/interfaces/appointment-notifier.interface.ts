import { Appointment } from '../../domain/entities/appointment';

export interface AppointmentNotifier {
  notify(appointment: Appointment): Promise<void>;
}
