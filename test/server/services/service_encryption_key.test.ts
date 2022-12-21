process.env.ENCRYPTION_KEY = '';

import service from '../../../server/services';
import Strapi from '@strapi/strapi';

const strapi = Strapi({});
describe('Encryption Service', () => {
  it('It should throw an error if an invalid key length is used', () => {
    const s = service.service({ strapi: strapi });

    expect(() => s.encrypt('a')).toThrow('Invalid key length');
  });
});
