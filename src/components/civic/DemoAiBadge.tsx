import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface DemoAiBadgeProps {
  variant?: 'subtle' | 'pill' | 'banner';
  className?: string;
  customText?: string;
}

export const DemoAiBadge: React.FC<DemoAiBadgeProps> = ({
  variant = 'subtle',
  className = '',
  customText,
}) => {
  const defaultText = 'Demo AI result: simulated, not a real model analysis.';

  if (variant === 'banner') {
    return (
      <div
        className={`flex items-center gap-2 p-2.5 rounded-[6px] text-xs bg-[#F6F8F7] text-[#4B5A6B] border border-[#E3E8E6] ${className}`}
      >
        <Sparkles className="w-4 h-4 text-[#1F5FA8] shrink-0" />
        <span className="font-medium">{customText || defaultText}</span>
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[6px] text-[11px] font-medium bg-[#F6F8F7] text-[#4B5A6B] border border-[#E3E8E6] select-none ${className}`}
      title="This analysis was generated deterministically by the simulated CivicPulse AI provider for demonstration purposes."
    >
      <Sparkles className="w-3 h-3 text-[#1F5FA8]" />
      <span>{customText || defaultText}</span>
    </span>
  );
};
