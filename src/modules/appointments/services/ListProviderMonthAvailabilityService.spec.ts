import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailability from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailability: ListProviderMonthAvailability;
let fakeAppointmentsRepository: FakeAppointmentsRepository;

describe('ListProviderMonthAvailability', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderMonthAvailability = new ListProviderMonthAvailability(
      fakeAppointmentsRepository,
    );
  });

  it('should be able to list the provider month availability', async () => {
    const bookingHours = Array.from({ length: 10 }, (_, index) => index + 8);

    bookingHours.map(async bookingHour => {
      await fakeAppointmentsRepository.create({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2100, 4, 20, bookingHour, 0, 0),
      });
    });

    const availability = await listProviderMonthAvailability.execute({
      provider_id: 'provider',
      year: 2100,
      month: 5,
    });

    expect(availability).toEqual(
      expect.arrayContaining([
        { day: 19, available: true },
        { day: 20, available: false },
        { day: 21, available: true },
        { day: 22, available: true },
      ]),
    );
  });
});
