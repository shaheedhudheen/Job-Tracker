import React, { useMemo } from 'react';
import { 
  HiBriefcase, 
  HiPaperAirplane, 
  HiChatBubbleLeftRight, 
  HiUsers, 
  HiStar, 
  HiCheckBadge, 
  HiXCircle 
} from 'react-icons/hi2';

export default function DashboardStats({ jobs = [] }) {
  const stats = useMemo(() => {
    return {
      total: jobs.length,
      applied: jobs.filter(j => j.status === 'applied').length,
      got_response: jobs.filter(j => j.status === 'got_response').length,
      interview: jobs.filter(j => j.status === 'interview').length,
      offered: jobs.filter(j => j.status === 'offered').length,
      accepted: jobs.filter(j => j.status === 'accepted').length,
      rejected: jobs.filter(j => j.status === 'rejected').length,
    };
  }, [jobs]);

  const statCards = [
    { label: 'Total Apps', count: stats.total, icon: HiBriefcase, color: 'text-gray-600 dark:text-gray-300', dot: 'bg-gray-500' },
    { label: 'Applied', count: stats.applied, icon: HiPaperAirplane, color: 'text-blue-600 dark:text-blue-400', dot: 'bg-blue-500' },
    { label: 'Response', count: stats.got_response, icon: HiChatBubbleLeftRight, color: 'text-yellow-600 dark:text-yellow-400', dot: 'bg-yellow-500' },
    { label: 'Interview', count: stats.interview, icon: HiUsers, color: 'text-purple-600 dark:text-purple-400', dot: 'bg-purple-500' },
    { label: 'Offered', count: stats.offered, icon: HiStar, color: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-500' },
    { label: 'Accepted', count: stats.accepted, icon: HiCheckBadge, color: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
    { label: 'Rejected', count: stats.rejected, icon: HiXCircle, color: 'text-red-600 dark:text-red-400', dot: 'bg-red-500' },
  ];

  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
      <div className="flex md:grid md:grid-cols-4 lg:grid-cols-7 gap-4 min-w-max md:min-w-0 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div 
              key={index} 
              className="flex flex-col p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm min-w-[140px] md:min-w-0 relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`w-2 h-2 rounded-full ${stat.dot}`} />
              </div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.count}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
