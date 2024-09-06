const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const customerRoutes = require('./routes/customer');

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', customerRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
