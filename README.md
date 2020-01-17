this is the backoffice tool of an association to manage their events, bookings and users.You can find at the end of this read.me the script to implement a booking module to your existing website.

# Database installation

## Connect to mysql in your terminal.

## Copy paste the script from **install.sql** 

In order to create the database and the first administrator account (If you want to use another user than root or another name for your database, you must change those in **api/conf.js** file)

## Launch your database with node
In your terminal, go to /api folder and enter command line :
```
node index.js
```

# Frontend installation
clone the current repository in your terminal and install all the dependencies:
```
git clone https://github.com/MS44118/PROJET_3_cocotte-solidaire.git

cd /PROJET_3_cocotte-solidaire

npm install
```

## Create the RSA keys files

generate your RSA keys and copy them on the following files (if you wish, you can use this site:  [http://travistidwell.com/jsencrypt/demo/](http://travistidwell.com/jsencrypt/demo/))

api/.private.key

api/.public.key


## Copy the following files with your own values
 
api/.password.example.js ---> api/.password.js 

api/.emailAuth.example.js ---> api/.emailAuth.js


## Launch your backoffice website

On another terminal, go to the root of the project and enter command line :
```
npm start
```

Your admin page is ready to use on [http://localhost:3000/](http://localhost:3000/)! with the email 'admin@gmail.com' as your login and 'admin' as password.

To create another adminitrator account : [http://localhost:3000/signup](http://localhost:3000/signup) (You'll probably need to allow a less secured acces to your mailing app to receive correctly the validation email, depending on which mail app you're using. More on the subject here: [https://myaccount.google.com/u/0/lesssecureapps](https://myaccount.google.com/u/0/lesssecureapps) 
)

# Install Script to add booking module on an existing website : 

Go to folder /client and run command line : 
```
npm run create
```

It will create a /client/dist folder with an index_bundle.js file.


You can call this script in any HTML page by inserting this piece of code :
  ```
  <div id="app" type="1"></div>
  ```

Type 1 => activity : manger<br>
Type 2 => activity : cuisiner & manger<br>
Type 3 => others activities. <br>

You will now see on your HTML page a calendar with all activities and the possibility to book places !!
