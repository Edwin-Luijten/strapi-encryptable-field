import pluginId from '../pluginId';

const getTranslationId = (id: string) => `${pluginId}.${id}`;

export default getTranslationId;
