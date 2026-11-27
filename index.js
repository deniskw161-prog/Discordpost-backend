const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// Prioritas: variabel MONGODB_URI di Railway. Jika kosong, pakai nilai lama di bawah.
const MONGO_URI = process.env.MONGODB_URI || 'mongodb+srv://Deniskw900:Singkawang12@cluster0.j5rbc2z.mongodb.net/';

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Terhubung'))
  .catch(err => console.error('❌ Gagal:', err.message));

// Halaman utama: tampilkan index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// ===== Model User =====
const userSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// ===== Daftar akun =====
app.post('/api/users', async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ nama, email, password: hash });
    res.status(201).json({ id: user._id, nama: user.nama, email: user.email });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }
    console.error(err);
    res.status(500).json({ error: 'Gagal menyimpan akun' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => console.log(`🚀 Server di port ${PORT}`));
