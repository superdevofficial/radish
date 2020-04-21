"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TEXTS = {
    EN: {
        BUILD: 'Build',
        APP_TITLE: 'Application',
        INSTALL: 'Install',
        IMPORT_MYSQL: 'MySql import',
        FOLDER_TITLES: 'Folders path',
        PROJECT: {
            TITLE: 'Your project',
            QUESTION: 'Choose your project type',
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
            FILES: 'Files was successfully created !',
            INSTALL: 'Successful installation',
            CONNECTION_SUCCESS: 'Connected database',
            FILE_OK: 'Valid file'
        },
        STATIC: {
            TITLE: 'Static project configuration',
            MORE: 'Use default settings ?',
            INPUT_FILE: 'Bootstrap file path',
            APP_NAME: 'Application / site / unicorn name',
            DESCRIPTION: 'Describe your project',
            OUTPUT: 'Path of the folder where to generate all the minified files',
            INPUT: 'Path to the folder where the source files are located',
            BDD_HOST: 'BDD server address',
            BDD_PORT: 'Port number',
            DATABASE: 'Name of the data base',
            BDD_USER: 'User',
            BDD_PASSWORD: 'Password',
            MYSQL_FILE_PATH: 'Path of the file to import',
            RUN_SEARCH_AND_REPLACE: 'Perform a search / replace before import ?',
            SEARCH_STR: 'Searched chain',
            REPLACE_STR: 'New value',
            MAIN_PATH: 'Main path configuration',
            SASS_PATH: 'SASS configuration',
            SASS_FILE: 'Name of the input file for SASS',
            JS_PATH: 'JS configuration',
            JS_FILE: 'Input file name for JavaScript',
        },
        WP: {
            TITLE: 'Configuration thème Wordpress',
            APP_TITLE: 'Le thème',
            MORE: 'Use default settings ?',
            INPUT_FILE: 'Nom du fichier bootstrap',
            APP_NAME: 'Nom de votre thème',
            DESCRIPTION: 'Description de votre thème',
            OUTPUT: 'Path of the folder where to generate all the minified files',
            INPUT: 'Path to the folder where the source files are located',
            BDD_HOST: 'BDD server address',
            BDD_PORT: 'Port number',
            DATABASE: 'Name of the data base',
            BDD_USER: 'User',
            BDD_PASSWORD: 'Password',
            MYSQL_FILE_PATH: 'Path of the file to import',
            RUN_SEARCH_AND_REPLACE: 'Perform a search / replace before import ?',
            SEARCH_STR: 'Searched chain',
            REPLACE_STR: 'New value',
        },
        MYSQL: {
            BDD_HOST: 'BDD server address',
            BDD_PORT: 'Port number',
            DATABASE: 'Name of the data base',
            BDD_USER: 'User',
            BDD_PASSWORD: 'Password',
            MYSQL_FILE_PATH: 'Path of the file to import',
            RUN_SEARCH_AND_REPLACE: 'Perform a search / replace before import ?',
            SEARCH_STR: 'Searched chain',
            REPLACE_STR: 'New value',
        },
        DOCKER: {
            ACTION_UNDEFINED: 'This action does not exist!',
            DOCKER_COMPOSE_MISSING: 'The "docker-compose" package is not installed!',
            DOCKER_FILE_MISSING: 'The file "docker-compose.yml" was not found!'
        }
    },
    FR: {
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
        },
        STATIC: {
            TITLE: 'Configuration projet static',
            MORE: 'Utiliser les paramètres par défaut ?',
            INPUT_FILE: 'Chemin du fichier bootstrap',
            APP_NAME: 'Nom de l\'application/site/licorne',
            DESCRIPTION: 'Description de votre projet',
            OUTPUT: 'Chemin du dossier où générer tous les fichiers minifiés',
            INPUT: 'Chemin du dossier où se trouve les fichiers sources',
            BDD_HOST: 'Adresse du serveur BDD',
            BDD_PORT: 'Numéro de port',
            DATABASE: 'Nom de la base de données',
            BDD_USER: 'Utilisateur',
            BDD_PASSWORD: 'Mot de passe',
            MYSQL_FILE_PATH: 'Chemin du fichier à importer',
            RUN_SEARCH_AND_REPLACE: 'Exécuter un rechercher/remplacer avant l\'import ?',
            SEARCH_STR: 'Chaine recherchée',
            REPLACE_STR: 'Nouvelle valeur',
            MAIN_PATH: 'Configuration chemins principaux',
            SASS_PATH: 'Configuration SASS',
            SASS_FILE: 'Nom du fichier d\'entrée pour le SASS',
            JS_PATH: 'Configuration JS',
            JS_FILE: 'Nom du fichier d\'entrée pour le JavaScript',
        },
        WP: {
            TITLE: 'Wordpress configuration',
            APP_TITLE: 'The theme',
            MORE: 'Use default settings ?',
            INPUT_FILE: 'Nom du fichier bootstrap',
            APP_NAME: 'Nom de votre thème',
            DESCRIPTION: 'Description de votre thème',
            OUTPUT: 'Chemin du dossier où générer tous les fichiers minifiés',
            INPUT: 'Chemin du dossier où se trouve les fichiers sources',
            BDD_HOST: 'Adresse du serveur BDD',
            BDD_PORT: 'Numéro de port',
            DATABASE: 'Nom de la base de données',
            BDD_USER: 'Utilisateur',
            BDD_PASSWORD: 'Mot de passe',
            MYSQL_FILE_PATH: 'Chemin du fichier à importer',
            RUN_SEARCH_AND_REPLACE: 'Exécuter un rechercher/remplacer avant l\'import ?',
            SEARCH_STR: 'Chaine recherchée',
            REPLACE_STR: 'Nouvelle valeur',
        },
        MYSQL: {
            BDD_HOST: 'Adresse du serveur BDD',
            BDD_PORT: 'Numéro de port',
            DATABASE: 'Nom de la base de données',
            BDD_USER: 'Utilisateur',
            BDD_PASSWORD: 'Mot de passe',
            MYSQL_FILE_PATH: 'Path of the file to import',
            RUN_SEARCH_AND_REPLACE: 'Exécuter un rechercher/remplacer avant l\'import ?',
            SEARCH_STR: 'Chaine recherchée',
            REPLACE_STR: 'Nouvelle valeur',
        },
        DOCKER: {
            ACTION_UNDEFINED: 'Cette action n\'existe pas !',
            DOCKER_COMPOSE_MISSING: 'Le package "docker-compose" n\'est pas installé !',
            DOCKER_FILE_MISSING: 'Le fichier "docker-compose.yml" est introuvable !'
        }
    }
};
class Translator {
    constructor(local = 'EN') {
        this.local = 'EN';
        this.local = local;
        Translator.current = this;
    }
    static initiliaze(local = 'EN') {
        return new Translator(local);
    }
    get TEXTS() {
        return TEXTS[this.local];
    }
    changeLocality(local = 'EN') {
        this.local = local;
    }
}
exports.default = Translator;
//# sourceMappingURL=texts.js.map