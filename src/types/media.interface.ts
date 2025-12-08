export interface MediaItem {
  id: string;
  url: string;
  type: "photo" | "video";
  createdAt: string;
  planId?: string;
  ownerId?: string;
  provider?: string;
}

export interface MediaResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
  };
  data: MediaItem[];
}

