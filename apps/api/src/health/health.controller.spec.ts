import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from './health.controller';
import { PrismaService } from '../prisma/prisma.service';

describe('HealthController', () => {
  let controller: HealthController;
  const prisma = {
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: PrismaService, useValue: prisma }],
    }).compile();

    controller = module.get(HealthController);
    jest.clearAllMocks();
  });

  it('returns ok when database is reachable', async () => {
    prisma.$queryRaw.mockResolvedValue([{ '?column?': 1 }]);

    await expect(controller.getHealth()).resolves.toEqual({
      status: 'ok',
      db: 'connected',
    });
  });

  it('returns error when database query fails', async () => {
    prisma.$queryRaw.mockRejectedValue(new Error('connection failed'));

    await expect(controller.getHealth()).resolves.toEqual({
      status: 'error',
      db: 'error',
    });
  });
});
