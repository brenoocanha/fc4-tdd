import { PropertyMapper } from './property_mapper';

class MockPropertyEntity {
  id!: string;
  name!: string;
  description!: string;
  maxGuests!: number;
  basePricePerNight!: number;
}

class MockProperty {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public maxGuests: number,
    public basePricePerNight: number
  ) {}

  getId = () => this.id;
  getName = () => this.name;
  getDescription = () => this.description;
  getMaxGuests = () => this.maxGuests;
  getBasePricePerNight = () => this.basePricePerNight;
}

describe('PropertyMapper', () => {
  const mockEntity = new MockPropertyEntity();
  mockEntity.id = '1';
  mockEntity.name = 'Test Property';
  mockEntity.description = 'A test property description';
  mockEntity.maxGuests = 4;
  mockEntity.basePricePerNight = 100;

  const mockDomain = new MockProperty(
    '1',
    'Test Property',
    'A test property description',
    4,
    100
  );

  describe('toDomain', () => {
    it('should map PropertyEntity to Property domain object', () => {
      const result = PropertyMapper.toDomain(mockEntity as any);

      expect(result).toBeInstanceOf(Object);
      expect(result.getId()).toBe(mockEntity.id);
      expect(result.getName()).toBe(mockEntity.name);
      expect(result.getDescription()).toBe(mockEntity.description);
      expect(result.getMaxGuests()).toBe(mockEntity.maxGuests);
      expect(result.getBasePricePerNight()).toBe(mockEntity.basePricePerNight);
      expect(typeof result.getBasePricePerNight()).toBe('number');
    });
  });

  describe('toPersistence', () => {
    it('should map Property domain object to PropertyEntity', () => {
      const result = PropertyMapper.toPersistence(mockDomain as any);

      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe(mockDomain.getId());
      expect(result.name).toBe(mockDomain.getName());
      expect(result.description).toBe(mockDomain.getDescription());
      expect(result.maxGuests).toBe(mockDomain.getMaxGuests());
      expect(result.basePricePerNight).toBe(mockDomain.getBasePricePerNight());
    });
  });
});
