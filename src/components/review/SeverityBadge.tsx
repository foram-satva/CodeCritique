
import React from "react";

interface SeverityBadgeProps {
  severity: string;
}

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case "critical":
      return "text-red-500 border-red-200 bg-red-50";
    case "high":
      return "text-orange-500 border-orange-200 bg-orange-50";
    case "medium":
      return "text-amber-500 border-amber-200 bg-amber-50";
    case "low":
      return "text-green-500 border-green-200 bg-green-50";
    default:
      return "text-gray-500 border-gray-200 bg-gray-50";
  }
};

const SeverityBadge: React.FC<SeverityBadgeProps> = ({ severity }) => (
  <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(severity)}`}>
    {severity.charAt(0).toUpperCase() + severity.slice(1)}
  </span>
);

export default SeverityBadge;
