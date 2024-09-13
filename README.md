# Guide de déploiement

## Traitement des données

1. **Insertion des fichiers JSON** :  
   Insérer les fichiers JSON dans le dossier `json_à_insérer_mongo`.

2. **Création d'index MongoDB** :  
   Ajouter des index sur les champs suivants dans la collection `Enterprise` : 
   - `EnterpriseNumber`
   - `Denomination`
   - `StreetFr`

   D'autres index peuvent être ajoutés si nécessaire.

---

## Frontend

1. **Installation des dépendances** :  
   Exécutez la commande suivante pour installer les dépendances du projet :
   ```bash
   npm install
2. **Démarrage de l'application** :
   Pour lancer l'application front, exécutez :
   ```bash
   npm run start
3. **Changer l'URL de l'API** :
   Pour modifier l'URL de l'API utilisée par l'application sur l'ensemble du projet, mettez à jour le fichier apiUrl.js.
   
## Backend

1. **Installation des dépendances** :
   Installez les dépendances backend avec la commande :
   ```bash
   npm install

2. **Démarrage du serveur backend** :
   Utilisez Nodemon pour lancer le serveur en mode développement :
   ```bash
   npx nodemon index.js
