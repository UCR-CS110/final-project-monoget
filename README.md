# CS110 Project MonoGet - pivoted to Alternative Final Project

## Table of Contents
- [Overview](#overview)
- [Team](#team)
- [Usage](#usage)
- [How To Run](#how-to-run)
- [Issues We Ran Into](#issues-we-ran-into)


## Overview
The alternate project we choice is an extension of Lab 6. Lab 6 was a basic chatroom webapp that had multiple rooms and users. Our alternate final project consists of building a log in and register system, and a profile system on top of the already existing lab 6. This allows users to log in to their accounts and chat with other registered users on the platform. All of this is done over react and handlebars for frontend, express js for backend, bootstrap for styling and mongoDB for storage of data. 

## Team
<a href="https://github.com/MachineLearningAmateur" target="_blank"><img src="https://avatars3.githubusercontent.com/u/50182455?s=400&v=4" align="left" height="30px">James Zhang </a>

<a href="https://github.com/jason99chang" target="_blank"><img src="https://avatars3.githubusercontent.com/u/46538983?s=400&v=4" align="left" height="30px">Jason Chang </a>

<a href="https://github.com/caKuma" target="_blank"><img src="https://avatars3.githubusercontent.com/u/19195878?s=400&v=4" align="left" height="30px">Yishao Wang </a>

## Usage
Demo: <a href="https://flipgrid.com/af083092"><b>This Video</b></a>

<Screenshot of application>

## How To Run
In the project directory, you can run:
>npm install\
>nodemon server.js

open http://localhost:8080
  
## Issues We Ran Into
  - Routing profile for specific users\
    This was a challenging problem, but we managed to resolve this by adding a boolean called view that keeps track of which fetch we called to route to the profile 
    page via the profile handler in server.js (this was the extra feature for our project)
  - Parsing and passing json objects\
    This took a while for us to understand because we had to manipulate json objects in some of our api calls and had to return it via the response as a json object.
    It took a while for us to understand that we need to call json on the returned response object in order to parse the body of the json. After understanding the 
    problem we were able to successfully pass in 
  - Editing messages\
    This problem was also challenging but we managed to resolve it by storing the message id of the comment in the name tag of the element to be retrieved by our           script function. 
  - Updating and Extracting Info from MongoDB\
    This took a while to understand as well because we had to look up MongoDB documentation in order to utilize their functions and understand what arguments we need       to pass in. 
