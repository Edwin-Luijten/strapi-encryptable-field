import { Strapi } from '@strapi/strapi';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const AES_METHOD = 'aes-256-cbc';
const IV_LENGTH = 16;
const KEY = process.env.ENCRYPTION_KEY || ''; // hex key 32 bytes
const PLUGIN_DSN = 'plugin::encryptable-field.encryptable-field';

export default ({ strapi }: { strapi: Strapi }) => ({
  // Get fields that are of our custom field type.
  getFields(fields: object, roles?: any[]): string[] {
    const attributes: Array<string> = [];
    for (const attribute in fields) {
      if (
        Object.hasOwn(fields, attribute) &&
        Object.hasOwn(fields[attribute], 'customField') &&
        fields[attribute].customField === PLUGIN_DSN
      ) {
        if (roles &&
          Object.hasOwn(fields[attribute], 'options') &&
          Object.hasOwn(fields[attribute].options, 'roles')
        ) {
          for (const id of roles?.map((role: any) => role.id) ?? []) {
            if (fields[attribute].options.roles.includes(id.toString())) {
              attributes.push(attribute);
            }
          }
        } else {
          attributes.push(attribute);
        }
      }
    }

    return attributes;
  },

  isEncrypted(value: string): boolean {
    if (!value) return false;

    const dotsPos = value.indexOf(':');

    // We can do a sanity check here, because the IV being hexadecimal encoded should be around double IV_LENGTH
    if (dotsPos < IV_LENGTH) return false

    const iv = Buffer.from(value.slice(0, dotsPos), 'hex');

    // Test first indications of encrypted or not
    if (iv.length !== IV_LENGTH) {
      return false;
    }

    try {
      this.decrypt(value);
      return true;
    } catch (e) {
      return false;
    }
  },

  encrypt(value: string): string {
    if (!value) return value;

    const iv = randomBytes(IV_LENGTH);
    const cipher = createCipheriv(AES_METHOD, Buffer.from(KEY), iv);

    let encrypted = cipher.update(value);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
  },

  decrypt(value: string): string {
    if (!value) return value;

    const dotsPos = value.indexOf(':');

    if (dotsPos < 0) throw new Error('Malformed payload');

    const iv = Buffer.from(value.slice(0, dotsPos), 'hex');
    const encryptedText = Buffer.from(value.slice(dotsPos + 1), 'hex');
    const decipher = createDecipheriv(AES_METHOD, Buffer.from(KEY), iv);

    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  },
});
