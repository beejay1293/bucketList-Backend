# bucketList-Backend
A web app that helps user to keep track of their dreams, aspirations and long life desires.


## Features

- User can sign up
- User can sign in
- User can sign out
- Authenticated Users can **Create a new bucket list**
- Authenticated Users can **fetch List of all the created bucket lists**
- Authenticated Users can **Get single bucket list**
- Authenticated Users can **Update this bucket list**
- Authenticated Users can **Delete this single bucket list**
- Authenticated Users can **Create a new item in bucket list**
- Authenticated Users can **Get a list of all the created items in a bucket list**
- Authenticated Users can **Get a single item in a bucket list**
- Authenticated Users can **Update a bucket list item**
- Authenticated Users can **Delete an item in a bucket list**
- Authenticated Users can **can search for a bucket list by name**

## Technologies

- Node JS
- Express
- ESLint
- Babel

## Requirements and Installation

To install and run this project you would need to have listed stack installed:

- Node Js
- Git

To run:

```sh
git clone <https://github.com/beejay1293/bucketList-Backend.git>
cd bucketList-Backend
npm install
npm start
```

## API-ENDPOINTS

- V1

`- POST /api/v1/auth/signup Create a new user record.`

`- POST /api/v1/auth/login login a user.`

`- GET /api/v1/auth/logout logut a user.`

`- POST /api/v1/bucketlists Create a new bucket list.`

`- GET /api/v1/bucketlists List all the created bucket lists.`

`- GET /api/v1/bucketlists?q=name Search for a bucketlist by names.`

`- GET /api/v1/bucketlists/:bucketId Get single bucket list.`

`- PUT /api/v1/bucketlists/:bucketId Update this bucket list.`

`- DELETE /api/v1/bucketlists/:bucketId Delete this single bucket list.`

`- POST /api/v1/bucketlists/:bucketId/items Create a new item in bucket list.`

`- GET /api/v1/bucketlists/:bucketId/items List all the created items in a bucket list.`

`- GET /api/v1/bucketlists/:bucketId/items/:itemId Get a single item in a bucket list.`

`- PUT /api/v1/bucketlists/:bucketId/items/:itemId Update a bucket list item.`

`- DELETE /api/v1/bucketlists/:bucketId/items/:itemId Delete an item in a bucket list.`



## API

The API is currently in version 1 (v1) and is hosted at

[https://bucketlists-app.herokuapp.com/](https://bucketlists-app.herokuapp.com/)

## API Documentation

[https://bucketlists-app.herokuapp.com/](https://bucketlists-app.herokuapp.com/api-docs/)

## Author

Matti Mobolaji Usman


