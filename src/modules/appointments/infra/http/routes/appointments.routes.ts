import { Router } from 'express';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';
import AppointmentConroller from '../controllers/AppointmentsController';

const appointmentsRouter = Router();
const appointmentConroller = new AppointmentConroller();

appointmentsRouter.use(ensureAuthentication);
appointmentsRouter.post('/', appointmentConroller.create);

export default appointmentsRouter;
