import { SQSEvent, SQSHandler } from 'aws-lambda';
import container from '../../inversify.config';
import { CreateAppointment } from '../../application/use-cases/create-appointment';

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    try {
      const { insuredId, scheduleId, countryISO } = JSON.parse(record.body);

      const createAppointment = container.get<CreateAppointment>(CreateAppointment);
      await createAppointment.execute(insuredId, scheduleId, countryISO);

      console.log(`Mensaje procesado correctamente: ${record.messageId}`);
    } catch (error: any) {
      console.error(`Error procesando el mensaje ${record.messageId}:`, error);
      throw error;
    }
  }
};
