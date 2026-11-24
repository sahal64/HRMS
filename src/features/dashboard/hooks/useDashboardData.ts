import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { useOrganization } from '@/app/providers/OrganizationContext';

export const useDashboardData = () => {
  const { currentOrganization } = useOrganization();
  const orgId = currentOrganization.id;

  const metricsQuery = useQuery({
    queryKey: ['dashboard', 'metrics', orgId],
    queryFn: () => dashboardService.getMetrics(orgId),
  });

  const pendingTasksQuery = useQuery({
    queryKey: ['dashboard', 'tasks', orgId],
    queryFn: () => dashboardService.getPendingTasks(orgId),
  });

  const upcomingEventsQuery = useQuery({
    queryKey: ['dashboard', 'events', orgId],
    queryFn: () => dashboardService.getUpcomingEvents(orgId),
  });

  const trendsQuery = useQuery({
    queryKey: ['dashboard', 'trends', orgId],
    queryFn: () => dashboardService.getWorkforceTrends(orgId),
  });

  return {
    metrics: metricsQuery.data,
    isLoadingMetrics: metricsQuery.isLoading,
    pendingTasks: pendingTasksQuery.data || [],
    isLoadingTasks: pendingTasksQuery.isLoading,
    upcomingEvents: upcomingEventsQuery.data || [],
    isLoadingEvents: upcomingEventsQuery.isLoading,
    trends: trendsQuery.data || [],
    isLoadingTrends: trendsQuery.isLoading,
  };
};
