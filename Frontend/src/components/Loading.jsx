import React from 'react'
import { motion } from 'framer-motion'
import '../index.css'

const Loading = ({ message = "Synchronizing Ledger..." }) => {
  return (
    <div className="loader-container">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.8, 1, 0.8],
          borderRadius: ["20% 80% 20% 80%", "80% 20% 80% 20%", "20% 80% 20% 80%"]
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="loader-pulse"
      />
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        <p className="loader-text">{message}</p>
        <div className="shimmer" style={{ width: '120px', height: '4px', borderRadius: '4px' }}></div>
      </div>
    </div>
  )
}

export const SkeletonCard = () => (
  <div className="card" style={{ padding: '24px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
    <div className="shimmer" style={{ width: '60%', height: '24px', borderRadius: '8px' }}></div>
    <div className="shimmer" style={{ width: '40%', height: '16px', borderRadius: '4px' }}></div>
    <div className="flex-between" style={{ marginTop: '12px' }}>
      <div className="shimmer" style={{ width: '20%', height: '24px', borderRadius: '12px' }}></div>
      <div className="shimmer" style={{ width: '15%', height: '24px', borderRadius: '12px' }}></div>
    </div>
  </div>
)

export default Loading
