import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import users from './routes/api/user';
import bucketList from './routes/api/BucketList';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.use(morgan('combined'));

app.use(
    cors({
      origin: '*',
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  );

  app.all('/*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    next();
  });

  app.use(cors());

  app.get('/', (req, res) => res.status(200).json({
   status: 200,
   data: [
       {
          message: 'welcome to BucketList app'
       }
   ]
 
  }))

  //user routes
  app.use('/api/v1/auth', users);

  // Bucketlist routes
//   app.use('/api/v1/bucketList', bucketList);

  app.all('*', (req, res) => res.status(404).json({
      status: 404,
      error: 'route does not exist'
  }))

  const port = process.env.PORT || 5000

  app.listen(port)

  export default app;