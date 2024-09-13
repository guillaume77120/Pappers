const { MongoClient } = require('mongodb');

async function createCollections(db) {
  try {
    console.time('Création des collections');
    
    // Vérification si la collection 'enterprise' existe déjà
    const collections = await db.listCollections({ name: 'enterprise' }).toArray();
    if (collections.length === 0) {
      await db.createCollection('enterprise');
      console.log("Collection 'enterprise' créée.");
    } else {
      console.log("Collection 'enterprise' existe déjà.");
    }

    // Vérification si la collection 'establishment' existe déjà
    const collectionsEstablishment = await db.listCollections({ name: 'establishment' }).toArray();
    if (collectionsEstablishment.length === 0) {
      await db.createCollection('establishment');
      console.log("Collection 'establishment' créée.");
    } else {
      console.log("Collection 'establishment' existe déjà.");
    }
    
    console.timeEnd('Création des collections');
  } catch (error) {
    console.error('Erreur lors de la création des collections:', error);
  }
}

async function createIndexes(db) {
  try {
    console.time('Création des index');
    
    // Création de l'index sur EnterpriseNumber dans la collection enterprise
    await db.collection('enterprise').createIndex({ EnterpriseNumber: 1 });
    console.log("Index créé sur 'EnterpriseNumber' dans la collection 'enterprise'");
    await db.collection('enterprise').createIndex({ Denomination: 1 });
    console.log("Index créé sur 'EnterpriseNumber' dans la collection 'enterprise'");
    // Création de l'index sur EstablishmentNumber dans la collection establishment
    await db.collection('establishment').createIndex({ EstablishmentNumber: 1 });
    console.log("Index créé sur 'EstablishmentNumber' dans la collection 'establishment'");
    
    console.timeEnd('Création des index');
  } catch (error) {
    console.error('Erreur lors de la création des index:', error);
  }
}

async function main() {
  const uri = 'mongodb://localhost:27017'; // URI de MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connecté à MongoDB');

    const db = client.db('Pappers'); // Nom de la base de données

    // Créer les collections
    await createCollections(db);

    // Créer les index
    await createIndexes(db);
  } catch (error) {
    console.error('Erreur lors de l\'exécution du script:', error);
  } finally {
    await client.close();
    console.log('Connexion à MongoDB fermée');
  }
}

// Exécuter la fonction principale
main();
