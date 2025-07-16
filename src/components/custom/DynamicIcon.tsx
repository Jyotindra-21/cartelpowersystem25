// components/DynamicIcon.tsx
import * as LucideIcons from 'lucide-react';

interface DynamicIconProps {
  iconName: string;
  className?: string;
  fallback?: React.ReactNode;
}

export const DynamicIcon = ({ 
  iconName, 
  className = '', 
  fallback = null 
}: DynamicIconProps) => {
  // Convert icon name to PascalCase (e.g., 'shield' becomes 'Shield')
  const formattedIconName = iconName
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

  // @ts-ignore - LucideIcons is dynamically accessed
  const IconComponent = LucideIcons[formattedIconName] as React.ComponentType<{ className?: string }>;

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in Lucide`);
    return fallback;
  }

  return <IconComponent className={`h-6 w-6 ${className}`} />;
};