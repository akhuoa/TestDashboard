// replacement of config/local.json for testing
export const config = {
  ALGOLIA_APP_ID: import.meta.env.VITE_ALGOLIA_APP_ID || '',
  ALGOLIA_API_KEY: import.meta.env.VITE_ALGOLIA_API_KEY || '',
  AlgoliaIndexName: import.meta.env.VITE_ALGOLIA_INDEX_NAME || ''
};
