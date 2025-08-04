require('dotenv').config();
const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(express.json());

//routes
app.get('/', (req, res) => {
  res.send("In working order!");
})

//start server
app.listen(PORT, () => {
  console.log(`server running on PORT: ${PORT}`)
});
