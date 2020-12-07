import { getHours, isBefore, startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  user_id: string;
  date: Date;
}

@injectable()
class CreateAppointmentService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    date,
    provider_id,
    user_id,
  }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    if (user_id === provider_id) {
      throw new AppError('you cannot book an appointment with yourself');
    }
    if (isBefore(appointmentDate, Date.now())) {
      throw new AppError('You cannot book an appointment in the past');
    }
    if (getHours(appointmentDate) < 8 || getHours(appointmentDate) > 17) {
      throw new AppError('You can only book appointments between 8am and 5pm');
    }

    const checkAppointmentSchedule = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );
    if (checkAppointmentSchedule) {
      throw new AppError('This schedule is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      user_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
