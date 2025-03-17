import { injectable } from 'inversify';
import { AppointmentNotifier } from '../../application/interfaces/appointment-notifier.interface';
import { Appointment } from '../../domain/entities/appointment';
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';

@injectable()
export class SnsNotifier implements AppointmentNotifier {
  private snsClient: SNSClient;
  private topicArn: string;

  constructor() {
    this.snsClient = new SNSClient({});
    this.topicArn = process.env.APPOINTMENTS_SNS_TOPIC || '';
    if (!this.topicArn) {
      throw new Error('La variable de entorno APPOINTMENTS_SNS_TOPIC no está definida.');
    }
  }

  async notify(appointment: Appointment): Promise<void> {
    console.log('Notificando vía SNS:', appointment);
    const message = JSON.stringify(appointment);
    const params = {
      TopicArn: this.topicArn,
      Message: message,
    };

    try {
      const result = await this.snsClient.send(new PublishCommand(params));
      console.log('Mensaje publicado en SNS:', result);
    } catch (error) {
      console.error('Error al publicar en SNS:', error);
      throw error;
    }
  }
}
