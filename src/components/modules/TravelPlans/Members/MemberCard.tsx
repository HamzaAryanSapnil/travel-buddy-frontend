"use client";

import { useState, useTransition } from "react";
import { TripMember, TripRole } from "@/types/tripMembers.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { MoreVertical, Shield, ShieldAlert, Trash2, User } from "lucide-react";
import { updateMemberRole } from "@/services/tripMembers/updateMemberRole";
import { removeMember } from "@/services/tripMembers/removeMember";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

interface MemberCardProps {
  member: TripMember;
  currentUserId?: string;
  isManager: boolean; // True if currentUser is OWNER or ADMIN
  planId: string;
}

export default function MemberCard({
  member,
  currentUserId,
  isManager,
  planId,
}: MemberCardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

  const isSelf = currentUserId === member.userId;
  const isOwner = member.role === "OWNER";

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const getRoleBadgeColor = (role: TripRole) => {
    switch (role) {
      case "OWNER":
        return "default"; // Black
      case "ADMIN":
        return "destructive"; // Red
      case "EDITOR":
        return "secondary"; // Gray
      case "VIEWER":
        return "outline"; // White/Border
      default:
        return "outline";
    }
  };

  const handleRoleChange = async (newRole: TripRole) => {
    startTransition(async () => {
      const result = await updateMemberRole(planId, member.userId, newRole);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleRemove = async () => {
    startTransition(async () => {
      const result = await removeMember(planId, member.id);
      if (result.success) {
        toast.success(result.message);
        setShowRemoveConfirm(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <>
      <Card className="mb-4 overflow-hidden">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={member.user?.profileImage} />
              <AvatarFallback>{getInitials(member.user?.fullName)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-sm sm:text-base">
                  {member.user?.fullName || "Unknown User"}
                </h4>
                {isSelf && (
                  <span className="text-xs text-muted-foreground">(You)</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                {member.user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Badge variant={getRoleBadgeColor(member.role)} className="capitalize">
              {member.role.toLowerCase()}
            </Badge>

            {/* Actions: Only show if manager, not self (unless leaving?), and target is not owner */}
            {isManager && !isSelf && !isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                    disabled={isPending}
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange("ADMIN")}
                    disabled={isPending}
                  >
                    <ShieldAlert className="mr-2 h-4 w-4" />
                    Make Admin
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange("EDITOR")}
                    disabled={isPending}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Make Editor
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleRoleChange("VIEWER")}
                    disabled={isPending}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Make Viewer
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setShowRemoveConfirm(true)}
                    disabled={isPending}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Member
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={showRemoveConfirm}
        onOpenChange={setShowRemoveConfirm}
        title="Remove Member"
        description={`Are you sure you want to remove ${member.user?.fullName} from this trip? They will lose access to all plan details.`}
        onConfirm={handleRemove}
        confirmText="Remove"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
}

