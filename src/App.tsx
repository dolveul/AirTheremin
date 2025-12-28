import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
        <div className="flex justify-center gap-8 mb-8">
          <a href="https://vite.dev" target="_blank" className="hover:scale-110 transition-transform">
            <img src={viteLogo} className="h-24 w-24 animate-spin-slow" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank" className="hover:scale-110 transition-transform">
            <img src={reactLogo} className="h-24 w-24 animate-spin" alt="React logo" />
          </a>
        </div>
        
        <h1 className="text-5xl font-bold text-gray-800 mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Vite + React
        </h1>
        
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <button 
            onClick={() => setCount((count) => count + 1)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg mb-4"
          >
            count is {count}
          </button>
          <p className="text-gray-600">
            Edit <code className="bg-gray-200 px-2 py-1 rounded text-sm">src/App.tsx</code> and save to test HMR
          </p>
        </div>
        
        <p className="text-gray-500 text-sm">
          Click on the Vite and React logos to learn more
        </p>
      </div>
    </div>
  )
}

export default App
