import { getUserInfo } from "@/services/auth/getUserInfo";
import PlannerContainer from "@/components/modules/Planner/PlannerContainer";
import { redirect } from "next/navigation";

export const metadata = {
  title: "AI Travel Planner | Travel Buddy",
  description: "Create your perfect travel plan with AI assistance",
};

export default async function PlannerPage() {
  let userInfo;
  
  try {
    userInfo = await getUserInfo();
    
    // Redirect if not authenticated
    if (!userInfo || !userInfo.id) {
      redirect("/login");
    }
  } catch (error) {
    console.error("Planner page error:", error);
    redirect("/login");
  }

  return <PlannerContainer currentUserId={userInfo.id} />;
}

