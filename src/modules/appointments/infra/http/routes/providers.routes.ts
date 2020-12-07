import { Router } from 'express';

import ensureAuthentication from '@modules/users/infra/http/middlewares/ensureAuthentication';
import ProvidersController from '../controllers/ProvidersController';
import ProviderMonthAvailabilityController from '../controllers/ProviderMonthAvailabilityController';
import ProviderDayAvailabilityController from '../controllers/ProviderDayAvailabilityController';

const providersRouter = Router();
const providersController = new ProvidersController();
const listProviderMonthAvailabilityService = new ProviderMonthAvailabilityController();
const listProviderDayAvailabilityService = new ProviderDayAvailabilityController();

providersRouter.use(ensureAuthentication);
providersRouter.get('/', providersController.index);
providersRouter.get(
  '/:provider_id/month-availability',
  listProviderMonthAvailabilityService.index,
);
providersRouter.get(
  '/:provider_id/day-availability',
  listProviderDayAvailabilityService.index,
);

export default providersRouter;
