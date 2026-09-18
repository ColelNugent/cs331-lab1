## Password Authentication Lab Project
Provided is the source code to a simple web application that has full user signup and login functionality. Features include registeration for an account using a username, password, and two security questions, logging into a registered account using username and password, and resetting a forgotten password using security questions. There is also a welcome page for if you login successfully.

## How To Use
Step 1: Install and Check version of NodeJS and NPM  
$ node --version [should be v22 or higher]  
npm --version

Step 2: Install dependencies and start the server  
$ npm ci  
npm start

This will start a server on localhost:3310 in your web browser.

Step 3: Explore website
If you want to stop the server press (control + c)

## Optional Notes
The database is persistant in this project meaning that if you create an account  
which gets stored in the database, then stop the server and start it up again,  
the previous account will still exist. I have built a custom tool to wipe the database  
in the case that you want to wipe the accounts that exist.
: $ npm run clear-db