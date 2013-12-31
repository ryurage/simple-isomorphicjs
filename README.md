Isomorphic JS site
===================

## Overview

This is: 

A website with a front-facing client side, as well as a control panel for managing the site’s content using an MVC architecture.

Per the usual, this sits on top of a basic [Express](https://github.com/visionmedia/express) app.

## Getting it running

### Install Node.js >= 0.8.x

If Node.js versino 0.8.x (preferably 0.10.x) is not already installed on your system, install it so you can run this app.

#### Check if it's installed

The command `which node` will return a path to your installed version of Node.js, if it exists on your system.

    $ which node
    /usr/local/bin/node

If it is installed, make sure it's at least version 0.8.x, and preferably 0.10.x.

    $ node --version
    v0.10.21

#### To install

##### Mac

Preferably install using Homebrew:

    $ brew install node

##### Else

Otherwise, go to the [nodejs.org](http://nodejs.org/) and download the binary to install on your system.


### Clone this repo onto your machine

    $ cd ~/my_sites
    $ git clone git@github.com:ryurage/simple-isomorphicjs.git
    $ cd simple-isomorphicjs/app

### Run `npm install` to install dependenices

	$ npm install
	npm http GET https://registry.npmjs.org/handlebars
    ...

### Run that app!

Get the database up and running by running the mongodb daemon

We'll use three different environments:

    * local
    * staging
    * production

Run one of the environments with:

    $ node app.js staging

Will produce: 
    
    Express server listening on port 4000

You can view it in your web browser at `http://localhost:3000/`

You can view the admin by opening http://localhost:3000/admin (for the control panel)

## License

MIT
