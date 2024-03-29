const express = require("express");
const cors = require("cors");
const scheduler = require("node-schedule");
scheduledTask = require("./src/app/shared/model/libraryTask.model");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json({ limit: '10mb' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.get('/alive', (req, res) => {
  res.send(new Date().toISOString());
});

// set routes
const routesBook = require("./src/app/shared/routes/book.routes");
const routesUser = require("./src/app/shared/routes/user.routes");
const routesNotification = require("./src/app/shared/routes/notification.routes");
const routesBackup = require("./src/app/shared/routes/backup.routes");

app.use('/api/library', routesBook);
app.use('/api/library', routesUser);
app.use('/api/library', routesNotification);
app.use('/api/library', routesBackup);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
})

scheduler.scheduleJob('1 0 * * *', async () => {
  try {
    await scheduledTask.checkAndReturnOverdueBooks();
  } catch (error) {
    console.error('Error executing daily task:', error);
  }
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db = require("./src/app/shared/model");
db.mongoose
  .connect(db.url)
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });
