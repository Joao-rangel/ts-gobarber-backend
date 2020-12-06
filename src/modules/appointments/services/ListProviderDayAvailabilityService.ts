import { getHours, isAfter } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import IAppointmentsRepository from '../repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  day: number;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  hour: number;
  available: boolean;
}>;

@injectable()
class ListProviderDayAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute(data: IRequest): Promise<IResponse> {
    const { provider_id, day, month, year } = data;

    const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
      { provider_id, day, month, year },
    );

    const bookingDayHours = Array.from({ length: 10 }, (_, index) => index + 8);

    const availability = bookingDayHours.map(hour => {
      const isBooked = appointments.find(
        appointment => getHours(appointment.date) === hour,
      );

      const currentDate = new Date(Date.now());

      const compareDate = new Date(year, month - 1, day, hour);

      const available = !isBooked && isAfter(compareDate, currentDate);

      return { day, hour, available };
    });

    return availability;
  }
}

export default ListProviderDayAvailabilityService;
