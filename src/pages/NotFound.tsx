"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui-kit/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Log the 404 error for analytics
    console.error(`404 - Page not found: ${pathname}`);
  }, [pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page non trouvÃ©e</h2>
          <p className="text-gray-600 mb-8">
            DÃ©solÃ©, la page que vous recherchez n'existe pas ou a Ã©tÃ© dÃ©placÃ©e.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Retour Ã  l'accueil
            </Button>
          </Link>
          
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour en arriÃ¨re
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>URL demandÃ©e : {pathname}</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;



