# Nodejs & Express - Disecting a Simple Server

In this article we're going to look at a simple server built in Node using Express.  This article does expect that you have some experience with JavaScript and coding in general. It does not assume you have any expereince with Node. You should be somewhat familiar with using command line tools.

All the code for this can be found [HERE](https://github.com/thinktt/expreasy) if you would like to skip ahead and jump straight into trying things out.  

Let's get started!

### Step 1 Install Nodejs
Depending on your system there are different ways to do it. Just go the [nodejs.org](https://nodejs.org/en/download/) and figure it out. When you have node installed come back here. 

### Step 2 Set up your directory structure
Make a project directory called "expreasy".  In expreasy add an empty file called "server.js" this is where we will code our Node server. Now add a subfolder in the project directory called "public". This directory will be used to serve our static content. Add an "index.html" file in the public folder. Open both server.js and index.html in your text editor. 

```
expreasy
│   server.js
└───public
    │   index.html
    └──
```

### Setp 3 Create a package.json file with NPM init
Nodejs comes with NPM (Node Package Manager). Node Package Manager, somewhat un-suprisingly will handle all your extra modules for node. NPM works as a command line tool. We can use it to initialize our project and create a "package.json" file. This file will keep track of all the dependencies for our project. From the expresasy directory in your termial type the following...

```
npm init
```
Follow the prompts from here to fill in your package.json file with content. For name put "expreasy" (or whatever you want to call your project) and in the description put something like "An easy Express app". You can change anything else you want or just press enter for the rest. 

If you look in the expreasy directory now you will see a new package.json file. Take a look at it to get a sense of how it's layed out. 

```
expreasy
│   server.js
│   package.json
└───public
    │   index.html
    └──
```

### Step 4 Install your dependencies
Now we will use npm to install the dependencies for our project. This is what the command looks like... 

```
npm install [package-to-intsall] --save
```

Note that --save will add the dependencies to your package.json file. Keep an eye on this file as you install depenencies to see how it keeps track of them. Now let's walk through the dependencies we're getting. The first thing we will install is [Express](http://expressjs.com/). Express the most popular framework for Nodejs. It's also very light and good way to start learning Node. 

Here's our command to install Express.

```
npm install express --save
```

After waiting a while you should see Express has been pulled down from the interwebs and installed, and you will see it's dependency tree. All this content will now be stored in a new directory **node_modules**. Nodes default is to keep all dependencies for each individual project in this directory at the root of the project. 

```
expreasy
│   server.js
│   package.json
├───public
│   │   index.html
│   └──
└───node_modules
    │   (lots_of_modules)
    └──
```

Note, if you're using git (and you should be) you want to avoid committing all these modules. Add "node_modules" to your .gitignore file. When you or someone else clones your repository you can then use **npm install** and npm will install all your dependencies stored in your pakcage.json file. But I digress... let's install our next package.


```
npm install morgan --save
```

[Morgan](https://github.com/expressjs/morgan) is middlewhere (a plugin) for Express. We will use it to log everything that comes into our server.

```
npm install body-parser --save
```

[body-parser](https://github.com/expressjs/body-parser) is also middleware fore express that is used to parse request that come into your server. Specifically we're going to use it to easily access JSON request.

### Step 5 Set up your static content
We are going to use the public folder we made to server static content, and it will work just like any other static web server. You can add any html content you want in index.html in the public folder. For that matter if you want to throw a whole static website in the public folder go for it.  To get you started though here's  some simple html content you can paste into your index.html file. 

```
<!DOCTYPE html>
<html>
<head>
  <title>Expreasy</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
</head>
<body>

  <div class="jumbotron">
    <div class="row">
      <div class="col-md-4 col-md-offset-4">
        <h1>Howdy Express!</h1>
      </div>
    </div>
  </div>

</body>
</html>
```

### Step 6 Enter your code
First let's just copy and paste the code for our entire server, all 34 lines, and then we'll walk through each part individually. 
```javascript
//...........Load modules used in the app.......
var express = require('express');//get the express framework
var app = express();// app becomes an instance of an express server
var morgan = require('morgan');//morgan is the express middleware logger
var bodyParser = require('body-parser');// for parsing JSON request

//..............Load Config Vars.................
var port = process.env.PORT || 3000;

//...........Load in middleware................
app.use(morgan('dev')); // log all request and errors 
app.use(bodyParser.json()); //pareses JSON reuest
app.use(express.static('public'));//serve static files

/............Set up Routes............
app.get('/greeting', function(req, res) {
 res.json({greeting: 'Howdy World!'});
});

app.post('/greeting', function(req, res) {
  var name = req.body.name;
  res.json({greeting: 'Howdy ' + name + '!' });
});

//.............Start the server............
app.listen(port, function(err) {
  if(err) {
    console.log('Unable to start server:');
    console.log(err);
  }
  else {
    console.log('Server listening on port ', port);
  }
});

```

Now let's look at each individual part.


#### Dependencies and require() 
```javascript
//...........Load modules used in the app.......
var express = require('express');//get the express framework
var app = express();// app becomes an instance of an express server
var morgan = require('morgan');//morgan is the express middleware logger
var bodyParser = require('body-parser');// for parsing JSON request 
```
Node pulls in it's dependencies using the ***require()*** functions. The dependencies are then set to variables. 

Note that ```app = express()``` is how you create an instance of an Express server. These first two lines could be condensed to ```var app = require('express')();``` although we actually use the express library explicitly later, so for our purposes it's good to have the two seperate variables. 

You should recognize the other dependencies we're pulling in here from earlier when we did ```npm install``` npm install pusts them in our project, while require actually pulls them into our specific JavaScript module, in this case our server.js.

#### Configuration Variables

```javascript
//..............Load Config Vars.................
var port = process.env.PORT || 3000;
```
This may be a bit strange if you're not used to javascript, but essentially what it does is check to see if ```process.env.port``` exist and if it doesn't then it defaults our port to 3000. The processs.env object is a global object in Node. It will load all environment variables. This is especially useful for keeping our configuration separate from our code, and will be helpful later when we move our application to Cloud Foundry. Right now there won't be any process.evn.PORT value so our app will default to 3000.  


#### Middleware
```javascript
//...........Load in middleware................
app.use(morgan('dev')); // log all request and errors 
app.use(bodyParser.json()); //pareses JSON resulst
app.use(express.static('public'));//serve static files
```
After installing our dependencies and requiring them, this is where we actually use them in our express application. ```app.use``` let's us load our middlewares into the express app. Note that the order you pass these is important. Every time a request comes into our server Express will pass it through our middleware according to how we've ordered things here. 

The morgan middleware as we mentioned earlier, will now start logging everything that comes into our server. 

The bodyParser.json middleware will parse all JSON request and make them usable in our routes. We will see how this works below. 

The express.static middelware (the only current built in middleware in Express) is taking the parameter "public". This is telling Express to serve all our static files from the public folder we created earlier. 


#### Routes

```javascript
/............Set up Routes............
app.get('/greeting', function(req, res) {
 res.json({greeting: 'Howdy World!'});
});

app.post('/greeting', function(req, res) {
  var name = req.body.name;
  res.json({greeting: 'Howdy ' + name + '!' });
});
```

This is where we set up our routes. This part may be a bit confusing if you're not used to looking at javaScript. These routes are using a typical callback style in JavaScript. The specification goes like this ```app.get(path, callback)``` The path is a string that specifies our route (in this case '/greeting') and the callback is a function that will be called when '/greeting' route is requested. This style is also confusing to beginners because it uses an ***anonymous function*** as it's second parameter. It's a very common style in JavaScript though, so you should try and get used to it. Still to make things a little more clear we could break these up, defining the function separately and then passing it to ```app.get()``` like so. 

```javascript
var getGreeting = function(req, res) {
  var name = req.body.name;
  res.json({greeting: 'Howdy ' + name + '!' });
}

app.get('/greeting', getGreeting);
````

Hopefully this helps you understand a bit better what we're doing. Intead of taking the time to define a variable and assign a function to it we're just directly invoking an anonymous function as one of our paramaters and writing the whole darn thing out. Welcome to JavaScript!


#### The Response and Request Objects
All the callbacks in our routes take two parameters, request, and response. Typical shorthand for these is "req" and "res". This is the bread and butter of Express. Express passes these two object through all our middleware and modifies them along the way.  

So in our case the request object has already passed through our body-parser middleware earlier, so when it arrives at our ***/greeting*** route if there was any json in our request it was parsed and added to req.body as an object we can now directly access. If we weren't using body-parse req would still contain our data but it wouldn't be as easy to get to. 

In our example we retrieve ```name``` from ```req.body.name```. We could just use req.body.name directly but defining a variable at the beginning of our callback and pulling values out of req.body is a good practice in that it makes it explicitly clear what values we are using in our callback. 

In the second line of our callback we actaully respond directly to the client that made the request with some JSON data. The response object can be modified by middlware in the same way as the request object, but Express also builds in a lot of handy function by default. res.json is one of these, and let's us respond to the client with JSON. 

#### Starting the server with app.listen()

```javascript
//.............Start the server............
app.listen(port, function(err) {
  if(err) {
    console.log('Unable to start server:');
    console.log(err);
  }
  else {
    console.log('Server listening on port ', port);
  }
});
```

This is it, the final code that starts up our app! You'll notice it uses the same callback style as our request. This particular callback has one parameter passed to it ```err``` if Express has an error starting up the server. We then have an if statement that checks to see if there was an error and if not responds that we're connected. 


### Step 7 Run it!
Now that we've gone through all this code let's run it and see how it works. Go to the root of your project and type...

```
node server
```

Now fire up your browser and go to localhost:3000. You should see the index.html file load up automatically. 

Now try localhost:3000/greeting. You should get back some JSON. 
```
{"greeting":"Howdy World!"}
```

Finally if you have a bash shell use the following command to send some JSON to our server. 
```
curl -H "Content-Type: application/json" -X POST -d '{"name": "Jimmy Bob"}' http://localhost:3000/greeting

```
You should get something with the following JSON included...
```
{"greeting":"Howdy Jimmy Bob!"}
```


#### Wrapping it all up
I hope this has helped you understand how nodejs and Express work. I realize it's a lot of information but hopefully it's split up in a way where you can get the knowledge you need and use it as a reference in the future.

Be sure to visist the [Express API Documentation](http://expressjs.com/en/api.html) to learn more.

***Happy Coding!***  
