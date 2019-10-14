Clone the project.
Install all dependencies.
### `npm install`

Add files : 
  - file name : api/.password.js 
  structre : <br>
const myPassword = 'passwordSQL'<br>
module.exports = myPassword;

  - file name : api/.private.key 
  - file name : api/.public.key<br>
  These files contain RSA keys (you can make them on [http://travistidwell.com/jsencrypt/demo/](http://travistidwell.com/jsencrypt/demo/) , juste copy/paste lines)   
  - file name : api/.emailAuth.js<br>
  structure :<br>
const emailAuth = {<br>
  user: 'yourmail@gmail.com',<br>
  pass: 'password'<br>
}<br>
module.exports = emailAuth;<br>

(Note: you need to allow less secure app acces on [https://myaccount.google.com/u/0/lesssecureapps](https://myaccount.google.com/u/0/lesssecureapps))

Use the install.sql script to create the database and the first administrator account.<br>
Before to run the script, you have to create the database and change its name in the file api/conf.js.
If you want to use another user than root, you must change this api/conf.js file too on the user parameter. 

Go into api folder and enter command line :
### `node index.js`

On another terminal window, go to the root of the project and enter command line :
### `npm start`

Your admin page is ready to use on [http://localhost:3000/](http://localhost:3000/)!!!<br>
Use 'adming@gmail.com' email and 'admin' as password.<br>
If you go to the url : [http://localhost:3000/signup](http://localhost:3000/signup) , you can add another adminitrator account.

---
### Create script for reservation on public site : 

Go to folder /client and run command line : 
### `npm run create`

It will create a /client/dist folder with an index_bundle.js file.<br>
You can call this script in any HTML page with a div :
  `<div id="app" type="1"></div>`<br>
Type 1 => activity : manger<br>
Type 2 => activity : cuisiner & manger<br>
Type 3 => others activities. <br>

You will now see on your HTML page a calendar with all activities and the possibility to reserve places !!
