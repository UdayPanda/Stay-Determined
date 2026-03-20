import Expanse from "../models/ExpanseModel.js";


export const addExpanse = async (req, res) => {
    try {

        const { user, debit, credit, date, party, description, todoID, amount, category } = req.body
        
        if (!user || debit === undefined || credit === undefined || !date || !party || (amount === undefined || amount <= 0)) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            })
        }

        const txDate = new Date(date);
        if (Number.isNaN(txDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid date"
            })
        }

        const notUniqueTransaction = await Expanse.findOne({ user, date: txDate, party, amount }).select({ _id: 1 }).lean();
        
        if(notUniqueTransaction != null){
            return res.status(400).json({
                success: false,
                message: "Transaction already exists!"
            })
        }

        const lastExpanse = await Expanse
            .findOne({ user })
            .sort({ date: -1, _id: -1 })
            .select({ balance: 1 })
            .lean();

        const previousBalance = lastExpanse ? lastExpanse.balance : 0;

        let newBalance;
        if (debit) {
            newBalance = previousBalance - Number(amount);
        } else if (credit) {
            newBalance = previousBalance + Number(amount);
        } else {
            return res.status(400).json({
                success: false,
                message: "Transaction type must be either debit or credit"
            });
        }

        const expanse = await Expanse.create({
            user,
            balance: newBalance,
            debit,
            credit, 
            date: txDate, 
            party, 
            description, 
            amount, 
            todoID, 
            category
        })

        return res.status(201).json({
            success: true,
            message: "Expanse added successfully",
            expanse
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const bulkAddExpanse = async (req, res) => {
    try {
        const expanseData = req.body;
        // unordered insert improves throughput on partial failures
        const expanse = await Expanse.insertMany(expanseData, { ordered: false });
        return res.status(201).json({
            success: true,
            message: "Expanse added successfully",
            expanse
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
} 

export const getExpanse = async (req, res) => {
    try {
        
        const { user, startDate, endDate, limit, skip } = req.body

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please provide user"
            })
        }

        const query = { user };
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date();
            query.date = { $gte: start, $lte: end };
        }

        const safeLimit = Math.min(Math.max(Number(limit) || 500, 1), 5000);
        const safeSkip = Math.max(Number(skip) || 0, 0);

        const expanse = await Expanse
            .find(query)
            .sort({ date: -1, _id: -1 })
            .skip(safeSkip)
            .limit(safeLimit)
            .lean();

        res.status(200).json({
            success: true,
            message: "Expanse fetched successfully",
            expanse
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getBalance = async (req, res) => {
    try {
        
        const { user, startDate, endDate } = req.body

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please provide user"
            })
        }

        const query = { user };
        if (startDate || endDate) {
            const start = startDate ? new Date(startDate) : new Date(0);
            const end = endDate ? new Date(endDate) : new Date();
            query.date = { $gte: start, $lte: end };
        }

        const expanse = await Expanse
            .findOne(query)
            .sort({ date: -1, _id: -1 })
            .select({ balance: 1 })
            .lean();
        const balance = expanse ? expanse.balance : 0
        
        res.status(200).json({
            success: true,
            message: "Expanse fetched successfully",
            balance: balance
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const deleteExpanse = async (req, res) => {

    try {
        
        const { id, user } = req.body
        if (!id || !user) {
            return res.status(400).json({
                success: false,
                message: "Please provide id"
            })
        }

        const lastExpanse = await Expanse
            .findOne({ user })
            .sort({ date: -1, _id: -1 })
            .select({ _id: 1, balance: 1 })
            .lean();

        const currentBalance = lastExpanse ? lastExpanse.balance : 0;

        const expanse = await Expanse
            .findById(id)
            .select({ debit: 1, credit: 1, amount: 1 })
            .lean();
        if(!expanse){
            return res.status(404).json({
                success: false,
                message: "Expanse not found"
            })
        }
        
        let newBalance;
        if (expanse.debit) {
            newBalance = currentBalance + expanse.amount;
        } else if (expanse.credit) {
            newBalance = currentBalance - expanse.amount;
        } else {
            return res.status(400).json({
                success: false,
                message: "During deletion! Transaction type must be either debit or credit"
            });
        }

        await Expanse.findByIdAndDelete(id)

        if(lastExpanse){
            await Expanse.findByIdAndUpdate(lastExpanse._id, {balance: newBalance})
        }

        return res.status(200).json({
            success: true,
            message: "Expanse deleted successfully",
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
    
}