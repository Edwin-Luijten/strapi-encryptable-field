process.env.ENCRYPTION_KEY = '4849029e1295b214fcc42630903e5093';

import service from '../../../server/services';
import Strapi from '@strapi/strapi';

const strapi = Strapi({});
describe('Encryption Service', () => {
  it('Encrypted value should be successfully decrypted', () => {
    const s = service.service({ strapi: strapi });
    const encrypted = s.encrypt('a');
    const decrypted = s.decrypt(encrypted);

    expect('a').toBe(decrypted);
  });

  it('It should throw an error on invalid initialization vector', () => {
    const s = service.service({ strapi: strapi });
    expect(() => s.decrypt('a')).toThrow('Invalid initialization vector');
  });

  it('It should throw an error on malformed payload', () => {
    const s = service.service({ strapi: strapi });
    expect(() => s.decrypt(':')).toThrow('Malformed payload');
  });
});
