
const TEXTS = {
  BUILD: 'Construction',
  APP_TITLE: 'L\'application',
  INSTALL: 'Installation',
  IMPORT_MYSQL: 'Import des données mysql',
  FOLDER_TITLES: 'Chemin vers les dossiers',
  PROJECT: {
    TITLE: 'Votre projet',
    QUESTION: 'Choissez votre type de projet',
    TYPES: ['Static', 'Wordpress']
  },
  ERROR: {
    PREFIX: 'You have break something idiot !',
    SELECT_SOMETHING: 'You need to select at least a builder AND a model',
    MODEL_EMPTY: 'No model imported !',
    NEED_THIS_QUESTION: 'This question is required !',
    INSTALL: 'Npm is required !',
    CONNECTION_FAILED: 'Echec de connexion à la base mysql',
    TOOL_NOT_FOUND: 'Tool doesn\'t exist'
  },
  SUCCESS: {
    FILES: 'Les fichiers ont bien été créés !',
    INSTALL: 'L\'installation a réussi !',
    CONNECTION_SUCCESS: 'Base de données connectée',
    FILE_OK: 'Fichier valide'
  }
};

module.exports = TEXTS;
