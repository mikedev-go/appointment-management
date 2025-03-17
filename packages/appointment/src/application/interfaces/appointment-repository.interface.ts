import { Appointment } from '../../domain/entities/appointment';

export interface AppointmentRepository {
  update(appointmentId: string, status: number): unknown;
  save(appointment: Appointment): Promise<void>;
  findById(id: string): Promise<Appointment | null>;

}
