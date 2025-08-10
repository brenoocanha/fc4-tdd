import { Request, Response } from 'express';
import { UserService } from '../../application/services/user_service';

export class UserController {
  constructor(private userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.body;
      const user = await this.userService.createUser({ name });

      res.status(201).json({
        message: 'Usuário criado com sucesso.',
        user: {
          id: user.getId(),
          name: user.getName(),
        },
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
