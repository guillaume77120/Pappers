const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// Chemin du fichier CSV
const csvFilePath = path.join(__dirname, 'KBO/activity.csv');
const BATCH_SIZE = 5000; // Taille des lots pour `bulkWrite`

async function readCSV(filePath) {
  console.time(`Lecture du fichier ${filePath}`);
  return new Promise((resolve, reject) => {
    const data = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => data.push(row))
      .on('end', () => {
        console.timeEnd(`Lecture du fichier ${filePath}`);
        resolve(data);
      })
      .on('error', (error) => {
        console.error(`Erreur lors de la lecture du fichier ${filePath}:`, error);
        reject(error);
      });
  });
}

async function updateDataInBatches(collectionName, data, db) {
  let batch = [];
  let batchCount = 0;
  const collection = db.collection(collectionName);

  while (data.length) {
    batch = data.splice(0, BATCH_SIZE);
    console.time(`Mise à jour dans la collection ${collectionName} - Lot ${batchCount + 1}`);
    
    const bulkOps = batch.map(activity => {
      const filter = collectionName === 'enterprise' ? { EnterpriseNumber: activity.EntityNumber } : { EstablishmentNumber: activity.EntityNumber };
      const update = { $push: { activities: activity } };
      
      return {
        updateOne: {
          filter,
          update,
          upsert: true
        }
      };
    });

    try {
      const result = await collection.bulkWrite(bulkOps, { ordered: false });
      console.log(`Documents mis à jour dans le lot ${batchCount + 1} pour la collection ${collectionName}:`, result);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour dans MongoDB pour la collection ${collectionName}:`, error);
      
      // Réessayer l'opération ligne par ligne en cas d'erreur
      for (const activity of batch) {
        try {
          const filter = collectionName === 'enterprise' ? { EnterpriseNumber: activity.EntityNumber } : { EstablishmentNumber: activity.EntityNumber };
          await collection.updateOne(filter, { $push: { activities: activity } }, { upsert: true });
        } catch (singleError) {
          console.error(`Erreur lors de la mise à jour d'une ligne : ${singleError.message}`);
        }
      }
    }

    console.timeEnd(`Mise à jour dans la collection ${collectionName} - Lot ${batchCount + 1}`);
    batchCount++;
  }
}

async function main() {
  console.time('Exécution principale');
  const uri = 'mongodb://localhost:27017'; // URI de MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connecté à MongoDB');

    const db = client.db('Pappers'); // Nom de la base de données

    // Lire les données du fichier CSV
    const startTime = Date.now();
    const activityData = await readCSV(csvFilePath);
    console.log(`Temps total pour lire le fichier CSV : ${Date.now() - startTime} ms`);

    // Insérer les données dans MongoDB en lots
    console.time('Mise à jour des données');
    await Promise.all([
      updateDataInBatches('enterprise', [...activityData], db),
      updateDataInBatches('establishment', [...activityData], db)
    ]);
    console.timeEnd('Mise à jour des données');
  } catch (error) {
    console.error('Erreur lors de l\'exécution du script:', error);
  } finally {
    await client.close();
    console.log('Connexion à MongoDB fermée');
    console.timeEnd('Exécution principale');
  }
}

// Exécuter la fonction principale
main();
