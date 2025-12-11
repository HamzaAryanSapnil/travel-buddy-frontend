import { getNotifications } from "@/services/notifications/getNotifications";
import NotificationsList from "@/components/modules/Notifications/NotificationsList";
import NotificationsFilters from "@/components/modules/Notifications/NotificationsFilters";
import NotificationActions from "@/components/modules/Notifications/NotificationActions";
import Pagination from "@/components/shared/Pagination";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface NotificationsPageProps {
  searchParams: Promise<{
    filter?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function NotificationsPage({
  searchParams,
}: NotificationsPageProps) {
  const params = await searchParams;

  // Build filters object
  const filter = params.filter || "all";
  const isReadFilter =
    filter === "unread" ? false : filter === "read" ? true : undefined;

  const filters = {
    isRead: isReadFilter,
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 20,
  };

  // Fetch notifications
  let notificationsData;
  let error: string | null = null;

  try {
    notificationsData = await getNotifications(filters);
    if (!notificationsData.success) {
      error = notificationsData.message;
    }
  } catch (err: any) {
    error = err.message || "Failed to load notifications";
    notificationsData = {
      success: false,
      message: error,
      meta: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: 0,
        totalPages: 0,
      },
      data: [],
    };
  }

  // Calculate pagination
  const totalPages = Math.ceil(
    (notificationsData?.meta?.total || 0) / (notificationsData?.meta?.limit || 20)
  );
  const currentPage = notificationsData?.meta?.page || 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            View and manage your notifications
          </p>
        </div>
        <NotificationActions />
      </div>

      {/* Filters */}
      <Suspense fallback={<Skeleton className="h-10 w-full" />}>
        <NotificationsFilters />
      </Suspense>

      {/* Notifications List */}
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <NotificationsList
          notifications={error ? [] : notificationsData?.data || []}
          error={error}
        />
      </Suspense>

      {/* Pagination */}
      {!error && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={notificationsData?.meta?.total || 0}
            itemsPerPage={filters.limit}
          />
        </div>
      )}
    </div>
  );
}

