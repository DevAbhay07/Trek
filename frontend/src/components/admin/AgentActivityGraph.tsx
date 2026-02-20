import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ActivityEvent {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
  type: 'perception' | 'allocation' | 'navigation' | 'payment' | 'compliance' | 'coordination';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface ActivityMetrics {
  time: string;
  perceptions: number;
  allocations: number;
  navigations: number;
  payments: number;
}

interface AgentStatus {
  name: string;
  type: 'perception' | 'allocation' | 'navigation' | 'payment' | 'compliance' | 'coordination';
  status: 'active' | 'idle' | 'processing';
  tasksCompleted: number;
  currentTask: string;
}

const AgentActivityGraph = () => {
  const [activities, setActivities] = useState<ActivityEvent[]>([]);
  const [metrics, setMetrics] = useState<ActivityMetrics[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [agentStatuses, setAgentStatuses] = useState<AgentStatus[]>([]);

  // AI Agent System Architecture
  const agents = [
    'All Agents',
    'Perception Agent',
    'Allocation Agent', 
    'Navigation Agent',
    'Payment Agent',
    'Compliance Agent',
    'Coordination Agent'
  ];

  // Generate initial mock data for AI Multi-Agent System
  useEffect(() => {
    const initialActivities: ActivityEvent[] = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 300000).toLocaleTimeString(),
        agent: 'Perception Agent',
        action: 'Vehicle Detection',
        details: 'Detected vehicle DL01AB1234 via Camera #3 • Confidence: 98.5%',
        type: 'perception',
        priority: 'high'
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 240000).toLocaleTimeString(),
        agent: 'Allocation Agent',
        action: 'Slot Optimization',
        details: 'Allocated Slot A-12 based on proximity and availability analysis',
        type: 'allocation',
        priority: 'medium'
      },
      {
        id: '3',
        timestamp: new Date(Date.now() - 180000).toLocaleTimeString(),
        agent: 'Navigation Agent',
        action: 'Route Guidance',
        details: 'Activated LED path Zone-B → Slot A-12 • Congestion avoided',
        type: 'navigation',
        priority: 'medium'
      },
      {
        id: '4',
        timestamp: new Date(Date.now() - 120000).toLocaleTimeString(),
        agent: 'Payment Agent',
        action: 'Dynamic Pricing',
        details: 'Computed price ₹180 (Base: ₹150 + Peak: 20%) • Transaction validated',
        type: 'payment',
        priority: 'high'
      },
      {
        id: '5',
        timestamp: new Date(Date.now() - 90000).toLocaleTimeString(),
        agent: 'Compliance Agent',
        action: 'Rule Enforcement',
        details: 'Detected unauthorized parking in Slot C-08 • Penalty applied',
        type: 'compliance',
        priority: 'critical'
      },
      {
        id: '6',
        timestamp: new Date(Date.now() - 60000).toLocaleTimeString(),
        agent: 'Coordination Agent',
        action: 'Conflict Resolution',
        details: 'Resolved double-booking conflict • Reassigned Slot B-15',
        type: 'coordination',
        priority: 'critical'
      }
    ];

    const initialMetrics: ActivityMetrics[] = [
      { time: '10:00', perceptions: 145, allocations: 98, navigations: 102, payments: 95 },
      { time: '11:00', perceptions: 198, allocations: 132, navigations: 135, payments: 128 },
      { time: '12:00', perceptions: 256, allocations: 178, navigations: 182, payments: 175 },
      { time: '13:00', perceptions: 223, allocations: 156, navigations: 160, payments: 154 },
      { time: '14:00', perceptions: 189, allocations: 124, navigations: 128, payments: 122 },
      { time: '15:00', perceptions: 167, allocations: 108, navigations: 112, payments: 106 },
    ];

    const initialStatuses: AgentStatus[] = [
      {
        name: 'Perception Agent',
        type: 'perception',
        status: 'active',
        tasksCompleted: 1248,
        currentTask: 'Processing Camera #7 feed'
      },
      {
        name: 'Allocation Agent',
        type: 'allocation',
        status: 'active',
        tasksCompleted: 856,
        currentTask: 'Optimizing Zone-A distribution'
      },
      {
        name: 'Navigation Agent',
        type: 'navigation',
        status: 'processing',
        tasksCompleted: 892,
        currentTask: 'Updating LED path matrix'
      },
      {
        name: 'Payment Agent',
        type: 'payment',
        status: 'active',
        tasksCompleted: 834,
        currentTask: 'Validating transaction #12456'
      },
      {
        name: 'Compliance Agent',
        type: 'compliance',
        status: 'idle',
        tasksCompleted: 234,
        currentTask: 'Monitoring slot integrity'
      },
      {
        name: 'Coordination Agent',
        type: 'coordination',
        status: 'active',
        tasksCompleted: 567,
        currentTask: 'Orchestrating multi-zone balance'
      }
    ];

    setActivities(initialActivities);
    setMetrics(initialMetrics);
    setAgentStatuses(initialStatuses);

    // Simulate real-time AI agent updates
    const interval = setInterval(() => {
      const agentTypes: Array<{name: string, type: ActivityEvent['type'], actions: string[], priorities: ActivityEvent['priority'][]}> = [
        {
          name: 'Perception Agent',
          type: 'perception',
          actions: ['Vehicle Detection', 'Anomaly Detection', 'Sensor Data Processing', 'Camera Analysis'],
          priorities: ['high', 'medium', 'high']
        },
        {
          name: 'Allocation Agent',
          type: 'allocation',
          actions: ['Slot Optimization', 'Dynamic Distribution', 'Availability Analysis', 'Zone Balancing'],
          priorities: ['medium', 'high', 'medium']
        },
        {
          name: 'Navigation Agent',
          type: 'navigation',
          actions: ['Route Guidance', 'LED Path Update', 'Congestion Avoidance', 'User Direction'],
          priorities: ['medium', 'low', 'high']
        },
        {
          name: 'Payment Agent',
          type: 'payment',
          actions: ['Dynamic Pricing', 'Transaction Validation', 'Slot Integrity Check', 'Payment Processing'],
          priorities: ['high', 'high', 'medium']
        },
        {
          name: 'Compliance Agent',
          type: 'compliance',
          actions: ['Rule Enforcement', 'Penalty Application', 'Violation Detection', 'Adherence Check'],
          priorities: ['critical', 'high', 'medium']
        },
        {
          name: 'Coordination Agent',
          type: 'coordination',
          actions: ['Conflict Resolution', 'Agent Orchestration', 'System Balance', 'Multi-Zone Coordination'],
          priorities: ['critical', 'high', 'critical']
        }
      ];

      const randomAgent = agentTypes[Math.floor(Math.random() * agentTypes.length)];
      const randomAction = randomAgent.actions[Math.floor(Math.random() * randomAgent.actions.length)];
      const randomPriority = randomAgent.priorities[Math.floor(Math.random() * randomAgent.priorities.length)];

      const newActivity: ActivityEvent = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        agent: randomAgent.name,
        action: randomAction,
        details: generateRandomDetails(randomAgent.type, randomAction),
        type: randomAgent.type,
        priority: randomPriority
      };

      setActivities(prev => [newActivity, ...prev.slice(0, 19)]);
      
      // Update agent statuses randomly
      setAgentStatuses(prev => prev.map(agent => {
        if (Math.random() > 0.7) {
          return {
            ...agent,
            tasksCompleted: agent.tasksCompleted + 1,
            status: ['active', 'processing', 'idle'][Math.floor(Math.random() * 3)] as any
          };
        }
        return agent;
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const generateRandomDetails = (type: ActivityEvent['type'], action: string): string => {
    const vehicleId = `DL0${Math.floor(Math.random() * 9)}AB${Math.floor(Math.random() * 9999)}`;
    const slot = `${String.fromCharCode(65 + Math.floor(Math.random() * 5))}-${Math.floor(Math.random() * 20) + 1}`;
    const camera = Math.floor(Math.random() * 12) + 1;
    const confidence = (Math.random() * 5 + 95).toFixed(1);
    const price = Math.floor(Math.random() * 200) + 100;
    const zone = String.fromCharCode(65 + Math.floor(Math.random() * 4));

    const detailsMap: Record<ActivityEvent['type'], string[]> = {
      perception: [
        `Detected vehicle ${vehicleId} via Camera #${camera} • Confidence: ${confidence}%`,
        `Anomaly detected in Zone-${zone} • Sensor alert triggered`,
        `Processing 4K feed from Camera #${camera} • 15 vehicles tracked`,
        `Slot occupancy verified via CV analysis • Accuracy: ${confidence}%`
      ],
      allocation: [
        `Allocated Slot ${slot} based on proximity algorithm • ETA: 2 min`,
        `Optimized distribution: Zone-${zone} now at 72% capacity`,
        `Dynamic reallocation: 3 slots freed in high-demand area`,
        `Predicted occupancy for next hour: 85% • Slots reserved`
      ],
      navigation: [
        `Activated LED path Zone-${zone} → Slot ${slot} • Route optimized`,
        `Updated mobile interface with turn-by-turn guidance`,
        `Congestion detected in Zone-${zone} • Alternate route suggested`,
        `LED matrix updated: 12 paths recalculated for efficiency`
      ],
      payment: [
        `Computed price ₹${price} (Base + Peak: 20%) • FASTag validated`,
        `Transaction #${Math.floor(Math.random() * 99999)} verified • UPI successful`,
        `Dynamic pricing adjusted: Off-peak discount 15% applied`,
        `Slot integrity validated • Payment gateway synchronized`
      ],
      compliance: [
        `Unauthorized parking detected in Slot ${slot} • Penalty ₹500 applied`,
        `Rule violation: Vehicle ${vehicleId} exceeded time limit`,
        `Enforcement action: Slot ${slot} marked for towing`,
        `Adherence check passed: Zone-${zone} compliance rate 96%`
      ],
      coordination: [
        `Resolved double-booking conflict • Slot ${slot} reassigned`,
        `Orchestrated 5 agents for Zone-${zone} optimization`,
        `System balance achieved: All zones at 68-75% capacity`,
        `Multi-agent conflict resolved • 3 tasks reprioritized`
      ]
    };

    const details = detailsMap[type];
    return details[Math.floor(Math.random() * details.length)];
  };

  const getActivityIcon = (type: ActivityEvent['type']) => {
    switch (type) {
      case 'perception':
        return (
          <div className="p-2 bg-purple-100 rounded-lg">
            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        );
      case 'allocation':
        return (
          <div className="p-2 bg-blue-100 rounded-lg">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </div>
        );
      case 'navigation':
        return (
          <div className="p-2 bg-green-100 rounded-lg">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        );
      case 'payment':
        return (
          <div className="p-2 bg-yellow-100 rounded-lg">
            <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        );
      case 'compliance':
        return (
          <div className="p-2 bg-red-100 rounded-lg">
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
        );
      case 'coordination':
        return (
          <div className="p-2 bg-indigo-100 rounded-lg">
            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  const filteredActivities = selectedAgent === 'all' 
    ? activities 
    : activities.filter(a => a.agent === selectedAgent);

  const getPriorityColor = (priority: ActivityEvent['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusColor = (status: AgentStatus['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'processing': return 'bg-yellow-500';
      case 'idle': return 'bg-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🤖 Multi-Agent Network Dashboard</h2>
          <p className="text-sm text-gray-600 mt-1">Real-time AI agent orchestration and activity monitoring</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          >
            {agents.map((agent, idx) => (
              <option key={idx} value={idx === 0 ? 'all' : agent}>{agent}</option>
            ))}
          </select>
          <div className="flex items-center space-x-2 px-3 py-2 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-green-700">Live</span>
          </div>
        </div>
      </div>

      {/* Agent Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {agentStatuses.filter(agent => agent.name !== 'All Agents').map((agent, idx) => {
          const agentIcon = getActivityIcon(agent.type);
          const statusColorClass = getStatusColor(agent.status);
          
          return (
            <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    agent.type === 'perception' ? 'bg-purple-100' :
                    agent.type === 'allocation' ? 'bg-blue-100' :
                    agent.type === 'navigation' ? 'bg-green-100' :
                    agent.type === 'payment' ? 'bg-yellow-100' :
                    agent.type === 'compliance' ? 'bg-red-100' :
                    'bg-indigo-100'
                  }`}>
                    {agentIcon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{agent.name}</h4>
                    <p className="text-xs text-gray-500 capitalize">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${statusColorClass} ${agent.status === 'active' ? 'animate-pulse' : ''}`}></div>
                  <span className="text-xs font-medium text-gray-600 capitalize">{agent.status}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Tasks Completed</span>
                  <span className="text-sm font-bold text-gray-900">{agent.tasksCompleted}</span>
                </div>
                <div className="bg-white rounded p-2 border border-gray-200">
                  <p className="text-xs text-gray-700 font-medium">Current Task:</p>
                  <p className="text-xs text-gray-600 mt-1">{agent.currentTask}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Metrics Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Trends</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px' }} />
            <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Line 
              type="monotone" 
              dataKey="perceptions" 
              stroke="#9333ea" 
              strokeWidth={2}
              name="Perceptions"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="allocations" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Allocations"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="navigations" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Navigations"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="payments" 
              stroke="#f59e0b" 
              strokeWidth={2}
              name="Payments"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Agent Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700 font-medium">Perceptions</p>
              <p className="text-2xl font-bold text-purple-900">{agentStatuses.find(a => a.type === 'perception')?.tasksCompleted || 0}</p>
              <p className="text-xs text-purple-600 mt-1">Avg: 96.8% accuracy</p>
            </div>
            <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700 font-medium">Allocations</p>
              <p className="text-2xl font-bold text-blue-900">{agentStatuses.find(a => a.type === 'allocation')?.tasksCompleted || 0}</p>
              <p className="text-xs text-blue-600 mt-1">92% optimal placement</p>
            </div>
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700 font-medium">Navigations</p>
              <p className="text-2xl font-bold text-green-900">{agentStatuses.find(a => a.type === 'navigation')?.tasksCompleted || 0}</p>
              <p className="text-xs text-green-600 mt-1">Avg: 2.1 min to slot</p>
            </div>
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-yellow-700 font-medium">Payments</p>
              <p className="text-2xl font-bold text-yellow-900">{agentStatuses.find(a => a.type === 'payment')?.tasksCompleted || 0}</p>
              <p className="text-xs text-yellow-600 mt-1">₹22.4K revenue</p>
            </div>
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        </div>
      </div>

      {/* Real-time Activity Feed */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Activity Feed</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
          {filteredActivities.map((activity) => {
            const priorityBadge = getPriorityColor(activity.priority);
            
            return (
              <div 
                key={activity.id}
                className={`flex items-start space-x-3 p-3 rounded-lg border ${
                  activity.priority === 'critical' ? 'border-red-300 bg-red-50' :
                  activity.priority === 'high' ? 'border-orange-200 bg-orange-50' :
                  'border-gray-200 hover:bg-gray-50'
                } transition-colors`}
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-semibold text-gray-900">{activity.action}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge}`}>
                        {activity.priority.toUpperCase()}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">{activity.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{activity.details}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">Agent:</span> {activity.agent}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default AgentActivityGraph;
