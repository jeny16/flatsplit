const Expense = require('../models/Expense');
const User = require('../models/User');

// @desc    Get dashboard summary
// @route   GET /api/analytics/summary
// @access  Private
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const flatId = req.user.flat;

    if (!flatId) {
      return res.status(400).json({ message: 'User not in a flat' });
    }

    // Total expenses involving the user in their current flat
    const totalExpenses = await Expense.find({
        flat: flatId
    });
    
    let totalOwedToUser = 0;
    let totalUserOwes = 0;

    totalExpenses.forEach(expense => {
        if (expense.payer.toString() === userId) {
            // User paid, others owe
            expense.splits.forEach(split => {
                if (split.user.toString() !== userId) {
                    totalOwedToUser += split.amount;
                }
            });
        } else {
            // Someone else paid, user owes
            const userSplit = expense.splits.find(s => s.user.toString() === userId);
            if (userSplit) {
                totalUserOwes += userSplit.userSplit ? userSplit.amount : 0;
                // Since I might have different structures, let's be careful
                totalUserOwes += userSplit.amount;
            }
        }
    });

    // Categorical breakdown
    const categories = ['Rent', 'Utilities', 'Food', 'Leisure', 'Transport', 'Other'];
    const categoryData = await Promise.all(categories.map(async cat => {
        const amount = await Expense.aggregate([
            { $match: { category: cat, 'splits.user': req.user._id } },
            { $unwind: '$splits' },
            { $match: { 'splits.user': req.user._id } },
            { $group: { _id: null, total: { $sum: '$splits.amount' } } }
        ]);
        return { name: cat, value: amount.length > 0 ? amount[0].total : 0 };
    }));

    res.status(200).json({
      success: true,
      data: {
        totalOwedToUser,
        totalUserOwes,
        balance: totalOwedToUser - totalUserOwes,
        categoryData
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get balances between all users (Settle up view)
// @route   GET /api/analytics/balances
// @access  Private
exports.getBalances = async (req, res) => {
    try {
        const flatId = req.user.flat;
        const users = await User.find({ flat: flatId }, 'name email avatar role');
        const expenses = await Expense.find({ flat: flatId, isSettled: false });

        // Simple algorithm: calculate net balance for each user
        const balances = {};
        users.forEach(u => balances[u._id] = 0);

        expenses.forEach(exp => {
            // Payer gets the full amount back
            balances[exp.payer] += exp.amount;
            // Each splitter pays their part
            exp.splits.forEach(split => {
                balances[split.user] -= split.amount;
            });
        });

        const result = users.map(u => ({
            id: u._id,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
            netBalance: balances[u._id] || 0
        }));

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
