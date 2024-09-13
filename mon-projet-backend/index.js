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
const paginate = async (collection, page, limit) => {
  const skip = (page - 1) * limit;
  return collection.find().skip(skip).limit(limit).toArray();
};

// Récupérer toutes les entreprises avec pagination
app.get('/api/enterprises', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Page courante
    const limit = parseInt(req.query.limit) || 50; // Nombre d'éléments par page
    const enterprises = await paginate(db.collection('enterprise'), page, limit);
    res.json(enterprises);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des entreprises', error });
  }
});

// Ajouter une entreprise
app.post('/api/enterprises', async (req, res) => {
  try {
    const result = await db.collection('enterprise').insertOne(req.body);
    res.json({ message: 'Entreprise ajoutée avec succès', result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'entreprise', error });
  }
});

// Mettre à jour une entreprise
app.put('/api/enterprises/:id', async (req, res) => {
  try {
    const result = await db.collection('enterprise').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ message: 'Entreprise mise à jour avec succès', result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'entreprise', error });
  }
});

// Supprimer une entreprise
app.delete('/api/enterprises/:id', async (req, res) => {
  try {
    const result = await db.collection('enterprise').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Entreprise supprimée avec succès', result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'entreprise', error });
  }
});

// Rechercher une entreprise par EnterpriseNumber
app.get('/api/enterprises/by-enterprise-number/:number', async (req, res) => {
  try {
    const enterprise = await db.collection('enterprise').findOne({ EnterpriseNumber: req.params.number });
    if (enterprise) {
      res.json(enterprise);
    } else {
      res.status(404).json({ message: 'Entreprise non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche par EnterpriseNumber', error });
  }
});

// Rechercher une entreprise par Dénomination
app.get('/api/enterprises/by-denomination/:denomination', async (req, res) => {
  try {
    const enterprises = await db.collection('enterprise').find({ Denomination: req.params.denomination }).toArray();
    if (enterprises.length > 0) {
      res.json(enterprises);
    } else {
      res.status(404).json({ message: 'Aucune entreprise trouvée avec cette dénomination' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche par Dénomination', error });
  }
});

// Rechercher une entreprise par StreetFR
app.get('/api/enterprises/by-streetfr/:street', async (req, res) => {
  try {
    const enterprises = await db.collection('enterprise').find({ StreetFR: req.params.street }).toArray();
    if (enterprises.length > 0) {
      res.json(enterprises);
    } else {
      res.status(404).json({ message: 'Aucune entreprise trouvée avec cette rue' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la recherche par StreetFR', error });
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

// Ajouter un établissement
app.post('/api/establishments', async (req, res) => {
  try {
    const result = await db.collection('establishment').insertOne(req.body);
    res.json({ message: 'Établissement ajouté avec succès', result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'établissement', error });
  }
});

// Mettre à jour un établissement
app.put('/api/establishments/:id', async (req, res) => {
  try {
    const result = await db.collection('establishment').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ message: 'Établissement mis à jour avec succès', result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'établissement', error });
  }
});

// Supprimer un établissement
app.delete('/api/establishments/:id', async (req, res) => {
  try {
    const result = await db.collection('establishment').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Établissement supprimé avec succès', result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'établissement', error });
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

// Ajouter une branche
app.post('/api/branches', async (req, res) => {
  try {
    const result = await db.collection('branch').insertOne(req.body);
    res.json({ message: 'Branche ajoutée avec succès', result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la branche', error });
  }
});

// Mettre à jour une branche
app.put('/api/branches/:id', async (req, res) => {
  try {
    const result = await db.collection('branch').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: req.body }
    );
    res.json({ message: 'Branche mise à jour avec succès', result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la branche', error });
  }
});

// Supprimer une branche
app.delete('/api/branches/:id', async (req, res) => {
  try {
    const result = await db.collection('branch').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: 'Branche supprimée avec succès', result });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la branche', error });
  }
});

// Route pour obtenir les informations de l'entreprise via scraping
app.get('/api/scrape/:companyNumber', async (req, res) => {
    const { companyNumber } = req.params;
    const formattedNumber = companyNumber.replace(/\./g, ''); // Supprimer les points dans le numéro
    const url = `https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?lang=fr&nummer=${formattedNumber}`;

    try {
        // Récupérer le contenu de la page
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        // Extraire les informations (adapter le sélecteur selon la structure HTML de la page)
        const companyInfo = $('div.some-class-name').text().trim(); // Remplace 'div.some-class-name' par le sélecteur approprié

        // Envoyer les informations en réponse
        res.json({ companyNumber, companyInfo });
    } catch (error) {
        console.error(`Erreur lors du scraping pour ${companyNumber}:`, error.message);
        res.status(500).json({ error: `Erreur lors du scraping pour ${companyNumber}` });
    }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
