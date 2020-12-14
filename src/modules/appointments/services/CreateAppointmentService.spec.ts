import AppError from '@shared/errors/AppError';
import FakeNotificationRepository from '@modules/notifications/infra/typeorm/repositories/fakes/FakeNotificationsRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationRepository,
      fakeCacheProvider,
    );

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2020, 4, 20, 10, 30, 0).getTime();
    });
  });

  it('should be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 20, 14, 0, 0),
      provider_id: '01234',
      user_id: '007',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('01234');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 20, 14, 0, 0);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '01234',
      user_id: '007',
    });

    const appointment = await createAppointment.execute({
      date: appointmentDate,
      provider_id: 'outro-provider',
      user_id: '007',
    });

    expect(appointment.provider_id).toBe('outro-provider');
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        provider_id: '01234',
        user_id: '007',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 10, 0, 0),
        provider_id: '01234',
        user_id: '007',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with yourself', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 16, 0, 0),
        provider_id: 'myself',
        user_id: 'myself',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment outside opening hours', async () => {
    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 6, 0, 0),
        provider_id: '01234',
        user_id: '007',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 20, 22, 0, 0),
        provider_id: '01234',
        user_id: '007',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
