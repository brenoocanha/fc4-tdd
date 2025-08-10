import { Property } from '../../domain/entities/property';
import { PropertyRepository } from '../../domain/repositories/property_repository';
import { PropertyMapper } from '../../infrastructure/persistence/mappers/property_mapper';
import { v4 as uuidv4 } from 'uuid';

export class PropertyService {
  constructor(private readonly propertyRepository: PropertyRepository) {}

  async findPropertyById(id: string): Promise<Property | null> {
    return this.propertyRepository.findById(id);
  }

  async createProperty(data: {
    name: string;
    description: string;
    maxGuests: number;
    basePricePerNight: number;
  }): Promise<Property> {
    const propertyDomain = new Property(
      uuidv4(),
      data.name,
      data.description,
      data.maxGuests,
      data.basePricePerNight
    );

    await this.propertyRepository.save(propertyDomain);

    return propertyDomain;
  }
}
