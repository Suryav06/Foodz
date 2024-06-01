import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./models/User.js";
import Bookmark from "./models/BookMark.js";
import session from 'express-session';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: 'hnjasnjns',
    resave: false,
    saveUninitialized: true,
  })
);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected!");
});

app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.post('/bookmarks', async (req, res) => {
  const { title, image, ingredients, email } = req.body; // Extracting email from req.body
  const existingBookmark = await Bookmark.findOne({ email, title });

  if (existingBookmark) { 
    
    return res.status(400).send('Bookmark already exists');
  }

  try {
    const bookmark = new Bookmark({ email, title, image, ingredients });
    await bookmark.save();
    res.send('Bookmark saved successfully');
  } catch (error) {
    console.error('Error saving bookmark:', error);
    res.status(500).send('Error saving bookmark');
  }
});
app.get('/savedRecipes', async (req, res) => {
  try {
    const userEmail = req.query.email; // Retrieve the email parameter from the query string
    

    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    
    
    const savedRecipes = await Bookmark.find({ email: userEmail });

    res.json(savedRecipes);
  } catch (error) {
    console.error('Error fetching saved recipes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/savedRecipes/:id', async (req, res) => {
  try {
    const id = req.params.id;
    
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID' });
    }

   
    await Bookmark.findByIdAndDelete(id);

    res.status(200).json({ message: 'Recipe removed successfully' });
  } catch (error) {
    console.error('Error removing saved recipe:', error);
    res.status(500).json({ error: 'Error removing saved recipe. Please try again later.' });
  }
});





const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  await connect();
  console.log(`Server is running on port ${PORT}`);
});
