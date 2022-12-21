import { Strapi } from '@strapi/strapi';
import { ENCRYPTABLE_FIELD } from './index';
import { Subscriber } from '@strapi/database/lib/lifecycles/subscribers';

export default ({ strapi }: { strapi: Strapi }) => {
  const encryptionService = strapi.plugin(ENCRYPTABLE_FIELD).service('service');

  strapi.db.lifecycles.subscribe((<Subscriber>{
    beforeCreate(event): void {
      const attributes = encryptionService.getFields(event.model.attributes);
      attributes.forEach(
        (attr) => (event.params.data[attr] = encryptionService.encrypt(event.params.data[attr])),
      );
    },

    beforeUpdate(event): void {
      const attributes = encryptionService.getFields(event.model.attributes);
      attributes.forEach(
        (attr) => (event.params.data[attr] = encryptionService.encrypt(event.params.data[attr])),
      );
    },

    afterFindOne(event): void {
      const attributes = encryptionService.getFields(event.model.attributes);
      attributes.forEach(
        (attr) => (event['result'][attr] = encryptionService.decrypt(event['result'][attr])),
      );
    },

    afterFindMany(event): void {
      const attributes = encryptionService.getFields(event.model.attributes);
      event['result'].forEach((result, i) =>
        attributes.forEach(
          (attr) =>
            (event['result'][i][attr] = encryptionService.decrypt(event['result'][i][attr])),
        ),
      );
    },
  }) as Subscriber);
};
