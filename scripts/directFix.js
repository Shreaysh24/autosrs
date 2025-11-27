const mongoose = require('mongoose');

async function directFix() {
  try {
    await mongoose.connect('mongodb+srv://shreayshrc:src@cluster0.alsvld1.mongodb.net/AutoSrs?appName=Cluster0');
    
    // Direct MongoDB operations
    const db = mongoose.connection.db;
    
    // Find user
    const user = await db.collection('users').findOne({ email: 'shreayshrc@gmail.com' });
    console.log('User found:', !!user);
    console.log('Current enrolledProjects:', user?.enrolledProjects?.length || 0);
    
    // Find projects
    const projects = await db.collection('projects').find({ ownerId: user._id }).toArray();
    console.log('Projects found:', projects.length);
    
    // Force update user with enrolled projects
    const enrolledProjects = projects.map(p => ({
      projectId: p._id,
      projectName: p.projectName,
      enrolledAt: new Date()
    }));
    
    const result = await db.collection('users').updateOne(
      { _id: user._id },
      { $set: { enrolledProjects: enrolledProjects } }
    );
    
    console.log('Update result:', result.modifiedCount);
    
    // Verify update
    const updatedUser = await db.collection('users').findOne({ _id: user._id });
    console.log('Updated enrolledProjects:', updatedUser.enrolledProjects?.length || 0);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

directFix();