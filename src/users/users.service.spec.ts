import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UserDto } from './dto/user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let model: Model<UserDocument>;

  const mockUser = {
    _id: 'some-id',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedpassword',
    firstName: 'Test',
    lastName: 'User',
    address: '123 Test St',
    phone: '123-456-7890',
    createdAt: new Date(),
  };

  const mockUserModel = {
    new: jest.fn().mockResolvedValue(mockUser),
    constructor: jest.fn().mockResolvedValue(mockUser),
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    save: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have a valid model', () => {
    expect(model).toBeDefined();
  });

  describe('create', () => {
    const userDto: UserDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
      firstName: 'Test',
      lastName: 'User',
      address: '123 Test St',
      phone: '123-456-7890',
    };

    it('should create a new user', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });
      mockUserModel.new.mockImplementation(() => ({
        ...mockUser,
        save: () => Promise.resolve(mockUser),
      }));

      const result = await service.create(userDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if email exists', async () => {
      mockUserModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(service.create(mockUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockUserModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockUser]),
      });

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findById', () => {
    it('should return a user', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      const result = await service.findById('some-id');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findById('some-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const mockUpdateUser: UserDto = {
      firstName: 'Updated',
      lastName: 'Name',
    };

    it('should update and return a user', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue({ ...mockUser, ...mockUpdateUser }),
      });

      const result = await service.update('some-id', mockUpdateUser);
      expect(result).toEqual({ ...mockUser, ...mockUpdateUser });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update('some-id', mockUpdateUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      });

      await expect(service.remove('some-id')).resolves.not.toThrow();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUserModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.remove('some-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
