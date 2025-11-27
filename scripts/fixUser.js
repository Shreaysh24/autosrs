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
    role: String,
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);

async function fixUser() {
  try {
    await mongoose.connect('mongodb+srv://shreayshrc:src@cluster0.alsvld1.mongodb.net/AutoSrs?appName=Cluster0');
    
    const user = await User.findOne({ email: 'shreayshrc@gmail.com' });
    const projects = await Project.find({ ownerId: user._id });
    
    console.log('User found:', !!user);
    console.log('Current enrolled projects:', user?.enrolledProjects?.length || 0);
    console.log('Projects owned:', projects.length);
    
    if (projects.length > 0) {
      const enrolledProjects = projects.map(p => ({
        projectId: p._id,
        projectName: p.projectName,
        enrolledAt: new Date()
      }));
      
      await User.findByIdAndUpdate(user._id, {
        enrolledProjects: enrolledProjects
      });
      
      console.log('✅ Fixed user enrolled projects:', enrolledProjects.length);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixUser();