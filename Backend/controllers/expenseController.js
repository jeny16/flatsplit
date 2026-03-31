const Expense = require('../models/Expense');
const User = require('../models/User');

// @desc    Get all expenses
// @route   GET /api/expenses
// @access  Private
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ flat: req.user.flat })
      .populate('payer', 'name email avatar')
      .populate('splits.user', 'name');

    res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single expense
// @route   GET /api/expenses/:id
// @access  Private
exports.getExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('payer', 'name email avatar').populate('splits.user', 'name');

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create new expense
// @route   POST /api/expenses
// @access  Private
exports.createExpense = async (req, res) => {
  try {
    if (!req.user.flat) {
      return res.status(400).json({ message: 'User must belong to a flat to create expenses' });
    }
    req.body.payer = req.user.id;
    req.body.flat = req.user.flat;

    const expense = await Expense.create(req.body);

    res.status(201).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update expense
// @route   PUT /api/expenses/:id
// @access  Private
exports.updateExpense = async (req, res) => {
  try {
    let expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user is expense payer or admin
    if (expense.payer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'User not authorized to update this expense' });
    }

    expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: expense });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete expense
// @route   DELETE /api/expenses/:id
// @access  Private
exports.deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // Make sure user is expense payer or admin
    if (expense.payer.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(401).json({ message: 'User not authorized to delete this expense' });
    }

    await expense.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
