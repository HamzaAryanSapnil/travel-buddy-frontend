"use client";

import { useState } from "react";
import { UserInfo } from "@/types/user.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Mail, MapPin, Calendar, Globe, Heart, Camera } from "lucide-react";
import { format } from "date-fns";
import ProfilePhotoUploadDialog from "./ProfilePhotoUploadDialog";

interface ProfileDisplayProps {
  userInfo: UserInfo;
}

export default function ProfileDisplay({ userInfo }: ProfileDisplayProps) {
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const displayName = userInfo.fullName || userInfo.name || "User";
  const initials = getInitials(displayName);

  return (
    <>
      <div className="space-y-6">
        {/* Profile Header Card */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {userInfo?.profileImage ? (
                    <AvatarImage
                      src={userInfo?.profileImage}
                      alt={displayName}
                    />
                  ) : null}
                  <AvatarFallback className="text-2xl">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                  onClick={() => setPhotoDialogOpen(true)}
                  title="Update profile photo"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{displayName}</CardTitle>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>{userInfo.email}</span>
                </div>
                {userInfo.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{userInfo.location}</span>
                  </div>
                )}
                {userInfo.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Joined {format(new Date(userInfo.createdAt), "MMM yyyy")}
                    </span>
                  </div>
                )}
              </div>
              {userInfo.role && (
                <Badge variant="secondary" className="mt-2">
                  <User className="h-3 w-3 mr-1" />
                  {userInfo.role}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        {userInfo.bio && (
          <CardContent>
            <p className="text-muted-foreground">{userInfo.bio}</p>
          </CardContent>
        )}
      </Card>

      {/* Interests Card */}
      {userInfo.interests && userInfo.interests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Interests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userInfo.interests.map((interest, index) => (
                <Badge key={index} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visited Countries Card */}
      {userInfo.visitedCountries && userInfo.visitedCountries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Visited Countries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userInfo.visitedCountries.map((country, index) => (
                <Badge key={index} variant="secondary">
                  {country}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Account Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium">{userInfo.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Role:</span>
            <span className="font-medium capitalize">{userInfo.role}</span>
          </div>
          {userInfo.isVerified !== undefined && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verified:</span>
              <Badge variant={userInfo.isVerified ? "default" : "outline"}>
                {userInfo.isVerified ? "Yes" : "No"}
              </Badge>
            </div>
          )}
          {userInfo.status && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status:</span>
              <Badge
                variant={
                  userInfo.status === "ACTIVE"
                    ? "default"
                    : userInfo.status === "SUSPENDED"
                    ? "destructive"
                    : "outline"
                }
              >
                {userInfo.status}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
      </div>

      <ProfilePhotoUploadDialog
        open={photoDialogOpen}
        onOpenChange={setPhotoDialogOpen}
      />
    </>
  );
}

