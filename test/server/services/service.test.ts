process.env.ENCRYPTION_KEY='4849029e1295b214fcc42630903e5093';

import service from '../../../server/services';

describe('Encryption Service', () => {
    it('Encrypted value should be successfully decrypted', () => {
        const s = service.service({strapi: undefined});
        const encrypted = s.encrypt('a');
        const decrypted = s.decrypt(encrypted);

        expect('a').toBe(decrypted);
    });
});