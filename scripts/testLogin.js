const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  enrolledProjects: [{
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    projectName: String,
    enrolledAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function testLogin() {
  try {
    await mongoose.connect('mongodb+srv://shreayshrc:src@cluster0.alsvld1.mongodb.net/AutoSrs?appName=Cluster0');
    console.log('Connected to database');

    const email = 'shreayshrc@gmail.com';
    const password = 'password123';

    // Find user
    const user = await User.findOne({ email });
    console.log('\n=== LOGIN TEST ===');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('✅ User found:', user.email);
    console.log('User ID:', user._id.toString());
    console.log('Enrolled Projects:', user.enrolledProjects.length);

    // Test password
    const isValid = await bcrypt.compare(password, user.password);
    console.log('Password valid:', isValid ? '✅' : '❌');

    if (isValid) {
      console.log('\n=== SESSION DATA ===');
      console.log('Session user object would be:');
      console.log({
        id: user._id.toString(),
        email: user.email
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLogin();