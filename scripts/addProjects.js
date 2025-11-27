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

const User = mongoose.model('User', UserSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Version = mongoose.model('Version', VersionSchema);
const VersionFile = mongoose.model('VersionFile', VersionFileSchema);

async function addProjects() {
  try {
    await mongoose.connect('mongodb+srv://shreayshrc:src@cluster0.alsvld1.mongodb.net/AutoSrs?appName=Cluster0');
    console.log('Connected to database');

    const userId = '692878282c447cb7012f1847';
    
    // Create projects
    const projects = await Project.create([
      {
        projectName: 'Task Management App',
        ownerId: userId,
        collaborators: [{ userId: userId, role: 'owner' }]
      },
      {
        projectName: 'Social Media Dashboard',
        ownerId: userId,
        collaborators: [{ userId: userId, role: 'owner' }]
      },
      {
        projectName: 'Inventory Management System',
        ownerId: userId,
        collaborators: [{ userId: userId, role: 'owner' }]
      },
      {
        projectName: 'Learning Management Platform',
        ownerId: userId,
        collaborators: [{ userId: userId, role: 'owner' }]
      },
      {
        projectName: 'Real Estate Portal',
        ownerId: userId,
        collaborators: [{ userId: userId, role: 'owner' }]
      }
    ]);

    // Add projects to user
    const enrolledProjects = projects.map(p => ({
      projectId: p._id,
      projectName: p.projectName
    }));

    await User.findByIdAndUpdate(userId, {
      enrolledProjects: enrolledProjects
    });

    // Create versions
    const versions = await Version.create([
      { projectId: projects[0]._id, versionName: 'v1.0', summary: 'Task creation and management', createdBy: userId },
      { projectId: projects[1]._id, versionName: 'v1.0', summary: 'Social media analytics dashboard', createdBy: userId },
      { projectId: projects[2]._id, versionName: 'v1.0', summary: 'Inventory tracking system', createdBy: userId },
      { projectId: projects[3]._id, versionName: 'v1.0', summary: 'Course management platform', createdBy: userId },
      { projectId: projects[4]._id, versionName: 'v1.0', summary: 'Property listing portal', createdBy: userId }
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

    console.log('✅ Projects added successfully!');
    console.log('Added 5 projects to user:', userId);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

addProjects();