const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  enrolledProjects: [{
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    projectName: String,
    enrolledAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  projectName: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  collaborators: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, default: 'owner' },
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);

async function checkDatabase() {
  try {
    await mongoose.connect('mongodb+srv://shreayshrc:src@cluster0.alsvld1.mongodb.net/AutoSrs?appName=Cluster0');
    console.log('Connected to database');

    // Check user
    const user = await User.findOne({ email: 'shreayshrc@gmail.com' });
    console.log('\n=== USER DATA ===');
    if (user) {
      console.log('User found:', {
        id: user._id,
        email: user.email,
        enrolledProjectsCount: user.enrolledProjects?.length || 0,
        enrolledProjects: user.enrolledProjects
      });
    } else {
      console.log('User NOT found');
    }

    // Check all users
    const allUsers = await User.find({});
    console.log('\n=== ALL USERS ===');
    console.log('Total users:', allUsers.length);
    allUsers.forEach(u => {
      console.log(`- ${u.email} (${u.enrolledProjects?.length || 0} projects)`);
    });

    // Check projects
    const allProjects = await Project.find({});
    console.log('\n=== ALL PROJECTS ===');
    console.log('Total projects:', allProjects.length);
    allProjects.forEach(p => {
      console.log(`- ${p.projectName} (Owner: ${p.ownerId})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkDatabase();