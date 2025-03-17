import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';
import { AppointmentRepository } from './application/interfaces/appointment-repository.interface';
import { AppointmentNotifier } from './application/interfaces/appointment-notifier.interface';
import { DynamoAppointmentRepository } from './infrastructure/persistence/dynamo-appointment-repository';
import { SnsNotifier } from './infrastructure/messaging/sns-notifier';
import { CreateAppointment } from './application/use-cases/create-appointment';

const container = new Container();
container.bind<AppointmentRepository>(TYPES.AppointmentRepository).to(DynamoAppointmentRepository);
container.bind<AppointmentNotifier>(TYPES.AppointmentNotifier).to(SnsNotifier);
container.bind<CreateAppointment>(CreateAppointment).toSelf();

export default container;
