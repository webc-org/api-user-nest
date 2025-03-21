import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import mockUser from './mocks/user';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    create: jest
      .fn()
      .mockImplementation((): Promise<User> => Promise.resolve(mockUser)),
    findAll: jest
      .fn()
      .mockImplementation((): Promise<User[]> => Promise.resolve([mockUser])),
    findById: jest.fn().mockImplementation(() => Promise.resolve(mockUser)),
    update: jest
      .fn()
      .mockImplementation((_, dto) => Promise.resolve({ ...mockUser, ...dto })),
    remove: jest.fn().mockImplementation(() => Promise.resolve(undefined)),
  };

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      mockUsersService.create.mockResolvedValue(mockUser);

      const result = await controller.create(mockUser);

      expect(result).toEqual(mockUser);

      expect(service.create).toHaveBeenCalledWith(UserDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll();
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      mockUsersService.findById.mockResolvedValue(mockUser);

      const result = await controller.findOne('some-id');
      expect(result).toEqual(mockUser);
      expect(service.findById).toHaveBeenCalledWith('some-id');
    });
  });

  describe('update', () => {
    const mockUpdateUser: UserDto = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    it('should update a user', async () => {
      mockUsersService.update.mockResolvedValue({
        ...mockUser,
        ...mockUpdateUser,
      });

      const result = await controller.update('some-id', mockUpdateUser);
      expect(result).toEqual({ ...mockUser, ...mockUpdateUser });
      expect(service.update).toHaveBeenCalledWith('some-id', mockUpdateUser);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockUsersService.remove.mockResolvedValue(undefined);

      await controller.remove('some-id');
      expect(service.remove).toHaveBeenCalledWith('some-id');
    });
  });
});
