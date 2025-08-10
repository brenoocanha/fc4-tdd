import { Request, Response } from 'express';
import { PropertyService } from '../../application/services/property_service';

export class PropertyController {
  constructor(private propertyService: PropertyService) {}

  async createProperty(req: Request, res: Response): Promise<void> {
    try {
      const propertyData = req.body;
      const newProperty = await this.propertyService.createProperty(
        propertyData
      );
      res.status(201).json({
        message: 'Propriedade criada com sucesso.',
        property: newProperty,
      });
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }
}
