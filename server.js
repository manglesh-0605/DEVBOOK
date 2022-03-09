const express = require('express');
const app = express();

//the db connection using mongoose--
const connectDB = require('./config/db');

//connecting to db-
connectDB();

//initializing middleware--
app.use(express.json({extended:false}));

app.get('/', (req, res) => {
  res.send('API RUNNING');
});

//DEFINE ROUTES__

app.use('/api/register', require('./routes/api/register'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));
app.use('/api/login', require('./routes/api/login'));
app.use('/api/user', require('./routes/api/user'));

//port to listen the server --
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
