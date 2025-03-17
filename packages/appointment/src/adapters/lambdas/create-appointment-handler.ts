import { APIGatewayProxyHandler } from 'aws-lambda';
import middy from '@middy/core';
import container from '../../inversify.config';
import { CreateAppointment } from '../../application/use-cases/create-appointment';

const baseHandler: APIGatewayProxyHandler = async (event) => {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { insuredId, scheduleId, countryISO } = body;

    // Resolver la instancia del caso de uso usando Inversify
    const createAppointment = container.get<CreateAppointment>(CreateAppointment);
    const appointment = await createAppointment.execute(insuredId, scheduleId, countryISO);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Cita creada exitosamente',
        appointment,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export const app = middy(baseHandler);
