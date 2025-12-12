/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminPageHeader from "@/components/modules/Admin/AdminPageHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserInfo } from "@/services/auth/getUserInfo";
import { redirect } from "next/navigation";

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default async function AdminProfilePage() {
  const user = await getUserInfo();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard/profile");
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <AdminPageHeader
        title="Admin Profile"
        description="View your admin profile and account status"
        stats={[
          { label: "Status", value: user.status || "N/A" },
          { label: "Verified", value: user.isVerified ? "Yes" : "No" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{user.role}</Badge>
              <Badge variant={user.status === "ACTIVE" ? "default" : "secondary"}>
                {user.status || "N/A"}
              </Badge>
              {user.isVerified && <Badge>Verified</Badge>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{user.fullName || user.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium break-all">{user.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{user.location || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joined</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Bio</p>
              <p className="font-medium">
                {user.bio?.trim() ? user.bio : "No bio added yet."}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interests & Visits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Interests</p>
              {user.interests && user.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.interests.map((interest) => (
                    <Badge key={interest} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No interests added.</p>
              )}
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Visited Countries</p>
              {user.visitedCountries && user.visitedCountries.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {user.visitedCountries.map((country) => (
                    <Badge key={country} variant="outline">
                      {country}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No visited countries added.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


