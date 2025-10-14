"use client";

import { Suspense } from "react";
import WorkshopLayout from "../../components/layouts/WorkshopLayout";
import { usePathname, useSearchParams } from "next/navigation";

function ValuesLayoutContent({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = searchParams?.get('step');
  
  // Game page needs wider layout
  const isGamePage = pathname?.includes('/game');
  const width = isGamePage ? "game" : "default";
  
  // Show back button on all pages except init step 1 (when no step parameter or step=1)
  const isInitPage = pathname?.includes('/init');
  const isInitStep1 = isInitPage && (!step || step === '1');
  const showBackButton = !isInitStep1;
  
  // Custom back button logic for init page
  const handleBack = () => {
    if (isInitPage && step) {
      const currentStep = parseInt(step, 10);
      if (currentStep > 1) {
        // Go to previous step
        window.location.href = `/values/init?step=${currentStep - 1}`;
      } else {
        // Step 1 or invalid - go to landing
        window.location.href = '/';
      }
    } else {
      // For all other pages, use browser back
      window.history.back();
    }
  };
  
  return (
    <WorkshopLayout 
      background="gray" 
      width={width}
      showBackButton={showBackButton}
      backButtonProps={{ onClick: handleBack }}
    >
      {children}
    </WorkshopLayout>
  );
}

export default function ValuesLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ValuesLayoutContent>{children}</ValuesLayoutContent>
    </Suspense>
  );
}
