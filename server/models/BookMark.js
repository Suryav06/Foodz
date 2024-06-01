// bookmarkModel.js

import mongoose from 'mongoose';

// Define the schema for the bookmark
const bookmarkSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  ingredients: {
    type: [String], 
    required: true
  }
});


const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

export default Bookmark;
