import { injectable, inject } from 'inversify';
import { AppointmentRepository } from '../interfaces/appointment-repository.interface';
import TYPES from '../../types';

@injectable()
export class UpdateAppointment {
  constructor(
    @inject(TYPES.AppointmentRepository)
    private readonly appointmentRepository: AppointmentRepository
  ) {}

  async execute(
    appointmentId: string,
    status: number
  ) {
 
    await this.appointmentRepository.update(appointmentId, status);
    
  }
}
