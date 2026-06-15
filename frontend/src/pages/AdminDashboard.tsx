import { motion } from 'framer-motion';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h3 className="text-zinc-400 font-medium mb-2">Total Users</h3>
          <p className="text-3xl font-bold">12,403</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h3 className="text-zinc-400 font-medium mb-2">Active Sessions</h3>
          <p className="text-3xl font-bold text-green-500">1,204</p>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="p-6 bg-zinc-900 rounded-2xl border border-zinc-800">
          <h3 className="text-zinc-400 font-medium mb-2">Pending Reports</h3>
          <p className="text-3xl font-bold text-red-500">45</p>
        </motion.div>
      </div>

      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
        <div className="p-6 border-b border-zinc-800">
          <h2 className="text-xl font-semibold">Recent Reports</h2>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center py-4 border-b border-zinc-800/50">
            <div>
              <p className="font-medium">User #8349 reported User #1023</p>
              <p className="text-sm text-zinc-500">Reason: Inappropriate behavior</p>
            </div>
            <div className="space-x-2">
              <button className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">Ban User</button>
              <button className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">Dismiss</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
