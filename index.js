const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Railway akan menyuntikkan variabel ini nanti
const MONGO_URI = 'mongodb+srv://Deniskw900:Singkawang12@cluster0.j5rbc2z.mongodb.net/'; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Terhubung'))
  .catch(err => console.error('❌ Gagal:', err.message));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ... (route /api/users dan /api/schedules Anda bisa salin dari sebelumnya) ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server di port ${PORT}`));
