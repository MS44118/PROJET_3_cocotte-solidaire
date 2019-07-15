Clone the project.
Install all dependencies.
### `npm install`

Add files : 
  - file name : api/.password.js , structre => 
const myPassword = 'passwordSQL'
module.exports = myPassword;

  - file name : api/.private.key and api/.public.key which contain RSA keys (you can make them on http://travistidwell.com/jsencrypt/demo/ , juste copy/paste lines) 
  - file name : api/.emailAuth.js, structure =>
const emailAuth = {
  user: 'yourmail@gmail.com',
  pass: 'password'
}
module.exports = emailAuth;
(Note: you need to allow less secure app acces on https://myaccount.google.com/u/0/lesssecureapps)

Use the install.sql script to create the database.<br>
If you want to use another user than root, and another name of database than 'cocotte_booking' you need to change the configuration file api/conf.js and modify the CREATE DATABASE at the beginning of the install.sql file.

Create the first admin in SQL with email 'admin@gmail.com' and password 'admin': <br>
  - open mysql and enter this query : 
INSERT INTO admins (email, password, name) VALUES ('admin@gmail.com', '$2a$10$frAzPBXeg.av/yvgBfRvyeMuS1MTwHvb2kF3oii.vtxA7A.ZKdQTu', 'admin');

Build the application : <br>
Go to the root of the project and use:
### `npm run build`
It will create a build folder. <br>
Move all build files at the root of the project. <br>

Go into api folder and enter command line :
### `nohup node index.js`
(nohup is used to run the application server even when you quit the server. You can also use pm2 package : https://www.npmjs.com/package/pm2)
Go to the root of the project and enter command line :
### `npm start`

Your admin page is ready to use !!!

Create script for reseration on public site : 

Go to folder /client and run command line : 
### `npm run create`

It will create a /client/dist folder with an index_bundle.js file.
You can call this script in your html page with a div : <div id="app" type="1"></div>
Type 1 => activity : manger
Type 2 => activity : cuisiner & manger
Type 3 => others activities. 