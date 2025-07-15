import React from 'react';
import { 
  Card, 
  CardBody, 
  CardHeader,
  Button,
  Chip,
  Progress,
  Avatar,
  AvatarGroup,
  Divider
} from '@heroui/react';
import { useTheme } from '../../components/providers/ThemeProvider';

export default function DarkThemePage() {
  const { theme, toggleTheme } = useTheme();

  const stats = [
    { label: 'Total Projects', value: '24', change: '+12%', color: 'success' },
    { label: 'Active Tasks', value: '156', change: '+8%', color: 'primary' },
    { label: 'Team Members', value: '12', change: '+2%', color: 'secondary' },
    { label: 'Completed', value: '89%', change: '+5%', color: 'warning' },
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'Student Hotel Management',
      status: 'In Progress',
      progress: 75,
      team: ['JD', 'AS', 'MK'],
      dueDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Finance Dashboard',
      status: 'Planning',
      progress: 25,
      team: ['AS', 'LM'],
      dueDate: '2024-02-01'
    },
    {
      id: 3,
      name: 'Customer Portal',
      status: 'Review',
      progress: 90,
      team: ['JD', 'AS', 'MK', 'LM'],
      dueDate: '2024-01-10'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'primary';
      case 'Planning': return 'warning';
      case 'Review': return 'success';
      case 'Completed': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-dark-text-primary">Dashboard</h1>
          <p className="text-dark-text-secondary mt-1">Welcome back! Here's what's happening with your projects.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="bordered"
            onPress={toggleTheme}
            className="border-dark-bg-tertiary text-dark-text-secondary hover:text-dark-text-primary"
          >
            {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </Button>
          <Button color="primary">
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-dark-bg-secondary border-dark-bg-tertiary">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-dark-text-tertiary">{stat.label}</p>
                  <p className="text-2xl font-bold text-dark-text-primary mt-1">{stat.value}</p>
                </div>
                <Chip 
                  size="sm" 
                  color={stat.color as any}
                  variant="flat"
                >
                  {stat.change}
                </Chip>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card className="bg-dark-bg-secondary border-dark-bg-tertiary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between w-full">
                <h3 className="text-lg font-semibold text-dark-text-primary">Recent Projects</h3>
                <Button variant="light" size="sm" className="text-dark-text-secondary">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-4 rounded-lg bg-dark-bg-primary border border-dark-bg-tertiary">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-dark-text-primary">{project.name}</h4>
                        <p className="text-sm text-dark-text-tertiary">Due: {project.dueDate}</p>
                      </div>
                      <Chip 
                        size="sm" 
                        color={getStatusColor(project.status) as any}
                        variant="flat"
                      >
                        {project.status}
                      </Chip>
                    </div>
                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-dark-text-secondary">Progress</span>
                        <span className="text-sm text-dark-text-secondary">{project.progress}%</span>
                      </div>
                      <Progress 
                        value={project.progress} 
                        color="primary"
                        size="sm"
                        className="max-w-full"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <AvatarGroup size="sm" max={3}>
                        {project.team.map((member, idx) => (
                          <Avatar key={idx} name={member} size="sm" />
                        ))}
                      </AvatarGroup>
                      <Button variant="light" size="sm" className="text-dark-text-secondary">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Activity Feed */}
        <div>
          <Card className="bg-dark-bg-secondary border-dark-bg-tertiary">
            <CardHeader className="pb-3">
              <h3 className="text-lg font-semibold text-dark-text-primary">Recent Activity</h3>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Avatar size="sm" name="JD" className="bg-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-text-primary">
                      <span className="font-medium">John Doe</span> completed task "Database Setup"
                    </p>
                    <p className="text-xs text-dark-text-tertiary">2 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Avatar size="sm" name="AS" className="bg-green-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-text-primary">
                      <span className="font-medium">Anna Smith</span> created new project "Finance Dashboard"
                    </p>
                    <p className="text-xs text-dark-text-tertiary">4 hours ago</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Avatar size="sm" name="MK" className="bg-purple-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-dark-text-primary">
                      <span className="font-medium">Mike Kim</span> updated project status
                    </p>
                    <p className="text-xs text-dark-text-tertiary">6 hours ago</p>
                  </div>
                </div>

                <Divider className="bg-dark-bg-tertiary" />

                <div className="text-center">
                  <Button variant="light" size="sm" className="text-dark-text-secondary">
                    View All Activity
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card className="bg-dark-bg-secondary border-dark-bg-tertiary">
        <CardHeader>
          <h3 className="text-lg font-semibold text-dark-text-primary">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button 
              variant="bordered" 
              className="h-20 flex-col border-dark-bg-tertiary text-dark-text-secondary hover:text-dark-text-primary"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              New Project
            </Button>
            <Button 
              variant="bordered" 
              className="h-20 flex-col border-dark-bg-tertiary text-dark-text-secondary hover:text-dark-text-primary"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add Team
            </Button>
            <Button 
              variant="bordered" 
              className="h-20 flex-col border-dark-bg-tertiary text-dark-text-secondary hover:text-dark-text-primary"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              View Reports
            </Button>
            <Button 
              variant="bordered" 
              className="h-20 flex-col border-dark-bg-tertiary text-dark-text-secondary hover:text-dark-text-primary"
            >
              <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
