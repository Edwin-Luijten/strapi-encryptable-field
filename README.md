<img src="logo_small.png" align="right" />

# Strapi's Encryptable Field Plugin

> This field type encrypts the value on create and update.  
> And decrypts on fetch one and many.

> DO NOT USE ENCRYPTION TO STORE USER PASSWORDS, FOR THIS YOU USE HASHING.  
> ONLY STORE PII DATA WHEN NEEDED AND ONLY THE BARE MINIMUM. CONSULT THE RULES AROUND PII DATA THAT APPLY IN THE REGIONS
> YOU OPERATE IN.

## Encryption method

Method: `aes-256-cbc`  
IV Length: `16`  
Encryption key: `32 bytes hex string` provided by environment variable `ENCRYPTION_KEY`

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

## 🚀 Roadmap

- [ ] Role based decryption