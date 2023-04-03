process.env.ENCRYPTION_KEY = '4849029e1295b214fcc42630903e5093';

import service from '../../../server/services';
import Strapi from '@strapi/strapi';

const strapi = Strapi({});

const isEncryptedTestValues = [
  { value: '903248329043284slkdfjslf', expectation: false },
  { value: '903248329043284slkdfjslf:903248329043284slkdfjslf', expectation: false },
  {
    value: 'c79f854cc015d47ab2f1c1c263764d67:001f77c44ca15f84873c1f87de4d85a4',
    expectation: false,
  }, // encrypted with a different key
  {
    value: 'c79f854cc015d47ab2f1c1c263764d69:001f77c44ca15f84873c1f87de4d85a4',
    expectation: false,
  }, // changed char in iv length, encrypted with a different key
  { value: '4a5499b41a2d6c193e5391a3d7056cd8:13fbf9e0bf5f18fd96968b242c858685', expectation: true },
  {
    value: '4a5499b41a2d6c193e5391a3d7056cdu:13fbf9e0bf5f18fd96968b242c858685',
    expectation: false,
  }, // changed char in iv length
  {
    value: '4a5499b41a2d6c193e5391a3d7056cd8:13fbf9e0bf5f18fd96968b242c858686',
    expectation: false,
  }, // changed char after iv length
  {
    value: '!dfflv;.@4a5499b41a2d6caldl:Some_garbage_iv',
    expectation: false,
  },
  {
    value: '4a5499b41a2d6c:A_truncated_iv',
    expectation: false,
  },
];

describe('Encryption Service', () => {
  it('Encrypted value should be successfully decrypted', () => {
    const s = service.service({ strapi: strapi });
    const encrypted = s.encrypt('a');
    const decrypted = s.decrypt(encrypted);

    expect('a').toBe(decrypted);
  });

  it('It should throw an error on invalid initialization vector', () => {
    const s = service.service({ strapi: strapi });
    expect(() => s.decrypt(':')).toThrow('Invalid initialization vector');
  });

  it('It should throw an error on malformed payload', () => {
    const s = service.service({ strapi: strapi });
    expect(() => s.decrypt('a')).toThrow('Malformed payload');
  });

  it('checkIfEncrypted should return true if the value is already encrypted', () => {
    const s = service.service({ strapi: strapi });
    const encrypted = s.encrypt('a');
    const isEncrypted = s.isEncrypted(encrypted);

    expect(isEncrypted).toBe(true);
  });

  it('checkIfEncrypted should return false if the value is not encrypted', () => {
    const s = service.service({ strapi: strapi });

    isEncryptedTestValues.forEach((test) => {
      const isEncrypted = s.isEncrypted(test.value);
      expect(isEncrypted).toBe(test.expectation);
    });
  });
});
