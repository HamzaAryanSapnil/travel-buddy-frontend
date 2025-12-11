import { Suspense } from "react";
import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import SubscriptionSuccessClient from "@/components/modules/Subscriptions/SubscriptionSuccessClient";

interface SubscriptionSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SubscriptionSuccessPage({
  searchParams,
}: SubscriptionSuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  if (!sessionId) {
    // If no session_id, redirect to subscriptions page
    redirect("/dashboard/subscriptions");
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Your subscription has been successfully activated.
              </p>
              <p className="text-sm text-muted-foreground">
                Thank you for subscribing to Travel Buddy!
              </p>
            </div>

            <Suspense fallback={<div className="h-20" />}>
              <SubscriptionSuccessClient sessionId={sessionId} />
            </Suspense>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild>
                <Link href="/dashboard/subscriptions">
                  View Subscription
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard/travel-plans">
                  Go to Travel Plans
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

