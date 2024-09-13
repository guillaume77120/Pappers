const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { MongoClient } = require('mongodb');

// Chemins des fichiers CSV
const filePaths = {
  enterprise: path.resolve(__dirname, 'KBO/enterprise.csv'),
  branch: path.resolve(__dirname, 'KBO/branch.csv'),
  establishment: path.resolve(__dirname, 'KBO/establishment.csv'),
  address: path.resolve(__dirname, 'KBO/address.csv'),
  contact: path.resolve(__dirname, 'KBO/contact.csv'),
  denomination: path.resolve(__dirname, 'KBO/denomination.csv')
};

// Taille des lots pour insertion en base
const BATCH_SIZE = 100000;

// Fonction pour lire un fichier CSV
function readCSV(filePath) {
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

// Fonction pour fusionner les données additionnelles (address, contact, denomination) avec les collections principales
function mergeAdditionalData(primaryData, additionalData, key) {
  additionalData.forEach((row) => {
    const mergeKey = row[key];
    if (primaryData[mergeKey]) {
      Object.assign(primaryData[mergeKey], row); // Fusionner les données
    }
  });
}

// Fonction pour insérer les données en lots dans MongoDB
async function insertDataInBatches(collection, data, dbName) {
  let batch = [];
  let count = 0;
  let batchCount = 0;

  const collectionDb = dbName.collection(collection);

  for (let i = 0; i < data.length; i++) {
    batch.push(data[i]);

    if (batch.length === BATCH_SIZE || i === data.length - 1) {
      console.time(`Insertion dans la collection ${collection} - Lot ${batchCount + 1}`);
      try {
        const result = await collectionDb.insertMany(batch);
        count += result.insertedCount;
        batchCount++;
        console.log(`${result.insertedCount} documents insérés dans le lot ${batchCount} pour la collection ${collection}.`);
      } catch (error) {
        console.error(`Erreur lors de l'insertion dans MongoDB pour la collection ${collection}:`, error);
      }
      console.timeEnd(`Insertion dans la collection ${collection} - Lot ${batchCount}`);
      
      batch = []; // Vider le lot
    }
  }

  console.log(`Total de ${count} documents insérés dans MongoDB pour la collection ${collection}.`);
  console.log(`${batchCount} lots insérés au total pour la collection ${collection}.`);
}

// Fonction principale
async function main() {
  console.time('Exécution principale');
  const uri = 'mongodb://localhost:27017'; // URI de MongoDB
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Connecté à MongoDB');

    const db = client.db('Pappers'); // Nom de la base de données

    // Lire les données des fichiers CSV
    const startTime = Date.now();
    const enterpriseData = await readCSV(filePaths.enterprise);
    const branchData = await readCSV(filePaths.branch);
    const establishmentData = await readCSV(filePaths.establishment);
    const addressData = await readCSV(filePaths.address);
    const contactData = await readCSV(filePaths.contact);
    const denominationData = await readCSV(filePaths.denomination);
    console.log(`Temps total pour lire les fichiers CSV : ${Date.now() - startTime} ms`);

    // Transformer les données en objets clé-valeur pour faciliter la fusion
    const enterpriseDataMap = Object.fromEntries(enterpriseData.map(row => [row['EnterpriseNumber'], row]));
    const branchDataMap = Object.fromEntries(branchData.map(row => [row['Id'], row]));
    const establishmentDataMap = Object.fromEntries(establishmentData.map(row => [row['EstablishmentNumber'], row]));

    // Fusionner les fichiers supplémentaires (address, contact, denomination) avec les collections principales
    console.time('Fusion des données');
    mergeAdditionalData(enterpriseDataMap, addressData, 'EntityNumber');
    mergeAdditionalData(enterpriseDataMap, contactData, 'EntityNumber');
    mergeAdditionalData(enterpriseDataMap, denominationData, 'EntityNumber');
    
    mergeAdditionalData(branchDataMap, addressData, 'EntityNumber');
    mergeAdditionalData(branchDataMap, contactData, 'EntityNumber');
    mergeAdditionalData(branchDataMap, denominationData, 'EntityNumber');
    
    mergeAdditionalData(establishmentDataMap, addressData, 'EntityNumber');
    mergeAdditionalData(establishmentDataMap, contactData, 'EntityNumber');
    mergeAdditionalData(establishmentDataMap, denominationData, 'EntityNumber');
    console.timeEnd('Fusion des données');

    // Convertir les objets en tableau pour insertion
    const enterpriseDataArray = Object.values(enterpriseDataMap);
    const branchDataArray = Object.values(branchDataMap);
    const establishmentDataArray = Object.values(establishmentDataMap);

    // Insérer les données dans MongoDB en lots
    console.time('Insertion des données');
    await insertDataInBatches('enterprise', enterpriseDataArray, db);
    await insertDataInBatches('branch', branchDataArray, db);
    await insertDataInBatches('establishment', establishmentDataArray, db);
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
