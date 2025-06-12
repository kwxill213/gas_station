'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Users, MessageSquare } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useData } from '@/lib/hooks/useData';

interface DashboardStats {
  totalStations: number;
  totalUsers: number;
  newReviews: number;
  totalTickets: number;
}

interface RecentReview {
  id: number;
  userId: number;
  stationId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Activity {
  id: number;
  type: string;
  description: string;
  date: string;
}

interface User {
  id: number;
  name: string;
}

interface Station {
  id: number;
  name: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalStations: 0,
    totalUsers: 0,
    newReviews: 0,
    totalTickets: 0
  });
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const { data: stations = [], fetchData: fetchStationsRaw } = useData<Station>({ endpoint: 'gasStations' });
  const { data: users = [], fetchData: fetchUsersRaw } = useData<User>({ endpoint: 'users' });
  const { data: reviews = [], fetchData: fetchReviewsRaw } = useData<RecentReview>({ endpoint: 'reviews' });
  const { data: tickets = [], fetchData: fetchTicketsRaw } = useData({ endpoint: 'supportTickets' });

  const fetchStations = useCallback(fetchStationsRaw, []);
  const fetchUsers = useCallback(fetchUsersRaw, []);
  const fetchReviews = useCallback(fetchReviewsRaw, []);
  const fetchTickets = useCallback(fetchTicketsRaw, []);

  useEffect(() => {
    let isMounted = true;

    const fetchInitialData = async () => {
      try {
        if (isMounted) setIsLoading(true);
        await Promise.all([
          fetchStations(),
          fetchUsers(),
          fetchReviews(),
          fetchTickets()
        ]);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, [fetchStations, fetchUsers, fetchReviews, fetchTickets]);

  useEffect(() => {
    if (!isLoading) {
      setStats({
        totalStations: stations.length,
        totalUsers: users.length,
        newReviews: reviews.filter(review => {
          const reviewDate = new Date(review.createdAt);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return reviewDate >= weekAgo;
        }).length,
        totalTickets: tickets.length
      });

      const sortedReviews = [...reviews]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentReviews(sortedReviews);

      const newActivities: Activity[] = [];

      sortedReviews.slice(0, 3).forEach(review => {
        newActivities.push({
          id: review.id,
          type: 'review',
          description: `Новый отзыв от пользователя`,
          date: new Date(review.createdAt).toLocaleDateString()
        });
      });

      const recentTickets = [...tickets]
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2);

      recentTickets.forEach((ticket: any) => {
        newActivities.push({
          id: ticket.id,
          type: 'ticket',
          description: `Новое обращение: ${ticket.subject}`,
          date: new Date(ticket.createdAt).toLocaleDateString()
        });
      });

      setActivities(newActivities);
    }
  }, [isLoading, stations, users, reviews, tickets]);

  const statsCards = [
    {
      title: 'Всего АЗС',
      value: stats.totalStations.toString(),
      icon: MapPin,
      description: 'Активных станций'
    },
    {
      title: 'Пользователи',
      value: stats.totalUsers.toString(),
      icon: Users,
      description: 'Зарегистрированных'
    },
    {
      title: 'Отзывы',
      value: stats.newReviews.toString(),
      icon: MessageSquare,
      description: 'Новых за неделю'
    },
    {
      title: 'Обращения',
      value: stats.totalTickets.toString(),
      icon: MessageSquare,
      description: 'Всего обращений'
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Панель управления</h1>
        <p className="text-muted-foreground">
          Добро пожаловать в панель управления АЗС
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Последние отзывы</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentReviews.length > 0 ? (
                recentReviews.map((review) => (
                  <div key={review.id} className="flex items-start space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Оценка: {review.rating}/5
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {review.comment}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Нет отзывов</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Активность</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4">
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Нет активностей</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
