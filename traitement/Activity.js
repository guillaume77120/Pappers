const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// Chemin du fichier CSV
const csvFilePath = path.join(__dirname, 'KBO/activity.csv');
const BATCH_SIZE = 1000; // Taille des lots pour `insertMany`

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

async function insertDataInBatches(collection, data, db) {
  let batch = [];
  let count = 0;
  let batchCount = 0;

  const collectionDb = db.collection(collection);

  for (let i = 0; i < data.length; i++) {
    batch.push(data[i]);

    if (batch.length === BATCH_SIZE || i === data.length - 1) {
      console.time(`Insertion dans la collection ${collection} - Lot ${batchCount + 1}`);
      try {
        const result = await collectionDb.insertMany(batch, { ordered: false });
        count += result.insertedCount;
        batchCount++;
        console.log(`${result.insertedCount} documents insérés dans le lot ${batchCount} pour la collection ${collection}.`);
      } catch (error) {
        console.error(`Erreur lors de l'insertion dans MongoDB pour la collection ${collection}:`, error);
        // Réessayer l'insertion ligne par ligne en cas d'erreur
        for (const row of batch) {
          try {
            await collectionDb.insertOne(row);
            count++;
          } catch (singleError) {
            console.error(`Erreur lors de l'insertion d'une ligne : ${singleError.message}`);
          }
        }
      }
      console.timeEnd(`Insertion dans la collection ${collection} - Lot ${batchCount}`);
      batch = []; // Vider le lot après insertion
    }
  }

  console.log(`Total de ${count} documents insérés dans MongoDB pour la collection ${collection}.`);
  console.log(`${batchCount} lots insérés au total pour la collection ${collection}.`);
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
    console.time('Insertion des données');
    await insertDataInBatches('activity', activityData, db);
    console.timeEnd('Insertion des données');
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
