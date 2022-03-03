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

app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/post'));
app.use('/api/auth', require('./routes/api/auth'));

//port to listen the server --
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
