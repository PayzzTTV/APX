'use client'

import { motion } from 'framer-motion'
import { Users, Car, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'

const iconMap = {
  users: Users,
  car: Car,
  calendar: Calendar,
  checkCircle: CheckCircle,
  xCircle: XCircle,
  clock: Clock,
}

interface StatCardProps {
  title: string
  value: string | number
  iconName: keyof typeof iconMap
  trend?: {
    value: number
    isPositive: boolean
  }
  delay?: number
}

export default function StatCard({ title, value, iconName, trend, delay = 0 }: StatCardProps) {
  const Icon = iconMap[iconName]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-[#1a1a1a] rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-500/10 rounded-lg">
          <Icon className="w-6 h-6 text-blue-400" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-sm font-semibold ${
            trend.isPositive ? 'text-green-400' : 'text-red-400'
          }`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </motion.div>
  )
}
