import { injectable, inject } from 'inversify';
import { Appointment } from '../../domain/entities/appointment';
import { AppointmentRepository } from '../interfaces/appointment-repository.interface';
import { AppointmentNotifier } from '../interfaces/appointment-notifier.interface';
import TYPES from '../../types';

@injectable()
export class CreateAppointment {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private readonly appointmentRepository: AppointmentRepository,
    @inject(TYPES.AppointmentNotifier)
    private readonly appointmentNotifier: AppointmentNotifier
  ) {}

  async execute(
    insuredId: string,
    scheduleId: number,
    countryISO: string
  ): Promise<Appointment> {
    if (!/^\d{5}$/.test(insuredId)) {
      throw new Error('insuredId debe ser un código de 5 dígitos.');
    }
    if (scheduleId <= 0) {
      throw new Error('scheduleId debe ser un número positivo.');
    }
    if (!['PE', 'CL'].includes(countryISO)) {
      throw new Error('countryISO debe ser "PE" o "CL".');
    }

    const id = Date.now().toString();
    const appointment = new Appointment(id, insuredId, scheduleId, countryISO);
    
    await this.appointmentRepository.save(appointment);
    await this.appointmentNotifier.notify(appointment);
    
    return appointment;
  }
}
