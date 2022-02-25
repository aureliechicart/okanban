# Okanban :clipboard:

## Introduction

This project has been developed for learning purposes.  
Kanban-style application where it is possible to create cards inside lists.
Single page application using vanilla Javascript only.

## Learning goals

### Analysis and design

- Establishing [user stories](doc/user_stories.md)
- Modeling the database and populating it : elaborating the [MCD](doc/okanban.svg), the [MLD](doc/tables.md), the [data definition file](doc/create_tables.sql) and the [seeding file](doc/seeding.sql)

### API creation

- Using a postgreSQL database, and Sequelize (ORM) to interact with it
- Declaring a Sequelize model for each table:
  - list
  - card
  - tag
  - card_has_tag
- Creating CRUD routes for each table (only Create/Delete for the junction table)

### JS script

#### Interactions using vanilla Javascript

- adding, editing and removing a list
- adding, editing and removing a card
- adding, associating, dissociating, editing and removing a tag 
- drag-and-drop lists
- drag-and-drop cards within a list and to another list

#### Front code organization

- Javascript front code reorganized in modules for clarity
- executing browserify to bundle up all our modules into one file served to the browser in a single `<script>` tag
- thanks to browserify we can use the require method and module.exports in frontend js code the same way we would use it in Node

#### Usage of browserify and watchify

To create the bundle in a dist folder, based on js modules:

```bash
npx browserify -e assets/js/app.js -o assets/dist/bundle.js
```

To be able to make changes in js modules and automatically recompile the bundle at each change, we use watchify:

```bash
npx watchify -e assets/js/app.js -o assets/dist/bundle.js
```

## Technologies

- Node v16.14.0
- Express v4.17.2
- postgreSQL 12 database server
- pg (PostgreSQL client) v8.7.1
- dotenv v14.2.0
- Bulma v0.9.3
- sequelize (ORM)
- SortableJS (reorderable drag-and-drop lists)
- santizer v6.13.0
- multer v1.4.4

Packages executed with npx (not installed locally):

- browserify (javascript bundling)
- watcherify

## Install

Clone this repository.

In the terminal, at the root of the folder project, run the following command to install the dependencies :

```bash
npm i
```

Create a local [PostgreSQL database](https://www.postgresql.org/docs/12/app-createdb.html):

```bash
createdb <database_name>
```

Run the following command to create the tables and import the data:

```bash
psql -d <database_name> -f /database/create_db.sql
```

### Setting Environment Variable
### Launch Command 

## Usage

Run the following command to start the server:

```bash
npm run dev
```

You will then be able to access it at localhost:5050.