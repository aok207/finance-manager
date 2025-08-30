import React from "react";
import { DollarSign, TrendingUp } from "lucide-react";

export const FinanceManagerLogo = ({
  className = "",
}: {
  className?: string;
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-full bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-center border border-white/30">
        <div className="relative">
          <DollarSign className="w-12 h-12 text-white" />
          <TrendingUp className="w-6 h-6 text-green-300 absolute -top-1 -right-1" />
        </div>
      </div>
    </div>
  );
};
