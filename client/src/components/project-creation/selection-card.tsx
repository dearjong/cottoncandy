import { motion } from "framer-motion";
import { Megaphone, Shield, Lock, TrendingUp, Video, Users, Check } from "lucide-react";
import publicIconImage from "@assets/공개_Fill_1751008813946.png";
import robotIconImage from "@assets/직접선택Ai추천_1751008902787.png";
import lockIconImage from "@assets/lock_1751008909821.png";

interface SelectionCardProps {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  bgColor: string;
  iconColor: string;
  isSelected: boolean;
  onClick: () => void;
}

const iconMap = {
  megaphone: Megaphone,
  shield: Shield,
  lock: Lock,
  trending: TrendingUp,
  video: Video,
  users: Users,
  'custom-public': null, // Will use custom image
  'custom-robot': null, // Will use custom image
  'custom-lock': null, // Will use custom image
};

export default function SelectionCard({
  id,
  title,
  subtitle,
  description,
  bgColor,
  iconColor,
  isSelected,
  onClick,
  icon,
}: SelectionCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap];

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={`
        unified-card
        ${isSelected ? 'unified-card-selected' : 'bg-white hover:shadow-lg'}
        transition-shadow duration-200
      `}
      onClick={onClick}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="unified-card-icon relative overflow-hidden">
          {icon === 'custom-public' ? (
            <div className="relative w-full h-full">
              <img 
                src={publicIconImage} 
                alt="공개 프로젝트" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : icon === 'custom-robot' ? (
            <div className="relative w-full h-full">
              <img 
                src={robotIconImage} 
                alt="AI 추천" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : icon === 'custom-lock' ? (
            <div className="relative w-full h-full">
              <img 
                src={lockIconImage} 
                alt="전문 상담" 
                className="w-full h-full object-contain"
              />
            </div>
          ) : IconComponent ? (
            <div className="relative w-full h-full">
              <IconComponent className={`w-full h-full ${iconColor}`} />
            </div>
          ) : null}
        </div>
        
        {/* Title */}
        <h3 className="unified-card-title">{title}</h3>
        
        {/* Subtitle */}
        <p className={`unified-card-subtitle ${
          isSelected ? 'text-white' :
          subtitle === '무료' ? 'text-pink-600' : 
          subtitle === '20~200만원' ? 'text-gray-500' :
          subtitle === '*대행사' ? 'text-pink-600' :
          subtitle === '*제작사' ? 'text-pink-600' :
          subtitle === '스테딧' ? 'text-blue-600' :
          'text-pink-600'
        }`}>
          ({subtitle})
        </p>
        
        {/* Description */}
        <p className="unified-card-description">
          {description.split('\n').map((line, index) => (
            <span key={index}>
              {line}
              {index < description.split('\n').length - 1 && <br />}
            </span>
          ))}
        </p>
        
        {/* Check Icon */}
        <div className="unified-card-check">
          <Check className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-gray-300'}`} strokeWidth={3} />
        </div>
      </div>
    </motion.div>
  );
}
