"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export const BreadCrumbs = () => {
  const pathname = usePathname();

  const generateBreadcrumbs = () => {
    const paths = pathname?.split("/").filter((path) => path !== "");

    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400 mb-4 px-2">
        {paths?.map((path, index) => {
          const href = `/${paths.slice(0, index + 1).join("/")}`;
          const isLast = index === paths.length - 1;
          const formattedPath =
            path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

          return (
            <React.Fragment key={path}>
              {/* <span className="text-gray-400">/</span> */}
              {isLast ? (
                <span className="text-gray-900 dark:text-slate-100 font-medium">
                  {formattedPath}
                </span>
              ) : (
                <Link href={href} className="hover:text-blue-600 dark:hover:text-blue-400">
                  {formattedPath}
                </Link>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };
  return <div>{generateBreadcrumbs()}</div>;
};
