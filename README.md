[![npm version](https://badge.fury.io/js/%40superdev-official%2Fradish.svg)](https://badge.fury.io/js/%40superdev-official%2Fradish)

# @superdev-official/radish


> Global tool for generate starter structure (like Wordpress theme or static website)

## Installation

```
$ npm i -g @superdev-official/radish
```

## Available commands

Build a starter : 
```
$ radish init [static|wordpress|null]
```
Watch your assets :
```
$ radish watch
  -s, --sass (for SASS assets)
  -j, --js (for JavaScript assets)
  (by default, watch all your assets)
```
Import an sql file to a MySql database :
```
$ radish mysql-import
```
To get more informations :
```
$ radish --help 
```

## Fill the mysql database

1. Create a database (from phpmyadmin ou mysql).
2. Prepare/export a file to init the database with queries.
3. Run radish mysql-import

## License

Copyright (c) 2020

Licensed under the [MIT license](LICENSE).
