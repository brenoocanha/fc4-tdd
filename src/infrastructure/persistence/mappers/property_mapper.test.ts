import { Property } from '../../../domain/entities/property';
import { PropertyEntity } from '../entities/property_entity';
import { PropertyMapper } from './property_mapper';

describe('PropertyMapper', () => {
  it('deve converter PropertyEntity em Property corretamente', () => {
    const propertyEntity = new PropertyEntity();
    propertyEntity.id = '123-abc';
    propertyEntity.name = 'Casa na Praia';
    propertyEntity.description = 'Casa com vista para o mar';
    propertyEntity.maxGuests = 10;
    propertyEntity.basePricePerNight = 500.5;

    const property = PropertyMapper.toDomain(propertyEntity);

    expect(property).toBeInstanceOf(Property);
    expect(property.getId()).toBe(propertyEntity.id);
    expect(property.getName()).toBe(propertyEntity.name);
    expect(property.getDescription()).toBe(propertyEntity.description);
    expect(property.getMaxGuests()).toBe(propertyEntity.maxGuests);
    expect(property.getBasePricePerNight()).toBe(
      propertyEntity.basePricePerNight
    );
  });

  it('deve lançar erro de validação ao faltar campos obrigatórios no PropertyEntity', () => {
    const invalidEntity = new PropertyEntity();
    invalidEntity.id = '123';

    expect(() => PropertyMapper.toDomain(invalidEntity)).toThrow(
      'O nome é obrigatório'
    );
  });

  it('deve converter Property para PropertyEntity corretamente', () => {
    const property = new Property(
      '123-abc',
      'Casa na Praia',
      'Casa com vista para o mar',
      10,
      500.5
    );

    const propertyEntity = PropertyMapper.toPersistence(property);

    expect(propertyEntity).toBeInstanceOf(PropertyEntity);
    expect(propertyEntity.id).toBe(property.getId());
    expect(propertyEntity.name).toBe(property.getName());
    expect(propertyEntity.description).toBe(property.getDescription());
    expect(propertyEntity.maxGuests).toBe(property.getMaxGuests());
    expect(propertyEntity.basePricePerNight).toBe(
      property.getBasePricePerNight()
    );
  });
});
