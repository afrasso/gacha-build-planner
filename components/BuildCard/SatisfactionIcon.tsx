import { CheckCircle2, XCircle } from "lucide-react";

interface SatisfactionIconProps {
  isSatisfied: boolean;
  tooltipText?: string;
}

const SatisfactionIcon: React.FC<SatisfactionIconProps> = ({ isSatisfied, tooltipText }) => {
  return (
    <div className="relative group">
      <div className="pl-2">
        {isSatisfied ? <CheckCircle2 className="text-green-500" /> : <XCircle className="text-red-500" />}
      </div>
      {tooltipText && (
        <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          {tooltipText}
        </span>
      )}
    </div>
  );
};

export default SatisfactionIcon;
