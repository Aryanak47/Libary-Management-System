const mongoose = require('mongoose');
const slugify = require('slugify');
const mongoosePaginate = require('mongoose-paginate-v2');

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Book must have name'],
      unique: true,
      trim: true,
    },
    slug: String,
    authors: [String],
    new: {
      type: Boolean,
      default: false,
    },
    genre: String,
    ISBN: {
      type: Number,
      unique: true,
    },
    summary: String,
    stocks: Number,
    photo: {
      type: String,
      required: [true, 'Book must have photo'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// make a slug of name field before saving it to database
bookSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

bookSchema.plugin(mongoosePaginate);

const Books = mongoose.model('Books', bookSchema);

module.exports = Books;
