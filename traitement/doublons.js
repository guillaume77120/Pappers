const { MongoClient } = require('mongodb');

async function removeDuplicates(db, collectionName, uniqueField) {
  try {
    console.log(`Suppression des doublons dans la collection ${collectionName}`);
    const collection = db.collection(collectionName);

    // Pipeline pour trouver et supprimer les doublons
    const cursor = await collection.aggregate([
      {
        $group: {
          _id: `$${uniqueField}`,
          count: { $sum: 1 },
          docs: { $push: "$_id" }
        }
      },
      {
        $match: { count: { $gt: 1 } }
      }
    ]);

    let deletedCount = 0;
    for await (const doc of cursor) {
      // Supprimer tous les documents sauf le premier trouvé
      const idsToDelete = doc.docs.slice(1);
      const deleteResult = await collection.deleteMany({ _id: { $in: idsToDelete } });
      deletedCount += deleteResult.deletedCount;
    }

    console.log(`${deletedCount} doublons supprimés de la collection ${collectionName}`);
  } catch (error) {
    console.error(`Erreur lors de la suppression des doublons dans la collection ${collectionName}:`, error);
  }
}

async function main() {
  const uri = 'mongodb://localhost:27017'; // URI de MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connecté à MongoDB');

    const db = client.db('Pappers'); // Nom de la base de données

    // Supprimer les doublons dans les collections
    await removeDuplicates(db, 'enterprise', 'EnterpriseNumber');
    await removeDuplicates(db, 'establishment', 'EstablishmentNumber');
  } catch (error) {
    console.error('Erreur lors de l\'exécution du script:', error);
  } finally {
    await client.close();
    console.log('Connexion à MongoDB fermée');
  }
}

// Exécuter la fonction principale
main();
