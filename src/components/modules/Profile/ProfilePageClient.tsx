"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit2, X } from "lucide-react";
import ProfileDisplay from "./ProfileDisplay";
import ProfileForm from "./ProfileForm";
import { UserInfo } from "@/types/user.interface";

interface ProfilePageClientProps {
  userInfo: UserInfo;
}

export default function ProfilePageClient({
  userInfo,
}: ProfilePageClientProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSuccess = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your profile information and preferences.
          </p>
        </div>
        {!isEditing && (
          <Button onClick={handleEdit} variant="outline">
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={handleCancel} variant="ghost">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          </div>
          <ProfileForm userInfo={userInfo} onSuccess={handleSuccess} />
        </div>
      ) : (
        <ProfileDisplay userInfo={userInfo} />
      )}
    </div>
  );
}

