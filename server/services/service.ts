import { Strapi } from '@strapi/strapi';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const AES_METHOD = 'aes-256-cbc';
const IV_LENGTH = 16;
const KEY = process.env.ENCRYPTION_KEY || ''; // hex key 32 bytes
const PLUGIN_DSN = 'plugin::encryptable-field.encryptable-field';

export default ({ strapi }: { strapi: Strapi }) => ({
  // Get fields that are of our custom field type.
  getFields(fields: object): string[] {
    const attributes: Array<string> = [];
    for (const attribute in fields) {
      if (
        Object.hasOwn(fields, attribute) &&
        Object.hasOwn(fields[attribute], 'customField') &&
        fields[attribute].customField === PLUGIN_DSN
      ) {
        attributes.push(attribute);
      }
    }

    return attributes;
  },

  encrypt(value: string): string {
    if (!value) return value;

    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(AES_METHOD, Buffer.from(KEY), iv);

    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  },

  isEncrypted(value: string): boolean {
    if (!value) return false;

    const textParts = value.split(':');
    const firstPart = textParts.shift();

    if (!firstPart) throw new Error('Malformed payload');

    const iv = Buffer.from(firstPart, 'hex');

    return (iv.length === IV_LENGTH && /[0-9A-Fa-f]{6}/g.test(value));
  },

  decrypt(value: string): string {
    if (!value) return value;

    const textParts = value.split(':');
    const firstPart = textParts.shift();

    if (!firstPart) throw new Error('Malformed payload');

    const iv = Buffer.from(firstPart, 'hex');
    const encryptedText = Buffer.from(textParts.join(':'), 'hex');
    const decipher = createDecipheriv(AES_METHOD, Buffer.from(KEY), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  },
});
