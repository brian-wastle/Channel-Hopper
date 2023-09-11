    
# Channel Hopper

## Description
Channel Hopper is a user-friendly platform that allows members to join communities focused around their favorite TV shows. Using a public API, a member can search through a database of television programs and sign up to the community associated with any show that they choose. This website was built using Express.js packages to create the API routes and log user data once they sign in. Sequelize was used to connect to a mySQL database and retrieve stored member information, and Handlebars templating rendered it to the front-end.   


## Table of Contents
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Contributions](#contributions)
- [Tests](#tests)
- [Links](#Links)
    
## Installation
If you wish to contribute to this application, the following frameworks/npm packages will be required:

- Node.js - To download the latest version of npm, on the command line, run the following command: 
"npm install -g npm". Once installed, the questionnaire can be run by typing "node index.mjs" in the terminal. 

- Express.js - Create a package.json first with the npm init command. Installation is done using the npm install command: $ npm install express

- Sequelize: npm install --save sequelize

    - You'll also have to manually install the driver for your database of choice:

    - One of the following:
       - npm install --save pg pg-hstore # Postgres
       - npm install --save mysql2
       - npm install --save mariadb
       - npm install --save sqlite3
       - npm install --save tedious # Microsoft SQL Server
       - npm install --save oracledb # Oracle Database


- Handlebars: The reference implementation of Handlebars is written in JavaScript. It is most commonly installed using npm or yarn:
    - npm install handlebars
    - yard add handlebars

- Dayjs: To get started with Day.js in your Node.js project, simply add the dependency with NPM.
    - npm install dayjs





## Usage
By visiting the website and selecting the "sign-up" option you will be immediately directed to your profile page. Navigating the database of thousands of television programs is easy: You simply search for a show, click 'join this community', and you can immediately start posting reviews and participate in discussion threads. The show that you selected will be added to the 'My Communities' section of your profile.

## Contributions
This project was researched and developed by Brian Wastle, Daniel MacDonald, and Phil Bryer. Additional assistance was provided by Dane Edwards (Instructor), and Andrew Layendecker (TA). 

## Tests
This application was tested during it's development using Insomnia to confirm accurate API routing, and a web browser to ensure functionality. 

## Links
Please visit the repository:

[Github Repo](https://github.com/brian-wastle/Group-Project-2)

[E-Heroku Link](https://guarded-crag-94657-216a181d9ea0.herokuapp.com/)

 