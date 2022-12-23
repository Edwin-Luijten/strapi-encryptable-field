import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginId from './pluginId';
import getTranslationId from './utils/getTranslationId';
import Multiselect from './components/Multiselect';

export default {
  async register(app) {
    app.plugins['content-type-builder'].apis.forms.components.add({
      id: 'multiselect',
      component: Multiselect,
    });

    app.customFields.register({
      pluginId,
      name: pluginId,
      type: 'string',
      intlLabel: {
        id: getTranslationId(`label`),
        defaultMessage: 'Encryptable',
      },
      intlDescription: {
        id: getTranslationId(`description`),
        defaultMessage: 'Adds Encryptable fields',
      },
      components: {
        Input: async () => import('./components/EncryptableFieldInput'),
      },
      options: {
        base: [
          {
            intlLabel: {
              id: getTranslationId(`options.advanced.regex.hint`),
              defaultMessage: 'Input hint',
            },
            name: 'options.hint',
            type: 'text',
            defaultValue: null,
            description: {
              id: getTranslationId(`options.advanced.regex.hint.description`),
              defaultMessage: 'The text of the regular expression hint',
            },
          },
          {
            intlLabel: {
              id: getTranslationId(`options.advanced.regex`),
              defaultMessage: 'RegExp pattern',
            },
            name: 'regex',
            type: 'text',
            defaultValue: null,
            description: {
              id: `content-type-builder.form.attributes.item.regex`,
              defaultMessage: 'The text of the regular expression',
            },
          },
        ],
        advanced: [
          {
            sectionTitle: {
              id: getTranslationId('role_settings'),
              defaultMessage: 'Role Settings',
            },
            items: [
              {
                intlLabel: {
                  id: getTranslationId('options.role_selector.label'),
                  defaultMessage: 'Select one or more roles',
                },
                description: {
                  id: getTranslationId('options.role_selector.description'),
                  defaultMessage: 'Only for these roles the values will be decrypted',
                },
                name: 'options.roles',
                type: 'multiselect',
                options: [],
              },
            ],
          },
          {
            sectionTitle: {
              id: 'global.settings',
              defaultMessage: 'Settings',
            },
            items: [
              {
                name: 'required',
                type: 'checkbox',
                intlLabel: {
                  id: 'content-type-builder.form.attribute.item.requiredField',
                  defaultMessage: 'Required field',
                },
                description: {
                  id: 'content-type-builder.form.attribute.item.requiredField.description',
                  defaultMessage: "You won't be able to create an entry if this field is empty**",
                },
              },
              {
                name: 'private',
                type: 'checkbox',
                intlLabel: {
                  id: 'content-type-builder.form.attribute.item.privateField',
                  defaultMessage: 'Private field',
                },
                description: {
                  id: 'content-type-builder.form.attribute.item.privateField.description',
                  defaultMessage: 'This field will not show up in the API response',
                },
              },
              {
                name: 'maxLength',
                type: 'checkbox-with-number-field',
                intlLabel: {
                  id: 'content-type-builder.form.attribute.item.maximumLength',
                  defaultMessage: 'Maximum length',
                },
              },
              {
                name: 'minLength',
                type: 'checkbox-with-number-field',
                intlLabel: {
                  id: 'content-type-builder.form.attribute.item.minimumLength',
                  defaultMessage: 'Minimum length',
                },
              },
            ],
          },
        ],
      },
    });
  },

  async registerTrads(app) {
    const { locales } = app;

    return await Promise.all(
      locales.map((locale) =>
        import(`./translations/${locale}.json`)
          .then(({ default: data }) => ({
            data: prefixPluginTranslations(data, pluginId),
            locale,
          }))
          .catch(() => ({
            data: {},
            locale,
          })),
      ),
    );
  },
};
