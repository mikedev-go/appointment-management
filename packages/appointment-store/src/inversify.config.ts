import 'reflect-metadata';
import { Container } from 'inversify';
import TYPES from './types';
import { AppointmentRepository } from './application/interfaces/appointment-repository.interface';
import { AppointmentNotifier } from './application/interfaces/appointment-notifier.interface';
import { MySQLAppointmentRepository } from './infrastructure/persistence/mysql-appointment-repository';
import { EventBridgeNotifier } from './infrastructure/messaging/event-notifier';
import { CreateAppointment } from './application/use-cases/create-appointment';

const container = new Container();
container.bind<AppointmentRepository>(TYPES.AppointmentRepository).to(MySQLAppointmentRepository);
container.bind<AppointmentNotifier>(TYPES.AppointmentNotifier).to(EventBridgeNotifier);
container.bind<CreateAppointment>(CreateAppointment).toSelf();

export default container;
