import { nodeEnv } from '../config.js';

export default async function insertAllDocs(docPerId, Model) {
  const documents = Object.values(docPerId);
  try {
    const result = await Model.insertMany(documents, {
      ordered: false,
    });
    nodeEnv === 'development' &&
      console.log(`✅ Successfully inserted ${result.length} new documents.`);
  } catch (err) {
    // Check if it's only duplicate key errors
    if (err.code === 11000 || err.writeErrors?.every((e) => e.code === 11000)) {
      console.warn(`⚠️ Some documents already existed. Inserted the rest.`);
    } else {
      console.error('❌ Unexpected error during insertMany:', err);
    }
    return { err };
  }
}
