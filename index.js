const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the Home Page!</h1><p>This is a lightweight page.</p>');
});

// A simulated "heavy" page that takes time to respond
app.get('/heavy', (req, res) => {
  setTimeout(() => {
    res.send('<h1>Heavy Page Loaded</h1><p>This page took 500ms to respond.</p>');
  }, 500); // 500ms delay
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});
