import Navbar from '../components/Navbar';
import { Search, Command } from 'lucide-react';

export default function Registry() {
  const tools = [
    { name: 'Terraform', desc: 'Manage Terraform Cloud/Enterprise workspaces and infrastructure', img: '/placeholder.png' },
    { name: 'GitHub', desc: 'Interact with GitHub repositories, issues, and pull requests', img: '/placeholder.png' },
    { name: 'Azure', desc: 'Manage Azure resources and services', img: '/placeholder.png' },
    { name: 'Docker', desc: 'Manage Docker containers and images locally', img: '/placeholder.png' },
    { name: 'Kubernetes', desc: 'Deploy and manage applications on Kubernetes clusters', img: '/placeholder.png' },
    { name: 'AWS', desc: 'Interact with various AWS services via SDK', img: '/placeholder.png' },
  ];

  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
            <Command size={40} className="text-white" />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Infracodebase Tool Registry</h1>
              <p className="text-zinc-400 text-lg">Model Context Protocol Servers</p>
            </div>
          </div>
          <p className="text-zinc-400 max-w-3xl mt-4 leading-relaxed">
            Browse our curated collection of MCP servers that extend your AI agent's capabilities with cloud provider integrations. Connect AWS, Azure, Google Cloud, and more to your Infracode base enterprise.
          </p>
        </div>

        {/* Callout Banner */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12">
          <div>
            <h3 className="text-white font-medium text-lg">Stop switching between cloud consoles, security systems, and design tools</h3>
            <p className="text-zinc-400">Manage all your cloud infrastructure from one agent-powered workspace</p>
          </div>
          <button className="mt-4 sm:mt-0 bg-white text-black px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors whitespace-nowrap">
            Get Started Free
          </button>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between mb-8 border-b border-zinc-800 pb-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
            <input 
              type="text" 
              placeholder="Search MCP servers..." 
              className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md py-2 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 transition-colors"
            />
          </div>
          <div className="text-zinc-500 text-sm hidden sm:block">
            9 servers
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-[#1a1a1a] border border-zinc-800 rounded-xl p-4 flex flex-col hover:border-zinc-600 transition-colors">
              <div className="h-40 bg-zinc-800/50 rounded-lg mb-6 w-full flex items-center justify-center text-zinc-600 text-sm">
                 {/* Image Placeholder */}
              </div>
              <h3 className="text-white font-medium text-lg">{tool.name}</h3>
              <p className="text-zinc-400 text-sm mt-1 flex-1">{tool.desc}</p>
              <button className="mt-6 w-full bg-white text-black py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
                Add
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
