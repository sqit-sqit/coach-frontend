"use client";

import { Suspense } from "react";
import WorkshopLayout from "../../components/layouts/WorkshopLayout.jsx";
import { usePathname, useSearchParams } from "next/navigation";

function SpiralLayoutContent({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const step = searchParams?.get('step');
  
  // All pages use WorkshopLayout
  const width = "default";
  const showBackButton = true;
  
  // Custom back button logic
  const handleBack = () => {
    const isInitPage = pathname?.includes('/init');
    
    if (isInitPage) {
      // For init page, go to landing page
      window.location.href = '/';
    } else {
      // For all other pages, use browser back
      window.history.back();
    }
  };
  
  return (
    <WorkshopLayout 
      background="gray"            // Gray background like Values
      width={width}               // Default width
      showBackButton={showBackButton}
      backButtonProps={{ onClick: handleBack }}
    >
      {children}
    </WorkshopLayout>
  );
}

export default function SpiralLayout({ children }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpiralLayoutContent>{children}</SpiralLayoutContent>
    </Suspense>
  );
}

