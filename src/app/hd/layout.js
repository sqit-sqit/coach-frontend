"use client";

import { Suspense } from "react";
import { useSearchParams, usePathname } from "next/navigation";
import WorkshopLayout from "../../components/layouts/WorkshopLayout";

function HDLayoutContent({ children }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentStep = searchParams.get('step') || 1;
  
  // Determine if we should show back button
  const showBackButton = currentStep > 1;
  
  // Chart page needs wider layout for bodygraph
  const isChartPage = pathname?.includes('/chart');
  const width = isChartPage ? "wide" : "default";
  
  // Custom back handler for init steps
  const handleBack = () => {
    const step = parseInt(currentStep);
    if (step > 1) {
      // Navigate to previous step
      window.location.href = `/hd/init?step=${step - 1}`;
    } else {
      // Go back to main HD page
      window.history.back();
    }
  };

  return (
    <WorkshopLayout 
      width={width} 
      background="gray"
      showBackButton={true}
      backButtonProps={{ onClick: () => window.history.back() }}
    >
      {children}
    </WorkshopLayout>
  );
}

export default function HDLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HDLayoutContent>{children}</HDLayoutContent>
    </Suspense>
  );
}

