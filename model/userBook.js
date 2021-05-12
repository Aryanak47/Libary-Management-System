const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userBookScema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
      required: [true, 'Book must belong to a user!'],
    },
    book: {
      type: mongoose.Schema.ObjectId,
      ref: 'Books',
      required: [true, 'It must have book id!'],
    },
    fine: {
      type: Boolean,
    },
    returned: {
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
    expireDate: {
      type: Date,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userBookScema.virtual('totalFine').get( function() {
    if(this.expireDate){
      const currentTime = Date.now();
      const expireDate = new Date(this.expireDate).getTime();
      if (expireDate < currentTime) {
        this.fine = true;
        const diff = currentTime-expireDate;
        return  Math.round((diff/ (1000 * 3600 * 24)) * 5);
      }
    }
    return 0;
});

userBookScema.pre(/^find/, function (next) {
  this.populate('user').populate({
    path: 'book',
    select:'name photo authors genre'
  });
  next();
});

userBookScema.plugin(mongoosePaginate);
module.exports = mongoose.model('UserBook', userBookScema);
