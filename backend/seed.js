const path = require('path');
require('dotenv').config();
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const Employee = require('./models/Employee');
const Attendance = require('./models/Attendance');
const User = require('./models/User');
const RefreshToken = require('./models/RefreshToken');

const employees = [
  // Engineering (7)
  {
    name: 'Arjun Mehta',
    employeeId: 'EMP001',
    department: 'Engineering',
    designation: 'Staff Software Engineer',
    email: 'arjun.mehta@pramyan.com',
    phone: '+91-9876543210',
    dateOfJoining: '2021-03-15',
    status: 'Active',
  },
  {
    name: 'Vikram Nair',
    employeeId: 'EMP002',
    department: 'Engineering',
    designation: 'Backend Tech Lead',
    email: 'vikram.nair@pramyan.com',
    phone: '+91-9876543211',
    dateOfJoining: '2022-02-01',
    status: 'Active',
  },
  {
    name: 'Rohan Gupta',
    employeeId: 'EMP003',
    department: 'Engineering',
    designation: 'Senior Frontend Architect',
    email: 'rohan.gupta@pramyan.com',
    phone: '+91-9876543212',
    dateOfJoining: '2023-04-10',
    status: 'Active',
  },
  {
    name: 'Neha Chawla',
    employeeId: 'EMP004',
    department: 'Engineering',
    designation: 'DevOps & Cloud Engineer',
    email: 'neha.chawla@pramyan.com',
    phone: '+91-9876543213',
    dateOfJoining: '2023-08-20',
    status: 'Active',
  },
  {
    name: 'Aakash Singhal',
    employeeId: 'EMP005',
    department: 'Engineering',
    designation: 'Mobile Engineer (iOS/Android)',
    email: 'aakash.singhal@pramyan.com',
    phone: '+91-9876543214',
    dateOfJoining: '2023-11-05',
    status: 'Active',
  },
  {
    name: 'Siddharth Roy',
    employeeId: 'EMP006',
    department: 'Engineering',
    designation: 'Data Platform Engineer',
    email: 'siddharth.roy@pramyan.com',
    phone: '+91-9876543215',
    dateOfJoining: '2022-09-18',
    status: 'Active',
  },
  {
    name: 'Tarun Bansal',
    employeeId: 'EMP007',
    department: 'Engineering',
    designation: 'QA Automation Lead',
    email: 'tarun.bansal@pramyan.com',
    phone: '+91-9876543216',
    dateOfJoining: '2024-01-15',
    status: 'Active',
  },

  // HR & People (3)
  {
    name: 'Priya Sharma',
    employeeId: 'EMP008',
    department: 'HR',
    designation: 'Head of People Operations',
    email: 'priya.sharma@pramyan.com',
    phone: '+91-9876543217',
    dateOfJoining: '2020-07-01',
    status: 'Active',
  },
  {
    name: 'Meera Deshmukh',
    employeeId: 'EMP009',
    department: 'HR',
    designation: 'Senior Technical Recruiter',
    email: 'meera.deshmukh@pramyan.com',
    phone: '+91-9876543218',
    dateOfJoining: '2022-10-12',
    status: 'Active',
  },
  {
    name: 'Ananya Joshi',
    employeeId: 'EMP010',
    department: 'HR',
    designation: 'HR Generalist & Talent Ops',
    email: 'ananya.joshi@pramyan.com',
    phone: '+91-9876543219',
    dateOfJoining: '2023-09-15',
    status: 'Inactive',
  },

  // Design (3)
  {
    name: 'Sneha Kapoor',
    employeeId: 'EMP011',
    department: 'Design',
    designation: 'Principal Product Designer',
    email: 'sneha.kapoor@pramyan.com',
    phone: '+91-9876543220',
    dateOfJoining: '2021-11-20',
    status: 'Active',
  },
  {
    name: 'Kabir Malhotra',
    employeeId: 'EMP012',
    department: 'Design',
    designation: 'Design Systems Lead',
    email: 'kabir.malhotra@pramyan.com',
    phone: '+91-9876543221',
    dateOfJoining: '2023-03-01',
    status: 'Active',
  },
  {
    name: 'Ishaan Kulkarni',
    employeeId: 'EMP013',
    department: 'Design',
    designation: 'UX Researcher',
    email: 'ishaan.kulkarni@pramyan.com',
    phone: '+91-9876543222',
    dateOfJoining: '2023-12-10',
    status: 'Active',
  },

  // Finance (3)
  {
    name: 'Rohit Verma',
    employeeId: 'EMP014',
    department: 'Finance',
    designation: 'Director of Financial Planning',
    email: 'rohit.verma@pramyan.com',
    phone: '+91-9876543223',
    dateOfJoining: '2022-01-10',
    status: 'Active',
  },
  {
    name: 'Kavita Patel',
    employeeId: 'EMP015',
    department: 'Finance',
    designation: 'Senior Payroll Specialist',
    email: 'kavita.patel@pramyan.com',
    phone: '+91-9876543224',
    dateOfJoining: '2022-09-01',
    status: 'Active',
  },
  {
    name: 'Nitin Saxena',
    employeeId: 'EMP016',
    department: 'Finance',
    designation: 'Corporate Controller',
    email: 'nitin.saxena@pramyan.com',
    phone: '+91-9876543225',
    dateOfJoining: '2024-02-15',
    status: 'Active',
  },

  // Sales (3)
  {
    name: 'Karan Singh',
    employeeId: 'EMP017',
    department: 'Sales',
    designation: 'VP of Enterprise Sales',
    email: 'karan.singh@pramyan.com',
    phone: '+91-9876543226',
    dateOfJoining: '2021-05-01',
    status: 'Active',
  },
  {
    name: 'Varun Grover',
    employeeId: 'EMP018',
    department: 'Sales',
    designation: 'Strategic Account Executive',
    email: 'varun.grover@pramyan.com',
    phone: '+91-9876543227',
    dateOfJoining: '2023-06-18',
    status: 'Active',
  },
  {
    name: 'Simran Bajaj',
    employeeId: 'EMP019',
    department: 'Sales',
    designation: 'Enterprise SDR Lead',
    email: 'simran.bajaj@pramyan.com',
    phone: '+91-9876543228',
    dateOfJoining: '2024-03-01',
    status: 'Active',
  },

  // Marketing (3)
  {
    name: 'Aditya Sen',
    employeeId: 'EMP020',
    department: 'Marketing',
    designation: 'Director of Product Marketing',
    email: 'aditya.sen@pramyan.com',
    phone: '+91-9876543229',
    dateOfJoining: '2022-04-12',
    status: 'Active',
  },
  {
    name: 'Rhea Chakraborty',
    employeeId: 'EMP021',
    department: 'Marketing',
    designation: 'Growth & Performance Manager',
    email: 'rhea.c@pramyan.com',
    phone: '+91-9876543230',
    dateOfJoining: '2023-07-22',
    status: 'Active',
  },
  {
    name: 'Alok Pandey',
    employeeId: 'EMP022',
    department: 'Marketing',
    designation: 'Content Strategy Specialist',
    email: 'alok.pandey@pramyan.com',
    phone: '+91-9876543231',
    dateOfJoining: '2024-01-08',
    status: 'Inactive',
  },

  // Operations (2)
  {
    name: 'Pooja Iyer',
    employeeId: 'EMP023',
    department: 'Operations',
    designation: 'Director of Business Operations',
    email: 'pooja.iyer@pramyan.com',
    phone: '+91-9876543232',
    dateOfJoining: '2021-12-01',
    status: 'Active',
  },
  {
    name: 'Gaurav Khanna',
    employeeId: 'EMP024',
    department: 'Operations',
    designation: 'IT Infrastructure & SecOps',
    email: 'gaurav.khanna@pramyan.com',
    phone: '+91-9876543233',
    dateOfJoining: '2023-05-14',
    status: 'Active',
  },

  // Legal (2)
  {
    name: 'Divya Nambiar',
    employeeId: 'EMP025',
    department: 'Legal',
    designation: 'General Counsel & Legal Head',
    email: 'divya.nambiar@pramyan.com',
    phone: '+91-9876543234',
    dateOfJoining: '2022-06-10',
    status: 'Active',
  },
  {
    name: 'Manish Trivedi',
    employeeId: 'EMP026',
    department: 'Legal',
    designation: 'Contracts & Compliance Counsel',
    email: 'manish.trivedi@pramyan.com',
    phone: '+91-9876543235',
    dateOfJoining: '2023-10-01',
    status: 'Active',
  },
];

async function seed() {
  const rawUri = process.env.MONGO_URI || 'mongodb://localhost:27017/hr_dashboard';
  const uri = rawUri.trim().replace(/^["']|["']$/g, '');
  await mongoose.connect(uri);
  console.log('🌱 Connected to MongoDB Atlas for database reset & seeding...');

  // Reset collections
  await Employee.deleteMany({});
  await Attendance.deleteMany({});
  await RefreshToken.deleteMany({});
  await User.deleteMany({});
  console.log('🧹 Cleaned existing employees, attendance logs, tokens, and users.');

  // Seed default admin user
  await User.create({
    name: 'HR Admin',
    email: 'admin@pramyan.com',
    password: 'Admin@123',
    role: 'Admin',
  });
  console.log('👤 Seeded default HR Admin account (admin@pramyan.com / Admin@123)');

  const createdEmployees = await Employee.insertMany(employees);
  console.log(`👥 Seeded ${createdEmployees.length} employees across 8 company departments`);

  // Generate 30 Days (1 Full Month) of Realistic Variable Attendance History
  const activeEmployees = createdEmployees.filter((e) => e.status === 'Active');
  const attendanceRecords = [];

  const now = new Date();

  // Iterate over past 30 days
  for (let d = 29; d >= 0; d--) {
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() - d);
    const dateStr = targetDate.toISOString().split('T')[0];
    const dayOfWeek = targetDate.getDay();

    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek === 0 || dayOfWeek === 6) continue;

    // Determine day-specific attendance probability weight (e.g. Fridays have slightly more leaves)
    const isFriday = dayOfWeek === 5;
    const isMonday = dayOfWeek === 1;

    activeEmployees.forEach((emp, empIdx) => {
      // Natural variable pseudo-random algorithm with employee personality profiles
      const seedVal = (empIdx * 17 + d * 31 + (empIdx % 5) * 11) % 100;
      let status = 'Present';

      if (isFriday) {
        if (seedVal < 18) status = 'On Leave';
        else if (seedVal < 26) status = 'Absent';
      } else if (isMonday) {
        if (seedVal < 14) status = 'On Leave';
        else if (seedVal < 20) status = 'Absent';
      } else {
        if (seedVal < 9) status = 'On Leave';
        else if (seedVal < 15) status = 'Absent';
      }

      // For today (d === 0), leave 3 records unrecorded for live interactive testing
      if (d === 0 && empIdx >= activeEmployees.length - 3) {
        return;
      }

      attendanceRecords.push({
        employeeId: emp._id,
        date: dateStr,
        status,
      });
    });
  }

  await Attendance.insertMany(attendanceRecords);
  console.log(
    `✅ Seeded ${attendanceRecords.length} historical attendance logs spanning 30 days (1 month) across the entire company`
  );

  await mongoose.disconnect();
  console.log('🌱 1-Month Database Seeding Complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
