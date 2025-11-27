const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple schema definitions for seeding
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
    role: { type: String, default: 'editor' },
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

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/autosrs');
    console.log('Connected to database');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Version.deleteMany({});
    await VersionFile.deleteMany({});

    // Create users
    const users = await User.create([
      { email: 'john@example.com', password: 'password123' },
      { email: 'jane@example.com', password: 'password123' },
      { email: 'shreayshrc@gmail.com', password: 'password123' }
    ]);

    // Create projects
    const projects = await Project.create([
      {
        projectName: 'E-Commerce Platform',
        ownerId: users[0]._id,
        collaborators: [{ userId: users[0]._id, role: 'owner' }]
      },
      {
        projectName: 'AI Chatbot System', 
        ownerId: users[1]._id,
        collaborators: [{ userId: users[1]._id, role: 'owner' }]
      },
      {
        projectName: 'Task Management App',
        ownerId: users[2]._id,
        collaborators: [{ userId: users[2]._id, role: 'owner' }]
      },
      {
        projectName: 'Social Media Dashboard',
        ownerId: users[2]._id,
        collaborators: [{ userId: users[2]._id, role: 'owner' }]
      },
      {
        projectName: 'Inventory Management System',
        ownerId: users[2]._id,
        collaborators: [{ userId: users[2]._id, role: 'owner' }]
      },
      {
        projectName: 'Learning Management Platform',
        ownerId: users[2]._id,
        collaborators: [{ userId: users[2]._id, role: 'owner' }]
      },
      {
        projectName: 'Real Estate Portal',
        ownerId: users[2]._id,
        collaborators: [{ userId: users[2]._id, role: 'owner' }]
      }
    ]);

    // Update users with projects
    await User.findByIdAndUpdate(users[0]._id, {
      $push: { enrolledProjects: { projectId: projects[0]._id, projectName: projects[0].projectName }}
    });
    await User.findByIdAndUpdate(users[1]._id, {
      $push: { enrolledProjects: { projectId: projects[1]._id, projectName: projects[1].projectName }}
    });
    
    // Add multiple projects for shreayshrc@gmail.com
    for (let i = 2; i < projects.length; i++) {
      await User.findByIdAndUpdate(users[2]._id, {
        $push: { enrolledProjects: { projectId: projects[i]._id, projectName: projects[i].projectName }}
      });
    }

    // Create versions
    const versions = await Version.create([
      { projectId: projects[0]._id, versionName: 'v1.0', summary: 'Initial release', createdBy: users[0]._id },
      { projectId: projects[1]._id, versionName: 'v1.0', summary: 'Basic chatbot', createdBy: users[1]._id },
      { projectId: projects[2]._id, versionName: 'v1.0', summary: 'Task creation and management', createdBy: users[2]._id },
      { projectId: projects[3]._id, versionName: 'v1.0', summary: 'Social media analytics dashboard', createdBy: users[2]._id },
      { projectId: projects[4]._id, versionName: 'v1.0', summary: 'Inventory tracking system', createdBy: users[2]._id },
      { projectId: projects[5]._id, versionName: 'v1.0', summary: 'Course management platform', createdBy: users[2]._id },
      { projectId: projects[6]._id, versionName: 'v1.0', summary: 'Property listing portal', createdBy: users[2]._id }
    ]);

    // Create version files
    await VersionFile.create([
      {
        projectId: projects[0]._id,
        versionId: versions[0]._id,
        codeSnippet: 'class ShoppingCart { constructor() { this.items = []; } }',
        expectedOutput: 'Functional shopping cart',
        testCase: 'Test adding items'
      },
      {
        projectId: projects[1]._id,
        versionId: versions[1]._id,
        codeSnippet: 'class ChatBot { processMessage(msg) { return "Hello!"; } }',
        expectedOutput: 'Chatbot responds',
        testCase: 'Test user inputs'
      },
      {
        projectId: projects[2]._id,
        versionId: versions[2]._id,
        codeSnippet: 'class Task { constructor(title, priority) { this.title = title; this.priority = priority; } }',
        expectedOutput: 'Task management functionality',
        testCase: 'Create and manage tasks'
      },
      {
        projectId: projects[3]._id,
        versionId: versions[3]._id,
        codeSnippet: 'class Dashboard { getAnalytics() { return { likes: 100, shares: 50 }; } }',
        expectedOutput: 'Social media analytics display',
        testCase: 'Display engagement metrics'
      },
      {
        projectId: projects[4]._id,
        versionId: versions[4]._id,
        codeSnippet: 'class Inventory { addItem(item, quantity) { this.items[item] = quantity; } }',
        expectedOutput: 'Inventory tracking system',
        testCase: 'Add and track inventory items'
      },
      {
        projectId: projects[5]._id,
        versionId: versions[5]._id,
        codeSnippet: 'class Course { constructor(title, instructor) { this.title = title; this.instructor = instructor; } }',
        expectedOutput: 'Course management platform',
        testCase: 'Create and manage courses'
      },
      {
        projectId: projects[6]._id,
        versionId: versions[6]._id,
        codeSnippet: 'class Property { constructor(address, price) { this.address = address; this.price = price; } }',
        expectedOutput: 'Property listing portal',
        testCase: 'List and search properties'
      }
    ]);

    console.log('✅ Dummy data created!');
    console.log('Test users: john@example.com, jane@example.com, shreayshrc@gmail.com (password: password123)');
    console.log('shreayshrc@gmail.com has 5 dummy projects to view in the project list');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

seedData();