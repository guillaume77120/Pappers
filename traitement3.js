const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');
 
const activityFilePath = path.resolve(__dirname, 'KBO/activity.csv');
const BATCH_SIZE = 100000;
 
async function processActivityCSV(db) {
  const establishmentCollection = db.collection('establishment');
 
  let count = 0;
  let updatePromises = [];
 
  console.log('Début de la lecture du fichier activity.csv');
 
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(activityFilePath).pipe(csv());
 
    readStream
      .on('data', (row) => {
        count++;
 
        if (row.EntityNumber && /^2\.\d{3}\.\d{3}\.\d{3}$/gm.test(row.EntityNumber)) {
          const establishmentNumber = row.EntityNumber;
 
          const updatePromise = establishmentCollection.updateOne(
            { EstablishmentNumber: establishmentNumber },
            { $set: row },
            { upsert: true }
          );
          updatePromises.push(updatePromise);
        }
 
        // Execute Promise.all for every batch of BATCH_SIZE
        if (count % BATCH_SIZE === 0) {
          console.log(`Traitement d'un batch de ${BATCH_SIZE} lignes. Exécution de Promise.all...`);
 
          readStream.pause(); // Pause reading the stream during batch processing
          Promise.all(updatePromises)
            .then(() => {
              console.log(`${count} lignes traitées avec succès.`);
              updatePromises = []; // Reset the promises array after resolving the batch
              readStream.resume(); // Resume the stream after processing the batch
            })
            .catch((error) => {
              console.error('Erreur lors du traitement d\'un batch :', error);
              reject(error); // Reject the promise if there's an error
            });
        }
      })
      .on('end', async () => {
        console.log(`Fichier activity.csv entièrement lu. ${count} lignes traitées.`);
 
        // Handle remaining promises if there are any
        if (updatePromises.length > 0) {
          console.log(`Traitement du dernier batch de ${updatePromises.length} lignes.`);
          try {
            await Promise.all(updatePromises);
            console.log('Toutes les lignes restantes ont été traitées avec succès.');
          } catch (error) {
            console.error('Erreur lors du traitement du dernier batch :', error);
            reject(error);
          }
        }
        resolve();
      })
      .on('error', (error) => {
        console.error('Erreur lors de la lecture de activity.csv :', error);
        reject(error);
      });
  });
}
 
async function main() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);
 
  try {
    await client.connect();
    console.log('Connecté à MongoDB');
 
    const db = client.db('test');
    await processActivityCSV(db);
  } catch (error) {
    console.error('Erreur lors de la connexion ou du traitement :', error);
  } finally {
    await client.close();
    console.log('Connexion à MongoDB fermée');
  }
}
 
main();