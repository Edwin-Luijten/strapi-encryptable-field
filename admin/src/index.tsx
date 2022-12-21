import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginId from './pluginId';
import getTranslationId from './utils/getTranslationId';

export default {
  register(app) {
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
              id: getTranslationId(`options.advanced.regex.description`),
              defaultMessage: 'The text of the regular expression',
            },
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
                  id: getTranslationId(`options.advanced.requiredField`),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTranslationId(`options.advanced.requiredField.description`),
                  defaultMessage: "You won't be able to create an entry if this field is empty",
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

    const importedTrads = await Promise.all(
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

    return importedTrads;
  },
};
