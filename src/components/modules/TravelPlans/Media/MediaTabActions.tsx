"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { TravelPlan } from "@/types/travelPlan.interface";
import UploadMediaDialog from "./UploadMediaDialog";

interface MediaTabActionsProps {
  plan: TravelPlan;
  isEditor: boolean;
}

export default function MediaTabActions({
  plan,
  isEditor,
}: MediaTabActionsProps) {
  const [showUploadDialog, setShowUploadDialog] = useState(false);

  if (!isEditor) {
    return (
      <div>
        <h2 className="text-2xl font-bold">Media Gallery</h2>
        <p className="text-muted-foreground">View trip photos and videos.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Media Gallery</h2>
          <p className="text-muted-foreground">
            Upload and manage trip photos and videos.
          </p>
        </div>
        <Button onClick={() => setShowUploadDialog(true)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Photos
        </Button>
      </div>

      <UploadMediaDialog
        plan={plan}
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
      />
    </>
  );
}

