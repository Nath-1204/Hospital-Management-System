import userModel from '../models/userModel.js';
import bcrypt from 'bcryptjs';


const seedAdmin = async () => {

  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.log(' ADMIN_EMAIL or ADMIN_PASSWORD not defined in .env - admin not created');
      return;
    }

    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);

      const admin = new userModel({
        name: 'Administrator',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
      });
      await admin.save();
      console.log('Admin created successfully');

    } else {
      console.log('Admin already present in the database');
    }

  } catch (error) {
    console.error('Error creating admin  :', error.message);
  }

};

export default seedAdmin;