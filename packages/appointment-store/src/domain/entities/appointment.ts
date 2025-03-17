export class Appointment {
    constructor(
      public readonly id: string,
      public readonly insuredId: string,
      public readonly scheduleId: number,
      public readonly countryISO: string,
      public readonly createdAt: Date = new Date()
    ) {}
  }
  