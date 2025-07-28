import Todo from '../models/TodoModel.js'
import mongoose from 'mongoose';

export const addTodo = async (req, res, next) => {
    try {

        let { title, user, completed, date, label, scheduledFor, reminder, reminderTime, expanse } = req.body;
        if (!title || !user) {
            return res.status(400).json({
                success: false,
                message: "Please provide title and user"
            })
        }

        label = label !== 'null' ? label : 1
        
        const todo = await Todo.create({ title, user, completed, date, label, scheduledFor, reminder, reminderTime, expanse })

        return res.status(201).json({
            success: true,
            message: "Todo created successfully",
            todo: {
                title: todo.title,
                user: todo.user,
                date: todo.date,
                label: todo.label,
                reminder: todo.reminder,
                reminderTime: todo.reminderTime,
                completed: todo.completed,
                scheduledFor: todo.scheduledFor,
                expanse: todo.expanse
            }
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const getTodos = async (req, res, next) => {
    try {

        const { user, date } = req.body;
        
        if (!user && !date) {
            return res.status(400).json({
                success: false,
                message: "Please provide user and date"
            })
        }
       
        const userId = new mongoose.Types.ObjectId(user);
        const todos = await Todo.find({ user: userId, date })
        return res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            todos
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}


export const getLabelCounts = async (req, res, next) => {
    try {
        const { user, date } = req.body;

        if (!user || !date) {
            return res.status(400).json({
                success: false,
                message: "Please provide user and date",
            });
        }

        const labelCounts = await Todo.aggregate([
            {
                $match: {
                    user: mongoose.Types.ObjectId(user), // Ensure user is an ObjectId
                    date: {
                        $gte: new Date(date),
                        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000), // Match the specific day
                    },
                },
            },
            {
                $group: {
                    _id: "$label",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Convert the aggregation result to an object with label as keys
        const labelCountsObject = labelCounts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        return res.status(200).json({
            success: true,
            message: "Label counts fetched successfully",
            labelCounts: labelCountsObject,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


export const getExpanseTodos = async (req, res, next) => {
    try {

        const { user } = req.body;
        
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Please provide user"
            })
        }
       
        const todos = await Todo.find({ user, exapnse: true })
        return res.status(200).json({
            success: true,
            message: "Todos fetched successfully",
            todos
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const deleteTodo = async (req, res, next)=> {
    try {
    
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide id"
            })
        }

        const todo = await Todo.findById(id)
        if(!todo){
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            })
        }

        await Todo.findByIdAndDelete(id)
        return res.status(200).json({
            success: true,
            message: "Todo deleted successfully"
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}

export const updateTodo = async (req, res, next)=> {
    try {
        const { id, todo} = req.body;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Please provide id"
            })
        }

        const findTodo = await Todo.findById(id)
        if(!findTodo){
            return res.status(404).json({
                success: false,
                message: "Todo not found"
            })
        }

        const { user, ...updateFields } = todo; 

        await Todo.findByIdAndUpdate(id, {
            $set: updateFields 
        });

        return res.status(200).json({
            success: true,
            message: "Todo updated successfully",
            todo
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
