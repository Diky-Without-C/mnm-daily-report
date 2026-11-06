import { Suspense, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "@components/Spinner";
import ToastViewport from "@components/Toast";
import { useOrdersInitialization } from "@hooks/useOrderInitialization";
import { useOnlineStatus } from "@hooks/useOnlineStatus";
import { preloadXlsx } from "@libs/xlsx/xlsx.parser";
import { runWhenIdle } from "@utils/runWhenIdle";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [expanded, setExpanded] = useState(false);
  useOnlineStatus();
  useOrdersInitialization();

  // After the first paint, warm up what the user will most likely need next,
  // so navigating and opening the first Excel file feel instant.
  useEffect(
    () =>
      runWhenIdle(() => {
        void import("@pages/Stuffing");
        void import("@pages/Sales");

        const connection = (
          navigator as Navigator & { connection?: { saveData?: boolean } }
        ).connection;

        if (!connection?.saveData) preloadXlsx();
      }),
    [],
  );

  return (
    <div className="custom-background relative h-screen w-full bg-slate-200">
      <a
        href="#main"
        className="sr-only z-[70] rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow focus:not-sr-only focus:absolute focus:top-2 focus:left-20"
      >
        Skip to content
      </a>
      <Sidebar
        expanded={expanded}
        onToggle={() => setExpanded((prev) => !prev)}
      />
      <section className="h-full pl-18 transition-[padding] duration-300">
        <Header />
        <Suspense
          fallback={
            <div className="flex h-[calc(100%-4rem)] items-center justify-center">
              <Spinner label="Loading page" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </section>
      <ToastViewport />
    </div>
  );
}
