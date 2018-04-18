const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

const redirectRouter = (req, res) => {
  res.sendFile("/", {root: "./public/"})
}

app.use(express.static('public'));
app.use(redirectRouter);

app.listen(PORT, () => console.log('site listening on port:', PORT));
