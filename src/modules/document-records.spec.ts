import { INestApplication, NotFoundException, Type } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import * as request from 'supertest';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { ReadPropertyInstallationDto } from './property/dtos/read-property-installation.dto';
import { InsuranceController } from './insurance-record/insurance.controller';
import { InsuranceService } from './insurance-record/insurance.service';
import { ReadInsuranceDto } from './insurance-record/dtos/read-insurance.dto';
import { PlanController } from './plan-record/plan.controller';
import { PlanService } from './plan-record/plan.service';
import { ReadPlanDto } from './plan-record/dtos/read-plan.dto';
import { RentedController } from './rented-record/rented.controller';
import { RentedService } from './rented-record/rented.service';
import { ReadRentedDto } from './rented-record/dtos/read-rented.dto';
import { WritingController } from './writing-record/writing.controller';
import { WritingService } from './writing-record/writing.service';
import { ReadWritingDto } from './writing-record/dtos/read-writing.dto';

type DocumentRecord = {
  path: string;
  Controller: Type<unknown>;
  Service: new (...args: any[]) => {
    findOne(id: number): Promise<unknown>;
    remove(id: number): Promise<void>;
  };
  ReadDto: ClassConstructor<object>;
  relation: string;
};

// The four document records (issue #44) share the same shape, so they share
// one spec: the front needs each document's id to show, edit and delete it.
const documentRecords: DocumentRecord[] = [
  {
    path: 'insurance',
    Controller: InsuranceController,
    Service: InsuranceService,
    ReadDto: ReadInsuranceDto,
    relation: 'insurances',
  },
  {
    path: 'plans',
    Controller: PlanController,
    Service: PlanService,
    ReadDto: ReadPlanDto,
    relation: 'plans',
  },
  {
    path: 'rented',
    Controller: RentedController,
    Service: RentedService,
    ReadDto: ReadRentedDto,
    relation: 'renteds',
  },
  {
    path: 'writing',
    Controller: WritingController,
    Service: WritingService,
    ReadDto: ReadWritingDto,
    relation: 'writings',
  },
];

describe.each(documentRecords)(
  '/$path document record',
  ({ path, Controller, Service, ReadDto, relation }) => {
    describe('Read DTO', () => {
      it('exposes the id', () => {
        const dto = plainToInstance(
          ReadDto,
          { id: 5, createdAt: new Date() },
          { excludeExtraneousValues: true },
        );

        expect(dto).toEqual(expect.objectContaining({ id: 5 }));
        expect(dto).not.toHaveProperty('createdAt');
      });

      it('exposes the id when nested inside the property response', () => {
        const dto = plainToInstance(
          ReadPropertyInstallationDto,
          { id: 1, [relation]: [{ id: 5 }] },
          { excludeExtraneousValues: true },
        );

        expect(dto).toHaveProperty(relation);
        expect(dto[relation as keyof ReadPropertyInstallationDto]).toEqual([
          expect.objectContaining({ id: 5 }),
        ]);
      });
    });

    describe('service', () => {
      const repository = { findOne: jest.fn(), delete: jest.fn() };
      const service = new Service(repository as any, {} as any);

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it('findOne returns the record', async () => {
        const record = { id: 5 };
        repository.findOne.mockResolvedValue(record);

        await expect(service.findOne(5)).resolves.toBe(record);
      });

      it('findOne throws 404 for a missing id', async () => {
        repository.findOne.mockResolvedValue(null);

        await expect(service.findOne(99)).rejects.toBeInstanceOf(
          NotFoundException,
        );
      });

      it('remove deletes an existing record', async () => {
        repository.delete.mockResolvedValue({ affected: 1, raw: [] });

        await expect(service.remove(5)).resolves.toBeUndefined();
        expect(repository.delete).toHaveBeenCalledWith(5);
      });

      it('remove throws 404 when nothing was deleted', async () => {
        repository.delete.mockResolvedValue({ affected: 0, raw: [] });

        await expect(service.remove(99)).rejects.toBeInstanceOf(
          NotFoundException,
        );
      });
    });

    describe('controller :id param', () => {
      const service = {
        findOne: jest.fn(),
        update: jest.fn(),
        remove: jest.fn(),
      };
      let app: INestApplication;

      beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
          controllers: [Controller],
          providers: [{ provide: Service, useValue: service }],
        })
          .overrideGuard(JwtAuthGuard)
          .useValue({ canActivate: () => true })
          .overrideGuard(RolesGuard)
          .useValue({ canActivate: () => true })
          .compile();

        app = moduleRef.createNestApplication();
        await app.init();
      });

      afterAll(async () => {
        await app.close();
      });

      beforeEach(() => {
        jest.clearAllMocks();
      });

      it.each(['get', 'put', 'delete'] as const)(
        '%s with a non-numeric id returns 400',
        async (method) => {
          await request(app.getHttpServer())
            [method](`/${path}/abc`)
            .expect(400);

          expect(service.findOne).not.toHaveBeenCalled();
          expect(service.update).not.toHaveBeenCalled();
          expect(service.remove).not.toHaveBeenCalled();
        },
      );

      it('passes a numeric id to the service', async () => {
        service.remove.mockResolvedValue(undefined);

        await request(app.getHttpServer()).delete(`/${path}/5`).expect(200);

        expect(service.remove).toHaveBeenCalledWith(5);
      });

      it('returns 404 for a missing id', async () => {
        service.findOne.mockRejectedValue(new NotFoundException());

        await request(app.getHttpServer()).get(`/${path}/99`).expect(404);
      });
    });
  },
);
