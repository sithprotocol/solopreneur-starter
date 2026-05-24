import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersController', () => {
  let controller: UsersController;
  const prisma = {
    user: { findMany: jest.fn() },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    controller = module.get(UsersController);
    jest.clearAllMocks();
  });

  it('returns users from prisma', async () => {
    const users = [
      { id: '1', email: 'a@b.com', name: 'A', createdAt: new Date() },
    ];
    prisma.user.findMany.mockResolvedValue(users);

    await expect(controller.findAll()).resolves.toEqual(users);
    expect(prisma.user.findMany).toHaveBeenCalled();
  });
});
