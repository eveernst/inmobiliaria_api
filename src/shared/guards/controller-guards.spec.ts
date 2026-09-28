import { RequestMethod } from '@nestjs/common';
import { GUARDS_METADATA, METHOD_METADATA } from '@nestjs/common/constants';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { ClassificationController } from 'src/modules/classification/classification.controller';
import { InstallationController } from 'src/modules/installation/installation.controller';
import { InsuranceController } from 'src/modules/insurance-record/insurance.controller';
import { NotificationController } from 'src/modules/notification/notification.controller';
import { PlanController } from 'src/modules/plan-record/plan.controller';
import { PropertyController } from 'src/modules/property/property.controller';
import { RentedController } from 'src/modules/rented-record/rented.controller';
import { WritingController } from 'src/modules/writing-record/writing.controller';

const WRITE_METHODS = [
  RequestMethod.POST,
  RequestMethod.PUT,
  RequestMethod.PATCH,
  RequestMethod.DELETE,
];

function routeHandlers(controller: any) {
  const proto = controller.prototype;
  return Object.getOwnPropertyNames(proto)
    .filter((name) => name !== 'constructor')
    .map((name) => ({ name, handler: proto[name] }))
    .filter(
      ({ handler }) =>
        Reflect.getMetadata(METHOD_METADATA, handler) !== undefined,
    )
    .map(({ name, handler }) => ({
      name,
      method: Reflect.getMetadata(METHOD_METADATA, handler) as RequestMethod,
      roles: Reflect.getMetadata(ROLES_KEY, handler) as UserRole[] | undefined,
    }));
}

describe('Domain controller guards', () => {
  const adminWriteControllers = [
    ClassificationController,
    InstallationController,
    InsuranceController,
    PlanController,
    PropertyController,
    RentedController,
    WritingController,
  ];

  describe.each(adminWriteControllers.map((c) => [c.name, c]))(
    '%s',
    (_name, controller) => {
      it('requires a JWT and role check at class level', () => {
        expect(Reflect.getMetadata(GUARDS_METADATA, controller)).toEqual([
          JwtAuthGuard,
          RolesGuard,
        ]);
      });

      it('restricts every write handler to ADMIN only', () => {
        const writes = routeHandlers(controller).filter((h) =>
          WRITE_METHODS.includes(h.method),
        );
        expect(writes.length).toBeGreaterThan(0);
        for (const handler of writes) {
          expect({ handler: handler.name, roles: handler.roles }).toEqual({
            handler: handler.name,
            roles: [UserRole.ADMIN],
          });
        }
      });

      it('leaves read handlers open to any authenticated user', () => {
        const reads = routeHandlers(controller).filter(
          (h) => h.method === RequestMethod.GET,
        );
        for (const handler of reads) {
          expect(handler.roles).toBeUndefined();
        }
      });
    },
  );

  describe('NotificationController', () => {
    it('requires a JWT', () => {
      expect(
        Reflect.getMetadata(GUARDS_METADATA, NotificationController),
      ).toEqual([JwtAuthGuard]);
    });

    it('exposes no write endpoints', () => {
      const writes = routeHandlers(NotificationController).filter((h) =>
        WRITE_METHODS.includes(h.method),
      );
      expect(writes).toEqual([]);
    });
  });
});
