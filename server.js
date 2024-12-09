const express = require('express');
const { readdirSync } = require('fs');
const path = require('path');
require('dotenv').config();
require('express-async-errors'); //no need any try catch for this package
const morgan = require('morgan');
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');


const app = express();
app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(xss());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({ crossOriginResourcePolicy: false }));


// Load all routes
const routesPath = path.resolve(__dirname, './routes');
readdirSync(routesPath).map((r) =>
  app.use('/api/v1', require(path.join(routesPath, r)))
);


/*
if someone want to use static files
app.use(express.json());
in the public folder we have index.html file or any other static file like css, js, images etc
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', express.static(path.join(__dirname, 'public')));
*/

// Default route
app.get('/', (req, res) => {
  res.send('server is running');
});



// Error handling
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// connect with server/database
const connectDB = require('./db/connect.js')
const envFile  = require('./config/index.js');
const start = async () => {
  try {
    await connectDB(envFile.data_base_url);
    app.listen(envFile.port, async() =>
      console.log(`Server is listening on port ${envFile.port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();


