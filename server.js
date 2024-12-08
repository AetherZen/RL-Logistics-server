const { readdirSync } = require("fs");
const path = require("path");
require('dotenv').config();
require('express-async-errors'); //no need any try catch for this package
const express = require('express');
const app = express();
const morgan = require('morgan');

// extra security packages
const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

app.set('trust proxy', 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  })
);
app.use(express.json());
app.use(morgan("dev"))
app.use(cors());
app.use(xss());
app.use(express.urlencoded({ extended: false }));
app.use(helmet({crossOriginResourcePolicy: false}))

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// routes middleware
const routesPath = path.resolve(__dirname, './routes');
readdirSync(routesPath).map((r) =>
  app.use("/api/v1", require(path.join(routesPath, r)))
);

// if someone want to use static files
// app.use(express.json());
//in the public folder we have index.html file or any other static file like css, js, images etc
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', express.static(path.join(__dirname, 'public')));

// routes
app.get('/', (req, res) => {
  res.send('server is running');
});

//db connection
const connectDB = require('./db/connect');


//if no route found
app.use(notFoundMiddleware);
//if error found custom error handler
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
