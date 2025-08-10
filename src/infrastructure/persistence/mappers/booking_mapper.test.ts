import { Booking } from '../../../domain/entities/booking';
import { Property } from '../../../domain/entities/property';
import { User } from '../../../domain/entities/user';
import { DateRange } from '../../../domain/value_objects/date_range';
import { BookingEntity } from '../entities/booking_entity';
import { PropertyEntity } from '../entities/property_entity';
import { UserEntity } from '../entities/user_entity';
import { BookingMapper } from './booking_mapper';
import { PropertyMapper } from './property_mapper';
import { UserMapper } from './user_mapper';

jest.mock('./property_mapper');
jest.mock('./user_mapper');

class MockProperty extends Property {
  isAvailable = jest.fn().mockReturnValue(true);
}

class MockUser extends User {}
class MockBooking extends Booking {}
class MockDateRange extends DateRange {}

describe('BookingMapper', () => {
  let mockUserDomain: User;
  let mockPropertyDomain: Property;
  let mockBookingDomain: Booking;

  let mockUserEntity: UserEntity;
  let mockPropertyEntity: PropertyEntity;
  let mockBookingEntity: BookingEntity;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUserDomain = new MockUser('user-123', 'John Doe');
    mockPropertyDomain = new MockProperty(
      'prop-456',
      'Casa de Praia',
      'Casa com vista para o mar',
      10,
      500
    );
    mockBookingDomain = new MockBooking(
      'booking-789',
      mockPropertyDomain,
      mockUserDomain,
      new MockDateRange(new Date('2025-10-20'), new Date('2025-10-25')),
      4
    );
    mockBookingDomain['totalPrice'] = 2500;
    mockBookingDomain['status'] = 'CONFIRMED';

    mockUserEntity = { id: 'user-123' } as UserEntity;
    mockPropertyEntity = { id: 'prop-456' } as PropertyEntity;
    mockBookingEntity = new BookingEntity();
    mockBookingEntity.id = 'booking-789';
    mockBookingEntity.property = mockPropertyEntity;
    mockBookingEntity.guest = mockUserEntity;
    mockBookingEntity.startDate = new Date('2025-10-20');
    mockBookingEntity.endDate = new Date('2025-10-25');
    mockBookingEntity.guestCount = 4;
    mockBookingEntity.totalPrice = 2500;
    mockBookingEntity.status = 'CONFIRMED';

    (UserMapper.toDomain as jest.Mock).mockReturnValue(mockUserDomain);
    (PropertyMapper.toDomain as jest.Mock).mockReturnValue(mockPropertyDomain);
    (UserMapper.toPersistence as jest.Mock).mockReturnValue(mockUserEntity);
    (PropertyMapper.toPersistence as jest.Mock).mockReturnValue(
      mockPropertyEntity
    );
  });

  it('deve converter BookingEntity em Booking corretamente', () => {
    const result = BookingMapper.toDomain(mockBookingEntity);

    expect(result).toBeInstanceOf(Booking);
    expect(result.getId()).toBe('booking-789');
    expect(mockPropertyDomain.isAvailable).toHaveBeenCalled();
  });

  it('deve lançar erro de validação ao faltar campos obrigatórios no BookingEntity', () => {
    const incompleteBookingEntity = new BookingEntity();
    incompleteBookingEntity.id = 'booking-789';
    incompleteBookingEntity.property = mockPropertyEntity;
    incompleteBookingEntity.guest = mockUserEntity;

    expect(() => BookingMapper.toDomain(incompleteBookingEntity)).toThrow(
      'A data de início e término não podem ser iguais.'
    );
  });

  it('deve converter Booking para BookingEntity corretamente', () => {
    const result = BookingMapper.toPersistence(mockBookingDomain);

    expect(result).toBeInstanceOf(BookingEntity);
    expect(result.id).toBe('booking-789');
  });
});
