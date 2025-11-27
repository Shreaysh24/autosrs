const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple schema definitions
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

const VersionSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  versionName: String,
  summary: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

const VersionFileSchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  versionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Version' },
  mainFile: String,
  codeSnippet: String,
  expectedOutput: String,
  testCase: String
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

async function quickSeed() {
  try {
    await mongoose.connect('mongodb+srv://shreayshrc:src@cluster0.alsvld1.mongodb.net/AutoSrs?appName=Cluster0');
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Version.deleteMany({});
    await VersionFile.deleteMany({});

    // Create user
    const user = await User.create({
      email: 'shreayshrc@gmail.com',
      password: 'password123'
    });

    // Create projects
    const projects = await Project.create([
      {
        projectName: 'Task Management App',
        ownerId: user._id,
        collaborators: [{ userId: user._id, role: 'owner' }]
      },
      {
        projectName: 'Social Media Dashboard',
        ownerId: user._id,
        collaborators: [{ userId: user._id, role: 'owner' }]
      },
      {
        projectName: 'Inventory Management System',
        ownerId: user._id,
        collaborators: [{ userId: user._id, role: 'owner' }]
      },
      {
        projectName: 'Learning Management Platform',
        ownerId: user._id,
        collaborators: [{ userId: user._id, role: 'owner' }]
      },
      {
        projectName: 'Real Estate Portal',
        ownerId: user._id,
        collaborators: [{ userId: user._id, role: 'owner' }]
      }
    ]);

    // Update user with enrolled projects
    const enrolledProjects = projects.map(p => ({
      projectId: p._id,
      projectName: p.projectName
    }));

    await User.findByIdAndUpdate(user._id, {
      enrolledProjects: enrolledProjects
    });

    // Create versions
    const versions = await Version.create([
      { projectId: projects[0]._id, versionName: 'v1.0', summary: 'Task creation and management', createdBy: user._id },
      { projectId: projects[1]._id, versionName: 'v1.0', summary: 'Social media analytics dashboard', createdBy: user._id },
      { projectId: projects[2]._id, versionName: 'v1.0', summary: 'Inventory tracking system', createdBy: user._id },
      { projectId: projects[3]._id, versionName: 'v1.0', summary: 'Course management platform', createdBy: user._id },
      { projectId: projects[4]._id, versionName: 'v1.0', summary: 'Property listing portal', createdBy: user._id }
    ]);

    // Create version files
    await VersionFile.create([
      {
        projectId: projects[0]._id,
        versionId: versions[0]._id,
        codeSnippet: 'class Task { constructor(title, priority) { this.title = title; this.priority = priority; } }',
        expectedOutput: 'Task management functionality',
        testCase: 'Create and manage tasks'
      },
      {
        projectId: projects[1]._id,
        versionId: versions[1]._id,
        codeSnippet: 'class Dashboard { getAnalytics() { return { likes: 100, shares: 50 }; } }',
        expectedOutput: 'Social media analytics',
        testCase: 'Display engagement metrics'
      },
      {
        projectId: projects[2]._id,
        versionId: versions[2]._id,
        codeSnippet: 'class Inventory { addItem(item, qty) { this.items[item] = qty; } }',
        expectedOutput: 'Inventory tracking',
        testCase: 'Add and track items'
      },
      {
        projectId: projects[3]._id,
        versionId: versions[3]._id,
        codeSnippet: 'class Course { constructor(title) { this.title = title; this.students = []; } }',
        expectedOutput: 'Course management',
        testCase: 'Create and manage courses'
      },
      {
        projectId: projects[4]._id,
        versionId: versions[4]._id,
        codeSnippet: 'class Property { constructor(address, price) { this.address = address; this.price = price; } }',
        expectedOutput: 'Property listing',
        testCase: 'List and search properties'
      }
    ]);

    console.log('✅ Data populated successfully!');
    console.log('Login: shreayshrc@gmail.com / password123');
    console.log('Projects: 5 projects with versions created');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

quickSeed();