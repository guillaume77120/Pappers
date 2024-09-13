const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const csv = require('csv-parser');

// Fonction pour scraper la page pour un numéro d'entreprise donné
async function scrapeCompanyData(companyNumber) {
    const formattedNumber = companyNumber.replace(/\./g, ''); // Supprimer les points dans le numéro
    const url = `https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?lang=fr&nummer=${formattedNumber}`;
    
    try {
        // Récupérer le contenu de la page
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extraire les informations (exemple : adapter le sélecteur en fonction du site)
        const companyInfo = $('div.some-class-name').text().trim(); // Adapter selon la structure HTML
        console.log(`Informations pour le numéro ${companyNumber}:`, companyInfo);
    } catch (error) {
        console.error(`Erreur lors du scraping pour ${companyNumber}:`, error.message);
    }
}

// Lire le fichier CSV et scraper les informations pour chaque numéro d'entreprise
function scrapeCompaniesFromCSV() {
    const results = [];

    // Lire le fichier CSV
    fs.createReadStream('entreprises.csv')
        .pipe(csv())
        .on('data', (row) => {
            const enterpriseNumber = row.EnterpriseNumber;
            results.push(enterpriseNumber);
        })
        .on('end', async () => {
            // Une fois que le CSV est entièrement lu, scraper les données pour chaque numéro
            for (const companyNumber of results) {
                await scrapeCompanyData(companyNumber); // Scraper pour chaque numéro
            }
        });
}

// Appeler la fonction pour lancer le scraping
scrapeCompaniesFromCSV();
