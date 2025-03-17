import { injectable } from 'inversify';
import { AppointmentRepository } from '../../application/interfaces/appointment-repository.interface';
import { Appointment } from '../../domain/entities/appointment';
import { DynamoDBClient, UpdateItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

@injectable()
export class DynamoAppointmentRepository implements AppointmentRepository {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    const ddbClient = new DynamoDBClient({});
    this.client = DynamoDBDocumentClient.from(ddbClient); 
    this.tableName = process.env.APPOINTMENTS_TABLE || 'Appointments';
  }
 async update(appointmentId: string, status: number): Promise<any> {
  const updateExpression = 'SET #status = :status';

  const ExpressionAttributeNames = {
    '#status': 'status'
  };
  const ExpressionAttributeValues = {
    ':status': { N: status.toString() }
  };

  const command = new UpdateItemCommand({
    TableName: this.tableName,
    Key: marshall({ appointmentId }),
    UpdateExpression: updateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    ReturnValues: 'ALL_NEW'
  });

  const response = await this.client.send(command);
  if (response.Attributes) {
    return unmarshall(response.Attributes);
  }
  return null;
}
  async save(appointment: Appointment): Promise<void> {
    console.log('Guardando en DynamoDB:', appointment);
    const params = {
      TableName: this.tableName,
      Item: {
        scheduleId: appointment.scheduleId,
        countryISO: appointment.countryISO,
        insuredId: appointment.insuredId,
        id: appointment.id,
        status: 'pending',
        createdAt: appointment.createdAt.toISOString()
      },
    };

    try {
      await this.client.send(new PutCommand(params));
    } catch (error) {
      console.error('Error al guardar la cita en DynamoDB:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    const params = {
      TableName: this.tableName,
      Key: {
        scheduleId: id, 
      },
    };

    try {
      const result = await this.client.send(new GetCommand(params));
      if (result.Item) {
        return new Appointment(
          result.Item.id,
          result.Item.insuredId,
          result.Item.scheduleId,
          result.Item.countryISO,
          new Date(result.Item.createdAt)
        );
      }
      return null;
    } catch (error) {
      console.error('Error al recuperar la cita desde DynamoDB:', error);
      throw error;
    }
  }
}
