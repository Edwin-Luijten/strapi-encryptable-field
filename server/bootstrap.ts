import { ENCRYPTABLE_FIELD } from './index';
import { Subscriber } from '@strapi/database/lib/lifecycles/subscribers';

export default ({ strapi }: { strapi }) => {
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
      attributes.forEach((attr) => {
        // check if it's already encrypted
        if (!encryptionService.isEncrypted(event.params.data[attr])) {
          event.params.data[attr] = encryptionService.encrypt(event.params.data[attr]);
        }
      });
    },

    async afterFindOne(event): Promise<void> {
      if (event['result']) { // If there is no result, there is no need to decrypt anything
        const ctx = strapi.requestContext.get();

        const attributes = encryptionService.getFields(
          event.model.attributes,
          ctx?.state?.user?.roles,
        );

        attributes.forEach((attr) => {
          try {
            event['result'][attr] = encryptionService.decrypt(event['result'][attr]);
          } catch (e) {
            console.error(`Failed to decrypt ${attr}.`, e.message);
            event['result'][attr] = event['result'][attr];
          }
        });
      }
    },

    afterFindMany(event): void {
      if (event['result'] && event['result'].length > 0) { // If there is no result, there is no need to decrypt anything
        const ctx = strapi.requestContext.get();

        const attributes = encryptionService.getFields(
          event.model.attributes,
          ctx?.state?.user?.roles,
        );
        event['result'].forEach((result, i) =>
          attributes.forEach((attr) => {
            try {
              event['result'][i][attr] = encryptionService.decrypt(event['result'][i][attr]);
            } catch (e) {
              console.error(`Failed to decrypt ${attr} at index ${i}.`, e.message);
              event['result'][i][attr] = event['result'][i][attr];
            }
          }),
        );
      }
    },
  }) as Subscriber);
};
