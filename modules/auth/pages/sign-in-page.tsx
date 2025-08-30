"use client";

import React from "react";
import Link from "next/link";
import { GitHubLoginButton } from "@/modules/auth/ui/components/github-login-button";
import { AuthLayout } from "@/modules/auth/ui/layouts";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGitHubLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      await authClient.signIn.social({
        provider: "github",
      });
    } catch (error: any) {
      toast.error(error.message || "GitHub sign up failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Finance Manager account"
    >
      <div className="space-y-6">
        <GitHubLoginButton
          onClick={handleGitHubLogin}
          className="w-full"
          loading={isLoading}
        />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              New to Finance Manager?
            </span>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
          >
            Create your account
            <svg
              className="ml-2 w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignInPage;
