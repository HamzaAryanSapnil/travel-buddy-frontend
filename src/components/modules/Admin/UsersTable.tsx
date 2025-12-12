import { UserInfo } from "@/types/user.interface";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { UserStatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import UserActions from "./UserActions";
import Link from "next/link";

interface UsersTableProps {
  users: UserInfo[];
  error?: string | null;
}

export default function UsersTable({ users, error }: UsersTableProps) {
  if (error) {
    return (
      <Card className="p-6 text-center text-destructive">
        Error loading users: {error}
      </Card>
    );
  }

  if (!users.length) {
    return (
      <Card className="p-6 text-center text-muted-foreground">
        No users found.
      </Card>
    );
  }

  const getInitials = (name: string) => {
    if (!name || name.trim() === "") return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="p-2 sm:p-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="text-left py-2">User</th>
              <th className="text-left py-2">Email</th>
              <th className="text-left py-2">Role</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Joined</th>
              <th className="text-right py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const displayName = user.fullName || user.name || "User";
              const initials = getInitials(displayName);
              const status = user.status || "ACTIVE";

              return (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user.profileImage ? (
                          <AvatarImage src={user.profileImage} alt={displayName} />
                        ) : null}
                        <AvatarFallback className="text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <Link
                          href={`/dashboard/profile`}
                          className="font-medium hover:underline"
                        >
                          {displayName}
                        </Link>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{user.email}</td>
                  <td className="py-3">
                    <span className="capitalize">
                      {user.role?.toLowerCase() || "user"}
                    </span>
                  </td>
                  <td className="py-3">
                    <UserStatusBadge status={status} />
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {user.createdAt
                      ? format(new Date(user.createdAt), "MMM d, yyyy")
                      : "N/A"}
                  </td>
                  <td className="py-3">
                    <div className="flex justify-end">
                      <UserActions userId={user.id} currentStatus={status} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

