const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;

app.use(express.json());

// Connexion à MongoDB locale
const mongoURI = 'mongodb://localhost:27017';
const dbName = 'Pappers';
let db;

MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    console.log('Connexion à MongoDB réussie');
  })
  .catch(err => console.error('Erreur de connexion à MongoDB :', err));

// Fonction pour paginer les résultats
const paginate = async (collection, page, limit, filter = {}) => {
  const skip = (page - 1) * limit;
  return collection.find(filter).skip(skip).limit(limit).toArray();
};

// Récupérer toutes les entreprises avec pagination et recherche
app.get('/api/enterprises', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page courante
    const limit = parseInt(req.query.limit) || 20; // Nombre d'éléments par page
    const searchQuery = req.query.search ? req.query.search.trim() : ''; // Requête de recherche

    // Construire la requête de filtrage
    const filter = searchQuery ? {
      $or: [
        { Denomination: { $regex: searchQuery, $options: 'i' } },
        { EnterpriseNumber: { $regex: searchQuery, $options: 'i' } },
        { StreetFR: { $regex: searchQuery, $options: 'i' } }  // Ajout du filtre pour StreetFR
      ]
    } : {};

    // Récupérer les résultats avec pagination
    const enterprises = await paginate(db.collection('enterprise'), page, limit, filter);

    res.json(enterprises);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des entreprises', error });
  }
});





// Récupérer tous les établissements avec pagination
app.get('/api/establishments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page courante
    const limit = parseInt(req.query.limit) || 10; // Nombre d'éléments par page
    const establishments = await paginate(db.collection('establishment'), page, limit);
    res.json(establishments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des établissements', error });
  }
});


// Récupérer toutes les branches avec pagination
app.get('/api/branches', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page courante
    const limit = parseInt(req.query.limit) || 10; // Nombre d'éléments par page
    const branches = await paginate(db.collection('branch'), page, limit);
    res.json(branches);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des branches', error });
  }
});


// Route pour obtenir les informations de l'entreprise via scraping
app.get('/api/scrape/:companyNumber', async (req, res) => {
  const { companyNumber } = req.params;
  const formattedNumber = companyNumber.replace(/\./g, ''); // Supprimer les points dans le numéro d'entreprise

  const url = `https://www.companywebsite.com/${formattedNumber}`;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extrait les informations souhaitées à partir de la page
    const companyInfo = {
      name: $('h1.company-name').text(),
      address: $('p.company-address').text(),
      // Ajoutez ici d'autres informations à extraire
    };

    res.json(companyInfo);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du scraping des informations', error });
  }
});

// Récupérer une entreprise par EnterpriseNumber et ses branches et établissements associés
app.get('/api/enterprises/:number/details', async (req, res) => {
  try {
    const { number } = req.params;

    // Récupérer l'entreprise par EnterpriseNumber
    const enterprise = await db.collection('enterprise').findOne({
      EnterpriseNumber: number
    });

    if (!enterprise) {
      return res.status(404).json({ message: 'Entreprise non trouvée' });
    }

    // Récupérer les branches associées
    const branches = await db.collection('branch').find({
      EnterpriseNumber: enterprise.EnterpriseNumber
    }).toArray();

    // Récupérer les établissements associés
    const establishments = await db.collection('establishment').find({
      EnterpriseNumber: enterprise.EnterpriseNumber
    }).toArray();

    // Répondre avec les détails de l'entreprise, branches et établissements
    res.json({
      enterprise,
      branches,
      establishments
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des détails de l\'entreprise', error });
  }
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
