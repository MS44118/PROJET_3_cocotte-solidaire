Clone the project.
Install all dependencies.
### `npm install`

Add files : 
  - file name : api/.password.js 
  structre : <br>
const myPassword = 'passwordSQL'
module.exports = myPassword;

  - file name : api/.private.key 
  - file name : api/.public.key
  These files contain RSA keys (you can make them on [http://travistidwell.com/jsencrypt/demo/](http://travistidwell.com/jsencrypt/demo/) , juste copy/paste lines)   
  - file name : api/.emailAuth.js
  structure :<br>
const emailAuth = {
  user: 'yourmail@gmail.com',
  pass: 'password'
}
module.exports = emailAuth;

(Note: you need to allow less secure app acces on [https://myaccount.google.com/u/0/lesssecureapps](https://myaccount.google.com/u/0/lesssecureapps))

Use the install.sql script to create the database and the first administrator account.<br>
If you want to use another user than root, and another name of database than 'cocotte_booking' you need to change the configuration file api/conf.js and modify the CREATE DATABASE at the beginning of the install.sql file.

Build the application : <br>
Go to the root of the project and use:
### `npm run build`
It will create a build folder. <br>
Move all build files at the root of the project. <br>

Go into api folder and enter command line :
### `node index.js`

On another terminal window, go to the root of the project and enter command line :
### `npm start`

Your admin page is ready to use !!!
Use 'adming@gmail.com' email and 'admin' as password.
If you go to the url : [http://localhost:3000/signup](http://localhost:3000/signup) , you can add another adminitrator account.

---
###Create script for reseration on public site : 

Go to folder /client and run command line : 
### `npm run create`

It will create a /client/dist folder with an index_bundle.js file.
You can call this script in any HTML page with a div :
<code> 
  <div id="app" type="1"></div>
</code>
Type 1 => activity : manger
Type 2 => activity : cuisiner & manger
Type 3 => others activities. 

You will now see on your HTML page a calendar with all activities and the possibility to reserve places !!