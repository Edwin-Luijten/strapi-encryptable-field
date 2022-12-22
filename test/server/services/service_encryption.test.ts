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

  it('checkIfEncrypted should return true if the value is already encrypted', () => {
    const s = service.service({ strapi: strapi });
    const encrypted = s.encrypt('a');
    const isEncrypted = s.isEncrypted(encrypted);

    expect(isEncrypted).toBe(true);
  });

  it('checkIfEncrypted should return false if the value is not encrypted', () => {
    const s = service.service({ strapi: strapi });
    const isEncrypted = s.isEncrypted('903248329043284slkdfjslf');

    expect(isEncrypted).toBe(false);
  });
});
