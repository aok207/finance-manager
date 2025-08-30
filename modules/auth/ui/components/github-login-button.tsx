"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "./spinner";
import React from "react";

interface GitHubLoginButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export const GitHubLoginButton = ({
  children = "Continue with GitHub",
  className = "",
  onClick,
  loading = false,
  disabled = false,
}: GitHubLoginButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        group relative w-full flex justify-center items-center px-6 py-3 
        text-base font-medium text-white bg-gray-900 hover:bg-gray-800 
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
        transition-all duration-200 ease-in-out transform hover:scale-[1.02]
        active:scale-[0.98] rounded-xl shadow-lg hover:shadow-xl
        border border-gray-700 hover:border-gray-600
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
      <div className="relative flex items-center space-x-3">
        {loading ? (
          <Spinner size="sm" className="text-white" />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-github-icon lucide-github w-5 h-5 text-white group-hover:text-gray-200 transition-colors duration-200"
          >
            <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
            <path d="M9 18c-4.51 2-5-2-7-2" />
          </svg>
        )}
        <span className="group-hover:text-gray-200 transition-colors duration-200">
          {loading ? "Connecting..." : children}
        </span>
      </div>
    </Button>
  );
};
