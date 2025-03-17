import { injectable } from 'inversify';
import { AppointmentRepository } from '../../application/interfaces/appointment-repository.interface';
import { Appointment } from '../../domain/entities/appointment';
import mysql from 'mysql2/promise';

@injectable()
export class MySQLAppointmentRepository implements AppointmentRepository {
  private pool: mysql.Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST || 'localhost',
      user: process.env.MYSQL_USER || 'admin',
      password: process.env.MYSQL_PASSWORD || 'Lima$$2024.',
      database: process.env.MYSQL_DATABASE || 'InsuranceDB',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async save(appointment: Appointment): Promise<void> {
    console.log('Guardando en MySQL:', appointment);
    const query = `
      INSERT INTO Appointments (scheduleId, countryISO, insuredId, id, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `;
    try {
      await this.pool.execute(query, [
        appointment.scheduleId,
        appointment.countryISO,
        appointment.insuredId,
        appointment.id,
        appointment.createdAt.toISOString()
      ]);
    } catch (error) {
      console.error('Error al guardar la cita en MySQL:', error);
      throw error;
    }
  }

  async findById(id: string): Promise<Appointment | null> {
    const query = `
      SELECT id, insuredId, scheduleId, countryISO, createdAt 
      FROM Appointments 
      WHERE scheduleId = ?
    `;
    try {
      const [rows] = await this.pool.execute(query, [id]);
      if (Array.isArray(rows) && rows.length > 0) {
        const row = rows[0] as any;
        return new Appointment(
          row.id,
          row.insuredId,
          row.scheduleId,
          row.countryISO,
          new Date(row.createdAt)
        );
      }
      return null;
    } catch (error) {
      console.error('Error al recuperar la cita desde MySQL:', error);
      throw error;
    }
  }
}
