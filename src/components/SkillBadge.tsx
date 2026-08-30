import React from 'react';
import { AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

interface SkillBadgeProps {
  skill: string;
  category?: 'Critical' | 'High Priority' | 'Recommended' | 'Bonus' | 'default';
  timeEstimate?: string;
  whyNeeded?: string;
  onRemove?: () => void;
  onClick?: () => void;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  category = 'default',
  timeEstimate,
  whyNeeded,
  onRemove,
  onClick,
}) => {
  const getBadgeStyle = () => {
    switch (category) {
      case 'Critical':
        return 'bg-rose-50 text-rose-700 border-rose-200 hover:border-rose-300';
      case 'High Priority':
        return 'bg-amber-50 text-amber-800 border-amber-200 hover:border-amber-300';
      case 'Recommended':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:border-indigo-300';
      case 'Bonus':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:border-emerald-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition-all ${getBadgeStyle()} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {category === 'Critical' && <AlertCircle className="w-3 h-3 text-rose-600 flex-shrink-0" />}
      {category === 'High Priority' && <Zap className="w-3 h-3 text-amber-600 flex-shrink-0" />}
      {category === 'Recommended' && <CheckCircle className="w-3 h-3 text-indigo-600 flex-shrink-0" />}
      
      <span className="font-semibold">{skill}</span>

      {timeEstimate && (
        <span className="inline-flex items-center gap-0.5 text-[10px] opacity-75 font-normal ml-1">
          <Clock className="w-2.5 h-2.5" />
          {timeEstimate}
        </span>
      )}

      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-1 text-slate-400 hover:text-rose-600 font-bold cursor-pointer"
        >
          ×
        </button>
      )}
    </div>
  );
};
