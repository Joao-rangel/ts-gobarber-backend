import ICreateAppointmenDTO from '../dtos/ICreateAppointmentDTO';
import Appointment from '../infra/typeorm/entities/Appointment';

export default interface IAppointmentsRepository {
  create(data: ICreateAppointmenDTO): Promise<Appointment>;
  findByDate(date: Date): Promise<Appointment | undefined>;
}
