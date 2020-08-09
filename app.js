const express = require('express');
const path = require('path');
const morgan = require('morgan');
const app = express();
const PostRouter = require('./routes/postRoute');
const UserRouter = require('./routes/userRoutes');
const FeedRouter=require("./routes/feedRoutes");

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1/post', PostRouter);
app.use('/api/v1/users', UserRouter);
app.use('/api/v1/feed', FeedRouter);

module.exports = app;
