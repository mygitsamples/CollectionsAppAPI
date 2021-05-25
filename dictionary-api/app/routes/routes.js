
const userRoutes = require('./dictionary');

const appRouter = (app, fs) => {

  app.get('/', (req, res) => {
    res.send('welcome to the dictionary api-server');
  });

  userRoutes(app, fs);
};

module.exports = appRouter;