# AI Multi-Agent System Documentation

## Overview

The Park-Prabandh platform now features a sophisticated **AI Multi-Agent Network Dashboard** that monitors and visualizes the orchestration of 6 specialized AI agents working in harmony to manage the parking facility.

## System Architecture

### Agent Types

#### 1. **Perception Agent** 🟣
- **Role**: Computer Vision & Sensor Processing
- **Responsibilities**:
  - Vehicle detection via camera feeds
  - Anomaly detection (wrong-way driving, unauthorized vehicles)
  - Real-time occupancy monitoring
  - License plate recognition
- **Metrics**: Detection confidence, camera feed status
- **Priority Levels**: High (detections), Medium (routine monitoring)

#### 2. **Allocation Agent** 🔵
- **Role**: Slot Optimization & Distribution
- **Responsibilities**:
  - Optimal slot assignment based on vehicle type and proximity
  - Load balancing across zones
  - VIP/reserved slot management
  - Predictive slot availability
- **Metrics**: Allocation efficiency, optimization rate
- **Priority Levels**: Medium (assignments), Low (optimization runs)

#### 3. **Navigation Agent** 🟢
- **Role**: Route Guidance & LED Control
- **Responsibilities**:
  - LED path activation to assigned slots
  - Route optimization (shortest path)
  - Real-time navigation updates
  - Traffic flow management
- **Metrics**: Average time to slot, route efficiency
- **Priority Levels**: Medium (active guidance), Low (path calculation)

#### 4. **Payment Agent** 🟡
- **Role**: Dynamic Pricing & Transaction Processing
- **Responsibilities**:
  - Real-time price calculation (demand-based)
  - Payment processing and verification
  - Receipt generation
  - Revenue tracking
- **Metrics**: Transaction count, revenue generated
- **Priority Levels**: High (payment failures), Medium (transactions)

#### 5. **Compliance Agent** 🔴
- **Role**: Rule Enforcement & Security
- **Responsibilities**:
  - Overstay violation detection
  - Security breach alerts
  - Rule violation logging
  - Penalty calculation
- **Metrics**: Violation count, response time
- **Priority Levels**: Critical (security breaches), High (violations)

#### 6. **Coordination Agent** 🟣
- **Role**: Central Orchestration (Brain)
- **Responsibilities**:
  - Inter-agent communication and coordination
  - Conflict resolution
  - System-wide decision making
  - Emergency protocol activation
- **Metrics**: Coordination efficiency, conflict resolution rate
- **Priority Levels**: Critical (system conflicts), High (coordination tasks)

---

## Dashboard Features

### 1. Agent Status Cards
- **Real-time Status Indicators**: Active (green), Processing (yellow), Idle (gray)
- **Task Completion Counter**: Total tasks completed by each agent
- **Current Task Display**: Live view of what each agent is currently working on
- **Visual Identification**: Unique icon and color scheme per agent type

### 2. Activity Trends Chart
- **4 Metric Lines**:
  - **Perceptions** (Purple): Vehicle detections and camera events
  - **Allocations** (Blue): Slot assignments and optimizations
  - **Navigations** (Green): Route guidance activations
  - **Payments** (Yellow): Transaction processing events
- **Time-series Analysis**: 6 time points with historical data
- **Interactive Tooltip**: Hover for detailed metrics at each time point

### 3. Performance Stats
- **Perception Stats**: Total detections, average accuracy (96.8%)
- **Allocation Stats**: Total assignments, optimal placement rate (92%)
- **Navigation Stats**: Total guidances, average time to slot (2.1 min)
- **Payment Stats**: Total transactions, total revenue (₹22.4K)

### 4. Live Activity Feed
- **Priority Badges**: Critical (Red), High (Orange), Medium (Blue), Low (Gray)
- **Agent Attribution**: Each activity shows which agent performed it
- **Contextual Details**: Specific information about each activity
  - Perception: "Detected vehicle via Camera #X • Confidence: 98.5%"
  - Allocation: "Optimized distribution Zone-A • 94% efficiency"
  - Navigation: "Activated LED path Gate-2 → B-15 • Route optimized"
  - Payment: "Processed ₹250 via UPI • Transaction #TXN12345"
  - Compliance: "Overstay detected Slot A-05 • 45 minutes over"
  - Coordination: "Resolved slot conflict B-12 • Priority override"
- **Visual Hierarchy**: Critical/High priority activities highlighted with colored backgrounds
- **Real-time Updates**: New activities added every 5 seconds

### 5. Agent Filter
- **All Agents**: View system-wide activity
- **Individual Agent Views**: Filter feed by specific agent type
- **Live Indicator**: Pulsing green badge showing real-time connection status

---

## Technical Implementation

### Data Structures

```typescript
interface ActivityEvent {
  id: number;
  timestamp: string;
  agent: string;
  action: string;
  details: string;
  type: 'perception' | 'allocation' | 'navigation' | 'payment' | 'compliance' | 'coordination';
  priority: 'low' | 'medium' | 'high' | 'critical';
}

interface AgentStatus {
  name: string;
  type: 'perception' | 'allocation' | 'navigation' | 'payment' | 'compliance' | 'coordination';
  status: 'active' | 'processing' | 'idle';
  tasksCompleted: number;
  currentTask: string;
}

interface ActivityMetrics {
  time: string;
  perceptions: number;
  allocations: number;
  navigations: number;
  payments: number;
}
```

### Real-time Generation Logic

The system generates contextual activities based on agent type:

- **Perception Agent Actions**: Vehicle detected, Anomaly detected, Camera feed processed
- **Allocation Agent Actions**: Slot assigned, Zone optimized, Distribution balanced
- **Navigation Agent Actions**: LED activated, Route calculated, Path updated
- **Payment Agent Actions**: Payment processed, Price calculated, Receipt generated
- **Compliance Agent Actions**: Violation detected, Overstay logged, Security alert
- **Coordination Agent Actions**: Conflict resolved, Emergency handled, Agents synchronized

Each action includes:
- Realistic details (camera numbers, slot IDs, amounts, etc.)
- Appropriate priority level based on action type
- Timestamp for chronological ordering
- Agent attribution for traceability

### UI Components

#### Status Color Coding
```typescript
getPriorityColor(priority):
  - critical: Red badge (bg-red-100, text-red-800)
  - high: Orange badge (bg-orange-100, text-orange-800)
  - medium: Blue badge (bg-blue-100, text-blue-800)
  - low: Gray badge (bg-gray-100, text-gray-800)

getStatusColor(status):
  - active: Green dot (bg-green-500) with pulse animation
  - processing: Yellow dot (bg-yellow-500)
  - idle: Gray dot (bg-gray-400)
```

#### Icon System
Each agent type has a unique SVG icon:
- **Perception**: Eye icon (vision/detection)
- **Allocation**: Grid icon (slot distribution)
- **Navigation**: Map icon (routing)
- **Payment**: Currency icon (transactions)
- **Compliance**: Shield icon (security)
- **Coordination**: Lightning icon (orchestration)

---

## Integration Points

### Redux Store Integration
```typescript
// Future integration with websocketSlice
const websocketEvents = useSelector((state: RootState) => state.websocket.agentEvents);

// Future integration with systemSlice  
const systemStatus = useSelector((state: RootState) => state.system.agentStatus);
```

### WebSocket Connection
The component is designed to receive real-time updates from the backend via WebSocket:

```typescript
// Expected WebSocket message format
{
  type: 'AGENT_ACTIVITY',
  payload: {
    agent: 'Perception Agent',
    action: 'Vehicle Detected',
    details: 'Camera #5 • Confidence: 97.2%',
    type: 'perception',
    priority: 'high',
    timestamp: '10:24:15'
  }
}
```

### Backend API Endpoints
```
GET /api/agents/status - Get current status of all agents
GET /api/agents/metrics - Get historical metrics data
GET /api/agents/activities?limit=50 - Get recent activity feed
POST /api/agents/filter - Filter activities by agent type
```

---

## Customization Guide

### Adding New Agent Types

1. **Update ActivityEvent Type**:
```typescript
type: 'perception' | 'allocation' | 'navigation' | 'payment' | 'compliance' | 'coordination' | 'your_new_agent';
```

2. **Add Agent Configuration**:
```typescript
const agentTypes = [
  // ... existing agents
  {
    type: 'your_new_agent',
    actions: ['Action 1', 'Action 2', 'Action 3'],
    details: ['Detail template 1', 'Detail template 2'],
    priorities: ['medium', 'high']
  }
];
```

3. **Add Icon Case**:
```typescript
case 'your_new_agent':
  return (
    <svg className="w-6 h-6 text-your-color-600">
      {/* Your SVG path */}
    </svg>
  );
```

4. **Add to Initial Status**:
```typescript
{
  name: 'Your New Agent',
  type: 'your_new_agent',
  status: 'active',
  tasksCompleted: 0,
  currentTask: 'Initial task'
}
```

### Modifying Priority Logic

To adjust when activities are marked as critical/high priority:

```typescript
// In generateRandomDetails function
const priority = 
  (agent.type === 'compliance' && action.includes('Security')) ? 'critical' :
  (agent.type === 'coordination' && action.includes('Emergency')) ? 'critical' :
  (agent.type === 'perception' && action.includes('Anomaly')) ? 'high' :
  (agent.type === 'your_new_agent' && condition) ? 'high' :
  Math.random() > 0.7 ? 'medium' : 'low';
```

### Changing Update Intervals

```typescript
// Current: 5 second updates
setInterval(() => {
  // Activity generation logic
}, 5000);

// To change: modify the interval value (in milliseconds)
// Example: 3 seconds = 3000, 10 seconds = 10000
```

---

## Performance Optimization

### Current Optimizations
1. **Memoization**: Consider using `useMemo` for filtered activities
2. **Virtualization**: Activity feed scrolls smoothly up to 100 items
3. **Update Batching**: New activities added in batches, not individually
4. **Selective Re-renders**: Only affected components update on state changes

### Recommended Improvements
```typescript
// Memoize filtered activities
const filteredActivities = useMemo(() => {
  return activities.filter(a => 
    selectedAgent === 'all' || a.agent === agents[parseInt(selectedAgent)]
  );
}, [activities, selectedAgent]);

// Virtual scrolling for large activity lists
import { FixedSizeList } from 'react-window';
```

---

## Testing Checklist

- [ ] All 6 agent types display in status cards
- [ ] Status indicators (active/processing/idle) update correctly
- [ ] Priority badges show proper colors (critical=red, high=orange, etc.)
- [ ] Activity feed generates contextual details per agent type
- [ ] Chart displays 4 metric lines (perceptions, allocations, navigations, payments)
- [ ] Agent filter dropdown works for all agents
- [ ] Real-time updates occur every 5 seconds
- [ ] Performance stats pull from agentStatuses array
- [ ] Icons display correctly for each agent type
- [ ] Hover effects work on status cards and activity items
- [ ] Critical/High priority activities have colored backgrounds
- [ ] Scroll behavior smooth in activity feed
- [ ] Live indicator pulses continuously
- [ ] No TypeScript compilation errors
- [ ] No console errors in browser

---

## Future Enhancements

### Phase 1: Backend Integration
- [ ] Connect to WebSocket service for real-time data
- [ ] Integrate with Redux websocketSlice
- [ ] Implement actual API endpoints for agent data
- [ ] Add authentication for agent commands

### Phase 2: Advanced Features
- [ ] Agent performance trends over 24 hours
- [ ] Agent health monitoring and alerts
- [ ] Manual agent control (restart, pause, configure)
- [ ] Agent communication visualization (network graph)
- [ ] Historical activity search and filtering
- [ ] Export activity logs to CSV/PDF

### Phase 3: AI/ML Integration
- [ ] Predictive analytics for agent performance
- [ ] Anomaly detection in agent behavior
- [ ] Auto-scaling based on load
- [ ] Machine learning model performance tracking

---

## Troubleshooting

### Issue: Activities not updating
**Solution**: Check if `setInterval` is running. Verify state updates in React DevTools.

### Issue: Priority badges not showing colors
**Solution**: Ensure `getPriorityColor` function is called and returns valid Tailwind classes.

### Issue: Agent filter not working
**Solution**: Verify `selectedAgent` state and `filteredActivities` logic.

### Issue: Chart not displaying metrics
**Solution**: Check `metrics` state array has correct data structure with `perceptions`, `allocations`, `navigations`, `payments` keys.

### Issue: Status cards showing 0 tasks
**Solution**: Verify `agentStatuses` array is properly initialized and updated by interval function.

---

## Component File Location
`/frontend/src/components/admin/AgentActivityGraph.tsx`

## Dependencies
- React 18.2.0
- Recharts (LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line)
- Tailwind CSS (for styling)

## Related Documentation
- [3D Parking Map Documentation](./3D_PARKING_MAP_DOCUMENTATION.md)
- [Admin Dashboard Overview](./PROJECT_STATUS.md)
- [WebSocket Service Integration](../src/services/websocketService.ts)

---

**Last Updated**: January 2025  
**Version**: 2.0.0  
**Author**: Park-Prabandh Development Team
