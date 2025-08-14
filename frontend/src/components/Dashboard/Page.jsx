"use client"

import { useState } from "react"
import { ArrowUpIcon, ArrowDownIcon, CreditCardIcon, CheckSquareIcon, FlameIcon } from "lucide-react"

export default function Dashboard() {
  const [transactions, setTransactions] = useState({
    debits: [
      { id: 1, description: "sfokss", amount: -22, date: "Jun 29", time: "06:49 PM", category: "se" },
      {
        id: 2,
        description: "Auto + canteen+ chai",
        amount: -100,
        date: "Jan 07",
        time: "07:14 PM",
        category: "Daily expenses",
      },
      { id: 3, description: "NA", amount: -800, date: "Dec 15", time: "07:12 PM", category: "NA" },
      {
        id: 4,
        description: "Dhananjay",
        amount: -100,
        date: "Dec 15",
        time: "07:10 PM",
        category: "Udhar wadada kiva",
      },
    ],
    credits: [
      { id: 1, description: "sgsdfg", amount: 5000, date: "Jun 29", time: "10:19 PM", category: "qsdfgs" },
      { id: 2, description: "fffwsadf", amount: 255, date: "Jan 07", time: "10:00 PM", category: "asdfasf" },
      {
        id: 3,
        description: "Salary OPO",
        amount: 11900,
        date: "Dec 15",
        time: "06:50 PM",
        category: "Salary on 13 Dec",
      },
    ],
    payments: [
      {
        id: 1,
        description: "Surendra",
        amount: 5000,
        date: "Dec 15",
        time: "07:09 PM",
        details: "Udhar diya 25 tok wapas krega",
      },
    ],
    tasks: [
      { id: 1, title: "Review monthly budget", completed: false },
      { id: 2, title: "Pay electricity bill", completed: true },
      { id: 3, title: "Update expense categories", completed: false },
      { id: 4, title: "Check bank statements", completed: false },
    ],
  })

  const [newTransaction, setNewTransaction] = useState({
    party: "",
    description: "",
    amount: "",
    task: "",
    loan: "",
    type: "debit",
  })

  const balance =
    transactions.credits.reduce((sum, t) => sum + t.amount, 0) +
    transactions.debits.reduce((sum, t) => sum + t.amount, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newTransaction.party || !newTransaction.amount) return

    const transaction = {
      id: Date.now(),
      description: newTransaction.party,
      amount:
        newTransaction.type === "debit"
          ? -Math.abs(Number(newTransaction.amount))
          : Math.abs(Number(newTransaction.amount)),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      category: newTransaction.description || "General",
    }

    if (newTransaction.type === "debit") {
      setTransactions((prev) => ({
        ...prev,
        debits: [transaction, ...prev.debits],
      }))
    } else {
      setTransactions((prev) => ({
        ...prev,
        credits: [transaction, ...prev.credits],
      }))
    }

    setNewTransaction({
      party: "",
      description: "",
      amount: "",
      task: "",
      loan: "",
      type: "debit",
    })
  }

  const toggleTask = (taskId) => {
    setTransactions((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header
      <header className="bg-slate-800/60 backdrop-blur-md border-b border-slate-700/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center shadow-lg">
                <FlameIcon className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-xl italic tracking-wide">Stay Determined!</span>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">
                Home
              </a>
              <a href="#" className="text-slate-300 hover:text-white transition-colors font-medium">
                About
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <span className="text-slate-300 font-medium">Uday Panda</span>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium shadow-lg hover:shadow-xl">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">VitaminM Expense Manager</h1>
          <p className="text-slate-400 text-lg">Track your daily transactions and manage your finances efficiently</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Debit Card */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="bg-red-500/20 px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ArrowDownIcon className="w-4 h-4 text-red-400" />
                  Debit
                </h3>
                <span className="text-red-400 text-sm font-medium">↑</span>
              </div>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
              {transactions.debits.map((transaction) => (
                <div
                  key={transaction.id}
                  className="mb-4 last:mb-0 p-3 bg-red-500/5 rounded-lg border border-red-500/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-300 text-sm font-medium">{transaction.description}</span>
                    <span className="text-red-400 font-bold">{transaction.amount}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1">{transaction.category}</div>
                  <div className="text-xs text-slate-600">
                    {transaction.date} {transaction.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credit Card */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="bg-green-500/20 px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <ArrowUpIcon className="w-4 h-4 text-green-400" />
                  Credit
                </h3>
                <span className="text-green-400 text-sm font-medium">↑</span>
              </div>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
              {transactions.credits.map((transaction) => (
                <div
                  key={transaction.id}
                  className="mb-4 last:mb-0 p-3 bg-green-500/5 rounded-lg border border-green-500/20"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-slate-300 text-sm font-medium">{transaction.description}</span>
                    <span className="text-green-400 font-bold">+{transaction.amount}</span>
                  </div>
                  <div className="text-xs text-slate-500 mb-1">{transaction.category}</div>
                  <div className="text-xs text-slate-600">
                    {transaction.date} {transaction.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Card */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="bg-blue-500/20 px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <CreditCardIcon className="w-4 h-4 text-blue-400" />
                  Payment
                </h3>
                <span className="text-blue-400 text-sm font-medium">↑</span>
              </div>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
              {transactions.payments.map((payment) => (
                <div key={payment.id} className="mb-4 last:mb-0">
                  <div className="bg-blue-500/20 rounded-lg p-3 border border-blue-500/30">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-blue-300 font-medium">{payment.description}</span>
                      <span className="text-blue-400 font-bold">{payment.amount}</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{payment.details}</p>
                    <span className="text-xs text-slate-500">
                      {payment.date}, {payment.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tasks Card */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="bg-purple-500/20 px-4 py-3 border-b border-slate-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <CheckSquareIcon className="w-4 h-4 text-purple-400" />
                  Tasks
                </h3>
                <span className="text-purple-400 text-sm font-medium">↑</span>
              </div>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto custom-scrollbar">
              {transactions.tasks.map((task) => (
                <div key={task.id} className="mb-3 last:mb-0 p-2 rounded-lg hover:bg-purple-500/5 transition-colors">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                      className="w-4 h-4 text-purple-500 bg-slate-700 border-slate-600 rounded focus:ring-purple-500 focus:ring-2"
                    />
                    <span
                      className={`text-sm transition-all ${task.completed ? "text-slate-500 line-through" : "text-slate-300"}`}
                    >
                      {task.title}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-slate-700/50 p-6 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-end">
            {/* Balance Display */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-6 border border-blue-500/30 shadow-lg">
                <h3 className="text-slate-400 text-sm mb-2 font-medium">Balance :</h3>
                <p className="text-4xl font-bold text-white mb-2">{balance}</p>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${balance >= 0 ? "bg-green-400" : "bg-red-400"}`}></div>
                  <p className="text-xs text-slate-400">{balance >= 0 ? "Positive balance" : "Negative balance"}</p>
                </div>
              </div>
            </div>

            {/* Transaction Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">Party:</label>
                    <input
                      type="text"
                      value={newTransaction.party}
                      onChange={(e) => setNewTransaction((prev) => ({ ...prev, party: e.target.value }))}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter party name"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">Task:</label>
                    <input
                      type="text"
                      value={newTransaction.task}
                      onChange={(e) => setNewTransaction((prev) => ({ ...prev, task: e.target.value }))}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Task description"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">Description:</label>
                    <input
                      type="text"
                      value={newTransaction.description}
                      onChange={(e) => setNewTransaction((prev) => ({ ...prev, description: e.target.value }))}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Transaction details"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">Loan:</label>
                    <input
                      type="text"
                      value={newTransaction.loan}
                      onChange={(e) => setNewTransaction((prev) => ({ ...prev, loan: e.target.value }))}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Loan details"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2 font-medium">Amount:</label>
                    <input
                      type="number"
                      value={newTransaction.amount}
                      onChange={(e) => setNewTransaction((prev) => ({ ...prev, amount: e.target.value }))}
                      className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="flex gap-3">
                    <select
                      value={newTransaction.type}
                      onChange={(e) => setNewTransaction((prev) => ({ ...prev, type: e.target.value }))}
                      className="flex-1 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="debit">Debit</option>
                      <option value="credit">Credit</option>
                    </select>
                    <button
                      type="submit"
                      className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium shadow-lg hover:shadow-xl"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(71, 85, 105, 0.3);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.5);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.7);
        }
      `}</style>
    </div>
  )
}
