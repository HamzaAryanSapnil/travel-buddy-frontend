/* eslint-disable @typescript-eslint/no-explicit-any */
import { getAllUsers } from "@/services/admin/getAllUsers";
import { getUserInfo } from "@/services/auth/getUserInfo";
import UsersTable from "@/components/modules/Admin/UsersTable";
import UsersFilters from "@/components/modules/Admin/UsersFilters";
import AdminPageHeader from "@/components/modules/Admin/AdminPageHeader";
import Pagination from "@/components/shared/Pagination";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminUserFilters } from "@/types/admin.interface";
import { parseSortValue } from "@/lib/formatters";

interface AdminUsersPageProps {
  searchParams: Promise<{
    status?: string;
    role?: string;
    isVerified?: string;
    searchTerm?: string;
    sort?: string;
    page?: string;
    limit?: string;
  }>;
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams;

  // Get current admin ID
  let currentAdminId = "";
  try {
    const userInfo = await getUserInfo();
    currentAdminId = userInfo.id || "";
  } catch (err) {
    console.error("Failed to get current user info:", err);
  }

  // Parse sort value
  const sortValue = params.sort || "createdAt-desc";
  const sort = parseSortValue(sortValue);

  // Build filters object
  const filters: AdminUserFilters = {
    status:
      params.status && params.status !== "all"
        ? (params.status as "ACTIVE" | "SUSPENDED" | "DELETED")
        : undefined,
    role:
      params.role && params.role !== "all"
        ? (params.role as "USER" | "ADMIN")
        : undefined,
    isVerified:
      params.isVerified === "true"
        ? true
        : params.isVerified === "false"
        ? false
        : undefined,
    searchTerm: params.searchTerm,
    sortBy: sort.sortBy,
    sortOrder: sort.sortOrder as "asc" | "desc",
    page: params.page ? parseInt(params.page) : 1,
    limit: params.limit ? parseInt(params.limit) : 20,
  };

  // Fetch users
  let usersData;
  let error: string | null = null;

  try {
    usersData = await getAllUsers(filters);
    if (!usersData.success) {
      error = usersData.message;
    }
  } catch (err: any) {
    error = err.message || "Failed to load users";
    usersData = {
      success: false,
      message: error,
      meta: {
        page: filters.page || 1,
        limit: filters.limit || 20,
        total: 0,
      },
      data: [],
    };
  }

  // Calculate pagination
  const totalPages = Math.ceil(
    (usersData?.meta?.total || 0) / (usersData?.meta?.limit || 20)
  );
  const currentPage = usersData?.meta?.page || 1;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminPageHeader
        title="User Management"
        description="Manage all users in the system"
        stats={[
          {
            label: "Total Users",
            value: usersData?.meta?.total || 0,
          },
        ]}
      />

      {/* Filters */}
      <Suspense fallback={<Skeleton className="h-12 w-full" />}>
        <UsersFilters />
      </Suspense>

      {/* Users Table */}
      <Suspense fallback={<Skeleton className="h-64 w-full" />}>
        <UsersTable
          users={error ? [] : usersData?.data || []}
          error={error}
          currentAdminId={currentAdminId}
        />
      </Suspense>

      {/* Pagination */}
      {!error && totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={usersData?.meta?.total || 0}
            itemsPerPage={filters.limit}
          />
        </div>
      )}
    </div>
  );
}
