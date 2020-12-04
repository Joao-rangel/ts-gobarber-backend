import { Request, Response } from 'express';
import { container } from 'tsyringe';

import SendRecoveryEmailService from '@modules/users/services/SendRecoveryEmailService';

export default class ForgotPasswordController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendRecoveryEmail = container.resolve(SendRecoveryEmailService);

    await sendRecoveryEmail.execute({ email });

    return response.status(204).json({});
  }
}
