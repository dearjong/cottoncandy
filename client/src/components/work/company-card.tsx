import { Heart } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

interface CompanyCardProps {
  id?: number;
  logoText: string;
  companyName: string;
  companyType: string;
  clients: string;
  stats: string;
  industryTags: string[];
  specialtyTags: string[];
  cottonCandyWorks?: string;
  portfolioImages?: string[];
  isFavorite?: boolean;
  onToggleFavorite?: (id: number) => void;
  showInviteButton?: boolean;
  showMessageButton?: boolean;
  showStatusSwitch?: boolean;
  statusLabel?: string;
  statusChecked?: boolean;
  onStatusChange?: (checked: boolean) => void;
  onInvite?: () => void;
  onMessage?: () => void;
  variant?: 'agency-search' | 'participation';
}

export default function CompanyCard({
  id,
  logoText,
  companyName,
  companyType,
  clients,
  stats,
  industryTags,
  specialtyTags,
  cottonCandyWorks,
  portfolioImages,
  isFavorite = false,
  onToggleFavorite,
  showInviteButton = false,
  showMessageButton = false,
  showStatusSwitch = false,
  statusLabel = '참석확정',
  statusChecked = false,
  onStatusChange,
  onInvite,
  onMessage,
  variant = 'participation'
}: CompanyCardProps) {
  return (
    <div className="border rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xl font-bold">
              {logoText}
            </div>
            <div>
              <h3 className="font-bold text-lg">{companyName}</h3>
              <p className="text-sm text-gray-600">{companyType}</p>
            </div>
            {variant === 'agency-search' && id && onToggleFavorite && (
              <button 
                onClick={() => onToggleFavorite(id)}
                className={isFavorite ? "text-pink-600 ml-auto" : "text-gray-400 hover:text-pink-600 ml-auto"} 
                data-testid={`button-favorite-${id}`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-pink-600' : ''}`} />
              </button>
            )}
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {clients}
          </p>
          <p className="text-sm text-gray-600 mb-3">
            {stats}
          </p>
          <div className="flex gap-2 mb-3">
            {industryTags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-gray-100 rounded">{tag}</span>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            {specialtyTags.map((tag, index) => (
              <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">{tag}</span>
            ))}
            {specialtyTags.length > 3 && (
              <span className="text-xs text-gray-500">+ 7 more...</span>
            )}
          </div>
          {cottonCandyWorks && (
            <p className="text-xs text-gray-600">{cottonCandyWorks}</p>
          )}
        </div>
        {showInviteButton && (
          <button 
            className="btn-white" 
            onClick={onInvite}
            data-testid={`button-invite${id ? `-${id}` : ''}`}
          >
            초대
          </button>
        )}
        {showStatusSwitch && (
          <div className="flex items-center gap-2 ml-4">
            <span className="text-sm text-gray-600">{statusLabel}</span>
            <Switch
              checked={statusChecked}
              onCheckedChange={onStatusChange}
              data-testid={`switch-status${id ? `-${id}` : ''}`}
            />
          </div>
        )}
      </div>
      
      {portfolioImages && portfolioImages.length > 0 ? (
        <div className="flex gap-3 mb-3">
          {portfolioImages.map((img, index) => (
            <div key={index} className="w-1/4 aspect-video bg-gray-200 rounded overflow-hidden">
              <img src={img} alt={`Portfolio ${index + 1}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex gap-3 mb-3">
          <div className="w-1/4 aspect-video bg-gray-200 rounded"></div>
          <div className="w-1/4 aspect-video bg-gray-200 rounded"></div>
          <div className="w-1/4 aspect-video bg-gray-200 rounded"></div>
          <div className="w-1/4 aspect-video bg-gray-200 rounded"></div>
        </div>
      )}
      
      {showMessageButton && (
        <div className="flex justify-end">
          <button 
            className="text-sm text-gray-600 hover:text-pink-600" 
            onClick={onMessage}
            data-testid={`button-message${id ? `-${id}` : ''}`}
          >
            메세지
          </button>
        </div>
      )}
    </div>
  );
}
