import { Appointment } from '../../domain/entities/appointment';

export interface AppointmentRepository {
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;
}
