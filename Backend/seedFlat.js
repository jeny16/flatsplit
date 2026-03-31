const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Flat = require('./models/Flat');
const Expense = require('./models/Expense');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding J26-shivdhara...');

        // 1. Define Users
        const userData = [
            { name: 'Jeny', email: 'jeny@flatsplit.com', role: 'Admin' },
            { name: 'Akshay', email: 'akshay@flatsplit.com', role: 'Member' },
            { name: 'Vandan', email: 'vandan@flatsplit.com', role: 'Member' },
            { name: 'Dhruv', email: 'dhruv@flatsplit.com', role: 'Member' },
            { name: 'Jay M', email: 'jaym@flatsplit.com', role: 'Member' },
            { name: 'Jay K', email: 'jayk@flatsplit.com', role: 'Member' },
            { name: 'Tapan', email: 'tapan@flatsplit.com', role: 'Member' }
        ];

        const users = [];
        for (const u of userData) {
            let user = await User.findOne({ email: u.email });
            if (!user) {
                user = await User.create({
                    ...u,
                    password: 'Test@2026',
                    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`
                });
                console.log(`Created user: ${u.name}`);
            } else {
                user.password = 'Test@2026'; // Ensure password is set
                await user.save();
                console.log(`Found existing user: ${u.name}`);
            }
            users.push(user);
        }

        // 2. Create Flat
        let flat = await Flat.findOne({ name: 'J26-shivdhara' });
        if (!flat) {
            flat = await Flat.create({
                name: 'J26-shivdhara',
                admin: users[0]._id, // Jeny
                inviteCode: 'J26-SHIV',
                members: users.map(u => u._id)
            });
            console.log('Created flat: J26-shivdhara');
        } else {
            flat.members = users.map(u => u._id);
            await flat.save();
            console.log('Updated existing flat members');
        }

        // Update all users to belong to this flat
        await User.updateMany(
            { _id: { $in: users.map(u => u._id) } },
            { flat: flat._id }
        );

        // 3. Clear existing expenses for this flat (optional, for clean seed)
        await Expense.deleteMany({ flat: flat._id });

        // 4. Define Expenses from Chat
        const expensesToSeed = [
            { title: 'BigBasket Order 1', amount: 120, category: 'Food', payerIndex: 0 }, // Jeny
            { title: 'BigBasket Order 2', amount: 270, category: 'Food', payerIndex: 0 }, // Jeny
            { title: 'Jio Mart (Wafer, Chevdo, Dahi)', amount: 116, category: 'Food', payerIndex: 4 }, // Jay M
            { title: 'Dahi (Yesterday)', amount: 75, category: 'Food', payerIndex: 4 }, // Jay M
            { title: 'Sous & Vegetable', amount: 143, category: 'Food', payerIndex: 3 }, // Dhruv
            { title: 'Chass', amount: 80, category: 'Food', payerIndex: 3 }, // Dhruv
            { title: 'Padika 1', amount: 60, category: 'Food', payerIndex: 3 }, // Dhruv
            { title: 'Padika 2', amount: 60, category: 'Food', payerIndex: 3 }, // Dhruv
            { title: 'RO Service', amount: 350, category: 'Utilities', payerIndex: 1 } // Akshay
        ];

        for (const exp of expensesToSeed) {
            const payer = users[exp.payerIndex];
            const perPersonAmount = exp.amount / users.length;
            
            const splits = users.map(u => ({
                user: u._id,
                amount: perPersonAmount
            }));

            await Expense.create({
                title: exp.title,
                amount: exp.amount,
                category: exp.category,
                payer: payer._id,
                flat: flat._id,
                splits,
                date: new Date()
            });
            console.log(`Added expense: ${exp.title} by ${payer.name}`);
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Error seeding data:', err.message);
        process.exit(1);
    }
};

seedData();
