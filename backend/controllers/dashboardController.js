const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { isValidObjectId, Types} = require('mongoose');

//Dashboard dataa bolte
exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        //fetching total income and expenses
        const totalIncome = await Income.aggregate([
            { $match: {userId: userObjectId} },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const totalExpense = await Expense.aggregate([
            { $match: {userId: userObjectId} },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        
        //fetching last 60 days income transactions
        const last60DaysIncomeTransactions = await Income.find({
            userId,
            date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });
    
        //fetching last 60 days total income
        const incomeLast60Days = last60DaysIncomeTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        ); 

        // get expense of last 30 days transactions
        const last30DaysExpenseTransactions = await Expense.find({
            userId,
            date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }).sort({ date: -1 });

        // get total expenses of last 30 days
        const expensesLast30Days = last30DaysExpenseTransactions.reduce(
            (sum, transaction) => sum + transaction.amount,
            0
        );
                

        // get last 5 transactions both income+expenses
        const lastTransactions = [
            ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "income",
                })
            ),
            ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
                (txn) => ({
                    ...txn.toObject(),
                    type: "expense",
                })
            ),
        ].sort((a, b) => b.date - a.date); // sorting for latest first

        //Final response.. 
        res.json({
            totalBalance:
                (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses:{
                total: expensesLast30Days,
                transactions: last30DaysExpenseTransactions,
            },
            last60DaysIncome: {
                total: incomeLast60Days,
                transactions: last60DaysIncomeTransactions,
            },
            recentTransactions: lastTransactions,
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error :-(', error });
    }
}