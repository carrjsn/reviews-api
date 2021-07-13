// const mongoose = require('mongoose');

// mongoose.connect('url', {useNewUrlParser: true, useUnifiedTopology: true}, (err, connect) => {
//   if (err) {
//     console.log('error connecting to database');
//   } else {
//     console.log('successfully connected to mongo database');
//   }
// });

// let reviewsSchema = mongoose.Schema({
//   id: Number,
//   rating: Number,
//   summary: String,
//   recommended: Boolean,
//   response: String,
//   body: String,
//   date: Date,
//   reviewerName: String,
//   reviewerEmail: String,
//   helpfulness: Number,
//   photos: [{
//     id: Number,
//     url: String
//   }],
//   reported: Boolean,
//   productId: Number,
//   characteristics: {
//     id: Number,
//     value: Number
//   }
//   productId: Number
// });

// let metaSchema = mongoose.Schema({
//   productId: Number,
//   ratings: {
//     1: Number,
//     2: Number,
//     3: Number,
//     4: Number,
//     5: Number
//   },
//   recommended: {
//     true: Number,
//     false: Number
//   },
//   characteristics: {
//     type: {
//       id: Number,
//       value: String
//     }
//   }
// });


// let ReviewModel = mongoose.model('ReviewModel', reviewsSchema);
// let MetaModel = mongoose.model('MetaModel', metaSchema);






