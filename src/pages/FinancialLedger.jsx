import { useStore } from '../store';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const FinancialLedger = () => {
  const { financialLedger } = useStore();
  const { totalCollected, expenditures } = financialLedger;

  const totalSpent = expenditures.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingFunds = totalCollected - totalSpent;
  const percentSpent = Math.min((totalSpent / totalCollected) * 100, 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background flex flex-col font-inter text-dark">
      <Navbar />

      <main className="flex-grow pt-24 pb-12 px-6 lg:px-12 max-w-7xl mx-auto w-full">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/10 p-2 rounded-xl text-primary">
              <TrendingUp size={24} />
            </span>
            <h1 className="text-4xl lg:text-5xl font-outfit font-bold tracking-tight text-dark">
              Financial Transparency Ledger
            </h1>
          </div>
          <p className="text-dark/60 text-lg max-w-2xl">
            We believe in 100% transparency. Track exactly how much cash has been donated and how every peso is being utilized to support our operations.
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[2rem] p-8 border border-dark/5 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10" />
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-dark/60 font-medium">Total Collected</h3>
              <ArrowUpRight className="text-green-500" size={24} />
            </div>
            <p className="text-4xl font-outfit font-bold">₱{totalCollected.toLocaleString()}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2rem] p-8 border border-dark/5 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-[100px] -z-10" />
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-dark/60 font-medium">Total Expenditures</h3>
              <ArrowDownRight className="text-accent" size={24} />
            </div>
            <p className="text-4xl font-outfit font-bold">₱{totalSpent.toLocaleString()}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-dark rounded-[2rem] p-8 border border-dark shadow-sm text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -z-10" />
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-white/60 font-medium">Remaining Funds</h3>
              <DollarSign className="text-white/80" size={24} />
            </div>
            <p className="text-4xl font-outfit font-bold">₱{remainingFunds.toLocaleString()}</p>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[2rem] p-8 border border-dark/5 shadow-sm mb-12"
        >
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-xl font-bold font-outfit">Fund Utilization</h3>
              <p className="text-dark/60 text-sm">Percentage of funds deployed</p>
            </div>
            <span className="text-2xl font-bold text-primary">{percentSpent}%</span>
          </div>
          <div className="w-full h-4 bg-dark/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentSpent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-primary"
            />
          </div>
        </motion.div>

        {/* Expenditures Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold font-outfit mb-6">Recent Expenditures</h3>
          
          {expenditures.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-12 text-center border border-dark/5 shadow-sm">
              <p className="text-dark/50">No expenditures recorded yet.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[2rem] overflow-hidden border border-dark/5 shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-dark/5">
                      <th className="p-6 font-medium text-dark/60 border-b border-dark/10">Date</th>
                      <th className="p-6 font-medium text-dark/60 border-b border-dark/10">Description</th>
                      <th className="p-6 font-medium text-dark/60 border-b border-dark/10 text-right">Amount</th>
                      <th className="p-6 font-medium text-dark/60 border-b border-dark/10 text-center">Receipt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenditures.map((exp, idx) => (
                      <tr key={exp.id} className={idx !== expenditures.length - 1 ? "border-b border-dark/5" : ""}>
                        <td className="p-6 text-dark/80 whitespace-nowrap">{new Date(exp.date).toLocaleDateString()}</td>
                        <td className="p-6 font-medium">{exp.description}</td>
                        <td className="p-6 text-right font-bold text-accent">
                          -₱{exp.amount.toLocaleString()}
                        </td>
                        <td className="p-6 text-center">
                          {exp.receiptUrl !== '#' ? (
                            <a href={exp.receiptUrl} className="text-primary hover:underline text-sm font-medium">View</a>
                          ) : (
                            <span className="text-dark/40 text-sm">On File</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </motion.div>

      </main>

      <Footer />
    </div>
  );
};
