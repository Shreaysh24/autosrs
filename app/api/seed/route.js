import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { User } from "@/Models/User";
import { Project } from "@/Models/Projects";
import { Version } from "@/Models/Version";
import { VersionFile } from "@/Models/VersionFile";

export async function POST() {
  try {
    await dbConnect();

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Version.deleteMany({});
    await VersionFile.deleteMany({});

    // Create users
    const users = await User.create([
      { email: 'john@example.com', password: 'password123' },
      { email: 'jane@example.com', password: 'password123' },
      { email: 'shreayshrc@gmail.com', password: 'password123' },
      { email: 'admin@test.com', password: 'admin123' },
      { email: 'demo@user.com', password: 'demo123' },
      { email: 'test@project.com', password: 'test123' }
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
      },
      {
        projectName: 'Banking System',
        ownerId: users[3]._id,
        collaborators: [{ userId: users[3]._id, role: 'owner' }]
      },
      {
        projectName: 'Food Delivery App',
        ownerId: users[4]._id,
        collaborators: [{ userId: users[4]._id, role: 'owner' }]
      },
      {
        projectName: 'Hospital Management',
        ownerId: users[5]._id,
        collaborators: [{ userId: users[5]._id, role: 'owner' }]
      }
    ]);

    // Update users with enrolled projects
    const userProjectMappings = [
      { userIndex: 0, projectIndexes: [0] },
      { userIndex: 1, projectIndexes: [1] },
      { userIndex: 2, projectIndexes: [2, 3, 4, 5, 6] },
      { userIndex: 3, projectIndexes: [7] },
      { userIndex: 4, projectIndexes: [8] },
      { userIndex: 5, projectIndexes: [9] }
    ];

    for (const mapping of userProjectMappings) {
      const enrolledProjects = mapping.projectIndexes.map(i => ({
        projectId: projects[i]._id,
        projectName: projects[i].projectName
      }));
      
      await User.findByIdAndUpdate(users[mapping.userIndex]._id, {
        enrolledProjects: enrolledProjects
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
      { projectId: projects[6]._id, versionName: 'v1.0', summary: 'Property listing portal', createdBy: users[2]._id },
      { projectId: projects[7]._id, versionName: 'v1.0', summary: 'Banking operations system', createdBy: users[3]._id },
      { projectId: projects[8]._id, versionName: 'v1.0', summary: 'Food ordering platform', createdBy: users[4]._id },
      { projectId: projects[9]._id, versionName: 'v1.0', summary: 'Patient management system', createdBy: users[5]._id }
    ]);

    // Create version files
    await VersionFile.create([
      {
        projectId: projects[0]._id,
        versionId: versions[0]._id,
        codeSnippet: 'class ShoppingCart {\n  constructor() {\n    this.items = [];\n  }\n  addItem(item) {\n    this.items.push(item);\n  }\n}',
        expectedOutput: 'Functional shopping cart with add/remove functionality',
        testCase: 'Test adding items, removing items, calculating totals'
      },
      {
        projectId: projects[1]._id,
        versionId: versions[1]._id,
        codeSnippet: 'class ChatBot {\n  processMessage(message) {\n    if (message.includes("hello")) {\n      return "Hello! How can I help you?";\n    }\n    return "I understand you said: " + message;\n  }\n}',
        expectedOutput: 'Chatbot responds appropriately to user messages',
        testCase: 'Test greeting responses, general message handling'
      },
      {
        projectId: projects[2]._id,
        versionId: versions[2]._id,
        codeSnippet: 'class Task {\n  constructor(title, priority) {\n    this.title = title;\n    this.priority = priority;\n    this.completed = false;\n  }\n}',
        expectedOutput: 'Task management functionality',
        testCase: 'Create and manage tasks with priorities'
      },
      {
        projectId: projects[3]._id,
        versionId: versions[3]._id,
        codeSnippet: 'class Dashboard {\n  getAnalytics() {\n    return { likes: 100, shares: 50, comments: 25 };\n  }\n}',
        expectedOutput: 'Social media analytics display',
        testCase: 'Display engagement metrics and trends'
      },
      {
        projectId: projects[4]._id,
        versionId: versions[4]._id,
        codeSnippet: 'class Inventory {\n  constructor() {\n    this.items = {};\n  }\n  addItem(item, quantity) {\n    this.items[item] = quantity;\n  }\n}',
        expectedOutput: 'Inventory tracking system',
        testCase: 'Add and track inventory items with quantities'
      },
      {
        projectId: projects[5]._id,
        versionId: versions[5]._id,
        codeSnippet: 'class Course {\n  constructor(title, instructor) {\n    this.title = title;\n    this.instructor = instructor;\n    this.students = [];\n  }\n}',
        expectedOutput: 'Course management platform',
        testCase: 'Create and manage courses with enrollment'
      },
      {
        projectId: projects[6]._id,
        versionId: versions[6]._id,
        codeSnippet: 'class Property {\n  constructor(address, price) {\n    this.address = address;\n    this.price = price;\n    this.available = true;\n  }\n}',
        expectedOutput: 'Property listing portal',
        testCase: 'List and search properties with filters'
      },
      {
        projectId: projects[7]._id,
        versionId: versions[7]._id,
        codeSnippet: 'class BankAccount {\n  constructor(accountNumber, balance) {\n    this.accountNumber = accountNumber;\n    this.balance = balance;\n  }\n  transfer(amount, toAccount) {\n    this.balance -= amount;\n  }\n}',
        expectedOutput: 'Banking operations system',
        testCase: 'Test account creation, transfers, balance checks'
      },
      {
        projectId: projects[8]._id,
        versionId: versions[8]._id,
        codeSnippet: 'class Order {\n  constructor(customerId) {\n    this.customerId = customerId;\n    this.items = [];\n    this.status = "pending";\n  }\n  addItem(item) {\n    this.items.push(item);\n  }\n}',
        expectedOutput: 'Food ordering platform',
        testCase: 'Test order creation, item addition, status updates'
      },
      {
        projectId: projects[9]._id,
        versionId: versions[9]._id,
        codeSnippet: 'class Patient {\n  constructor(name, age, condition) {\n    this.name = name;\n    this.age = age;\n    this.condition = condition;\n    this.appointments = [];\n  }\n}',
        expectedOutput: 'Patient management system',
        testCase: 'Test patient registration, appointment scheduling'
      }
    ]);

    return NextResponse.json({ 
      message: 'Dummy data created successfully!',
      users: [
        { email: 'john@example.com', password: 'password123', projects: 1 },
        { email: 'jane@example.com', password: 'password123', projects: 1 },
        { email: 'shreayshrc@gmail.com', password: 'password123', projects: 5 },
        { email: 'admin@test.com', password: 'admin123', projects: 1 },
        { email: 'demo@user.com', password: 'demo123', projects: 1 },
        { email: 'test@project.com', password: 'test123', projects: 1 }
      ]
    });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}