import Expanse from "../models/ExpanseModal.js";


export const addExpanse = async (req, res) => {
    try {

        const { user, debit, credit, date, party, description, todoID, amount, category } = req.body
        
        if (!user || debit === undefined || credit === undefined || !date || !party || (amount === undefined || amount <= 0)) {
            return res.status(400).json({
                success: false,
                message: "Please provide all fields"
            })
        }

        const lastExpanse = await Expanse.findOne({ user }).sort({ date: -1 });

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
            date, 
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

export const getExpanse = async (req, res) => {
    try {
        
        const { user } = req.body

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please provide user"
            })
        }

        const expanse = await Expanse.find({ user }).sort({ date: -1 })

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

export const deleteExpanse = async (req, res) => {

    try {
        
        const { id, user } = req.body
        if (!id || !user) {
            return res.status(400).json({
                success: false,
                message: "Please provide id"
            })
        }

        const lastExpanse = await Expanse.findOne({ user }).sort({ date: -1 });

        const currentBalance = lastExpanse ? lastExpanse.balance : 0;

        const expanse = await Expanse.findById(id)
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