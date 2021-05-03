const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userBookScema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Book must belong to a user!'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'It must have book id!'],
    },
    fine: {
      type: Boolean,
      default: false,
    },
    issueDate: {
      type: Date,
    },
    approve: {
      type: Boolean,
      default: false,
    },
    totalFine: {
      type: Number,
    },
    expireDate: {
      type: Date,
      //   default: Date.now() + 10 * 24 * 60 * 60 * 1000,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userBookScema.find('/^find/', function (next) {
  this.populate('user').populate({
    path: 'book',
  });
  if (this.expireDate) {
    const currentTime = Date.now();
    if (this.expireDate < currentTime) {
      const daysAfterExpire = (currentTime - this.expireDate) / 86400;
      this.totalFine = parseInt(daysAfterExpire, 10) * 5;
    }
  }
  next();
});

userBookScema.plugin(mongoosePaginate);
module.exports = mongoose.model('UserBook', userBookScema);
