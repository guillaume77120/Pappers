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
