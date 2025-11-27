const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Exact schema definitions matching your models
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  enrolledProjects: [{
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    projectName: { type: String, trim: true },
    enrolledAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  projectName: { type: String, required: true, trim: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  collaborators: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['owner', 'editor', 'viewer'], default: 'editor' },
    addedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const VersionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  versionName: { type: String, required: true, trim: true },
  summary: { type: String, default: '' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const VersionFileSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  versionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Version', required: true },
  mainFile: { type: String, default: null },
  codeSnippet: { type: String, default: '' },
  expectedOutput: { type: String, default: '' },
  testCase: { type: String, default: '' }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Version = mongoose.model('Version', VersionSchema);
const VersionFile = mongoose.model('VersionFile', VersionFileSchema);

async function completeSetup() {
  try {
    await mongoose.connect('mongodb+srv://shreayshrc:src@cluster0.alsvld1.mongodb.net/AutoSrs?appName=Cluster0');
    console.log('Connected to database');

    // Clear all data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Version.deleteMany({});
    await VersionFile.deleteMany({});
    console.log('Cleared existing data');

    // Create user
    const user = await User.create({
      email: 'shreayshrc@gmail.com',
      password: 'password123'
    });
    console.log('Created user:', user.email);

    // Create projects
    const projectsData = [
      { name: 'Task Management App', summary: 'Complete task tracking system' },
      { name: 'Social Media Dashboard', summary: 'Analytics and engagement platform' },
      { name: 'E-commerce Platform', summary: 'Online shopping system' },
      { name: 'Learning Management System', summary: 'Educational content platform' },
      { name: 'Real Estate Portal', summary: 'Property listing and search' }
    ];

    const projects = [];
    for (const projectData of projectsData) {
      const project = await Project.create({
        projectName: projectData.name,
        ownerId: user._id,
        collaborators: [{
          userId: user._id,
          role: 'owner'
        }]
      });
      projects.push(project);
      console.log('Created project:', project.projectName);
    }

    // Update user with enrolled projects
    const enrolledProjects = projects.map(project => ({
      projectId: project._id,
      projectName: project.projectName,
      enrolledAt: new Date()
    }));

    await User.findByIdAndUpdate(user._id, {
      enrolledProjects: enrolledProjects
    });
    console.log('Updated user with enrolled projects');

    // Create versions for each project
    const versions = [];
    for (let i = 0; i < projects.length; i++) {
      const version = await Version.create({
        projectId: projects[i]._id,
        versionName: 'v1.0',
        summary: projectsData[i].summary,
        createdBy: user._id
      });
      versions.push(version);
      console.log('Created version for:', projects[i].projectName);
    }

    // Create version files
    const codeSnippets = [
      'class TaskManager {\n  constructor() {\n    this.tasks = [];\n  }\n  addTask(task) {\n    this.tasks.push(task);\n  }\n}',
      'class SocialDashboard {\n  getMetrics() {\n    return { likes: 150, shares: 75, comments: 30 };\n  }\n}',
      'class ShoppingCart {\n  constructor() {\n    this.items = [];\n    this.total = 0;\n  }\n}',
      'class Course {\n  constructor(title, instructor) {\n    this.title = title;\n    this.instructor = instructor;\n    this.students = [];\n  }\n}',
      'class Property {\n  constructor(address, price, type) {\n    this.address = address;\n    this.price = price;\n    this.type = type;\n  }\n}'
    ];

    for (let i = 0; i < versions.length; i++) {
      await VersionFile.create({
        projectId: projects[i]._id,
        versionId: versions[i]._id,
        mainFile: `${projects[i].projectName.toLowerCase().replace(/\s+/g, '_')}.js`,
        codeSnippet: codeSnippets[i],
        expectedOutput: `Functional ${projects[i].projectName.toLowerCase()}`,
        testCase: `Test ${projects[i].projectName.toLowerCase()} functionality`
      });
      console.log('Created version file for:', projects[i].projectName);
    }

    console.log('\n✅ Complete setup finished!');
    console.log('Login: shreayshrc@gmail.com / password123');
    console.log('Projects created:', projects.length);
    console.log('Versions created:', versions.length);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

completeSetup();