import { injectable } from 'inversify';
import { AppointmentNotifier } from '../../application/interfaces/appointment-notifier.interface';
import { Appointment } from '../../domain/entities/appointment';
import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';

@injectable()
export class EventBridgeNotifier implements AppointmentNotifier {
  private eventBridgeClient: EventBridgeClient;
  private eventBusName: string;

  constructor() {
    this.eventBridgeClient = new EventBridgeClient({});
    this.eventBusName = process.env.EVENT_BUS_NAME || 'default';
    if (!this.eventBusName) {
      throw new Error('La variable de entorno EVENT_BUS_NAME no está definida.');
    }
  }

  async notify(appointment: Appointment): Promise<void> {
    console.log('Notificando vía EventBridge:', appointment);

    const event = {
      Entries: [
        {
          EventBusName: this.eventBusName,
          Source: 'appointments.service',
          DetailType: 'AppointmentCreated',
          Detail: JSON.stringify(appointment),
        },
      ],
    };

    try {
      const result = await this.eventBridgeClient.send(new PutEventsCommand(event));
      console.log('Evento publicado en EventBridge:', result);
    } catch (error) {
      console.error('Error al publicar en EventBridge:', error);
      throw error;
    }
  }
}
