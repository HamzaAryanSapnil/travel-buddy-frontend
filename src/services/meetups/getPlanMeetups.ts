/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { getMeetups } from "./getMeetups";

export async function getPlanMeetups(
  planId: string
): Promise<{ data: any[]; error: string | null }> {
  // Reuse getMeetups with planId filter
  return getMeetups({ planId });
}

