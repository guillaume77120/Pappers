const fs = require('fs');
const csv = require('csv-parser');

// Chemin vers le fichier CSV
const csvFilePath = 'code.csv';
// Chemin vers le fichier JSON de sortie
const jsonFilePath = 'code.json';

// Dictionnaire pour stocker les données
const data = {};

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (row) => {
    const category = row['Category'];
    const code = row['Code'];
    const language = row['Language'];
    const description = row['Description'];

    // Initialiser la catégorie si elle n'existe pas
    if (!data[category]) {
      data[category] = {};
    }

    // Initialiser le code si il n'existe pas
    if (!data[category][code]) {
      data[category][code] = {};
    }

    // Ajouter la description pour la langue spécifiée
    data[category][code][language] = description;
  })
  .on('end', () => {
    // Écrire le dictionnaire dans un fichier JSON
    fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Erreur lors de l\'écriture du fichier JSON:', err);
      } else {
        console.log(`Données converties et enregistrées dans ${jsonFilePath}`);
      }
    });
  });
