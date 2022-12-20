import React from 'react';
import { prefixPluginTranslations } from '@strapi/helper-plugin';
import pluginId from './pluginId';
import getTrad from './utils/getTrad';

export default {
  register(app) {
    app.customFields.register({
      name: pluginId,
      pluginId: pluginId,
      type: 'string',
      intlLabel: {
        id: getTrad(`${pluginId}.label`),
        defaultMessage: 'Encryptable'
      },
      intlDescription: {
        id: getTrad(`${pluginId}.description`),
        defaultMessage: 'Adds Encryptable fields',
      },
      components: {
        Input: async () => import('./components/EncryptableFieldInput'),
      },
      options: {
        base: [
          {
            intlLabel: {
              id: getTrad(`${pluginId}.options.advanced.regex.hint`),
              defaultMessage: 'Input hint',
            },
            name: 'options.hint',
            type: 'text',
            defaultValue: null,
            description: {
              id: getTrad(`${pluginId}.options.advanced.regex.hint.description`),
              defaultMessage: 'The text of the regular expression hint',
            },
          },
          {
            intlLabel: {
              id: getTrad(`${pluginId}.options.advanced.regex`),
              defaultMessage: 'RegExp pattern',
            },
            name: 'regex',
            type: 'text',
            defaultValue: null,
            description: {
              id: getTrad(`${pluginId}.options.advanced.regex.description`),
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
                  id: getTrad(`${pluginId}.options.advanced.requiredField`),
                  defaultMessage: 'Required field',
                },
                description: {
                  id: getTrad(`${pluginId}.options.advanced.requiredField.description`),
                  defaultMessage: 'You won\'t be able to create an entry if this field is empty',
                },
              },
            ],
          },
        ]
      }
    })
  },

  bootstrap(app) {
  },

  async registerTrads(app) {
    const {locales} = app;

    const importedTrads = await Promise.all(
      locales.map(locale => {
        return import(`./translations/${locale}.json`)
          .then(({default: data}) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};
