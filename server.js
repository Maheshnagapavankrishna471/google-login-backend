// const express = require('express')
// const cors = require('cors')
// require('./db/conn')


// const authRoutes = require('./routes/user')

// const app = express()
// app.use(cors())
// app.use(express.json())
// app.use(authRoutes)


// app.listen(5000,()=>{
//     console.log('server running on port 5000')
// })

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// });

// const db = mongoose.connection;

// db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// db.once('open', () => console.log('Connected to MongoDB'));

// // Define a user schema
// const userSchema = new mongoose.Schema({
//   googleId: String,
//   name: String,
//   email: String,
//   picture: String,
// });

// // Create a user model
// const UserModel = mongoose.model('User', userSchema);

// // Routes
// app.post('/api/users', async (req, res) => {
//   const { googleId, name, email, picture } = req.body;

//   try {
//     const user = await UserModel.findOne({ googleId });

//     if (!user) {
//       const newUser = new UserModel({ googleId, name, email, picture });
//       await newUser.save();
//       res.status(201).json(newUser);
//     } else {
//       res.status(200).json(user);
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors('*'));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => console.log('Connected to MongoDB'));

// Define a user schema
const userSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, required: true },
  name: String,
  email: String,
  picture: String,
});

// Create a user model
const UserModel = mongoose.model('User', userSchema);

// Routes
app.get('/api/userinfo', async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(400).json({ error: 'Authorization header is missing' });
    }

    const accessToken = authorization.split(' ')[1];

    const userDetailsResponse = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.status(200).json(userDetailsResponse.data);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/users', async (req, res) => {
  const { googleId, name, email, picture } = req.body;

  try {
    const user = await UserModel.findOne({ googleId });

    if (!user) {
      const newUser = new UserModel({ googleId, name, email, picture });
      await newUser.save();
      res.status(201).json(newUser);
    } else {
      res.status(200).json(user);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
