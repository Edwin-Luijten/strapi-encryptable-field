<img src="logo_small.png" align="right" />

# Strapi's Encryptable Field Plugin

> This field type encrypts the value on create and update.  
> And decrypts on fetch one and many.

> DO NOT USE ENCRYPTION TO STORE USER PASSWORDS, FOR THIS YOU USE HASHING.  
> ONLY STORE PII DATA WHEN NEEDED AND ONLY THE BARE MINIMUM.   
> CONSULT THE RULES AROUND PII DATA THAT APPLY IN THE REGIONS YOU OPERATE IN.

![GitHub Workflow Status (main)](https://img.shields.io/github/actions/workflow/status/edwin-luijten/strapi-encryptable-field/npm-publish.yml?style=for-the-badge)
![NPM Downloads](https://img.shields.io/npm/dm/strapi-plugin-encryptable-field?style=for-the-badge)
[![Strapi Market Place](https://img.shields.io/badge/Strapi-Market%20Place-blue?style=for-the-badge)](https://market.strapi.io/plugins/strapi-plugin-encryptable-field)

**DISCLAIMER**
> Before using this in production make sure you have tested that this plugin is able to encrypt and decrypt all your
> expected data.
> Failure to decrypt results in loss of data.

## Encryption method

| Method      | IV Length | Encryption key                                                         |
|-------------|-----------|------------------------------------------------------------------------|
| aes-256-cbc | 16        | 32 bytes hex string, provided by environment variable `ENCRYPTION_KEY` |

## ✨ Supported Strapi Versions

The Encryptable Field plugin is only compatible with Strapi v4.

## ⚙️ Installation

```bash
# If you use NPM
npm install strapi-plugin-encryptable-field

# If you use Yarn
yarn add strapi-plugin-encryptable-field
```

### Configuring the plugin

Open or create the file `config/plugins.js` and enable the plugin by adding the following snippet:

```js
module.exports = {
    // ...
    'encryptable-field': {
        enabled: true,
    },
};
```

Add the environment variable `ENCRYPTION_KEY` to your server and the .env.

### Using the plugin

After installation and configuration the custom field is ready to use.  
When adding a new field, go to **custom** and select **Encryptable**.

![Select Encryptable in the Custom tab when adding a new field.](https://github.com/Edwin-Luijten/strapi-encryptable-field/raw/main/assets/encryptable_field.png "Encryptable Field")

#### Basic Settings

> Because you loose some options to validate a field (for example an email field), you can make use of a regex and a
> hint to
> tell the user what you expect.

![Set a validation regex and input hint.](https://github.com/Edwin-Luijten/strapi-encryptable-field/raw/main/assets/encryptable_field_settings.png "Field Settings")

#### Advanced Settings

> By default, all fields will be decrypted when queried. It is also possible to only show the decrypted values for one
> or
> more roles.

![Select one or more roles to show decrypted value to](https://github.com/Edwin-Luijten/strapi-encryptable-field/raw/main/assets/role_based_decryption_settings.png "Select Roles")

> Below images show what it looks like in a form and overview when decryption is enabled for a specific role.

![](https://github.com/Edwin-Luijten/strapi-encryptable-field/raw/main/assets/role_based_decryption_form.png "Role Based Decryption In A Form")
![](https://github.com/Edwin-Luijten/strapi-encryptable-field/raw/main/assets/role_based_decryption_overview.png "Role Based Decryption On The Overview")

## 🚀 Roadmap

- [x] Role based decryption