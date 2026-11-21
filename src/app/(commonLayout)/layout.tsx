import PublicFooter from "@/components/navigation/PublicFooter";
import PublicNavbar from "@/components/navigation/PublicNavbar";
import { Suspense } from "react";



export default function CommonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <PublicNavbar />
      </Suspense>
      {children}
      <PublicFooter />
    </>
  );
}
