import { useState, useEffect } from "react";

export default function UserModeToggle() {
  const [userMode, setUserMode] = useState<'request' | 'participate'>('request');

  useEffect(() => {
    const savedMode = localStorage.getItem('userMode') as 'request' | 'participate' || 'request';
    setUserMode(savedMode);
  }, []);

  const handleModeChange = (mode: 'request' | 'participate') => {
    setUserMode(mode);
    localStorage.setItem('userMode', mode);
    // 페이지 새로고침하여 userMode 변경 반영
    window.location.reload();
  };

  return (
    <div className="bg-white border-b border-gray-200 py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="relative bg-gray-200 rounded-full p-[0.5px] w-64">
            <div className="flex relative">
              <button
                onClick={() => handleModeChange('request')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all z-10 ${
                  userMode === 'request'
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
                data-testid="toggle-request"
              >
                의뢰
              </button>
              <button
                onClick={() => handleModeChange('participate')}
                className={`flex-1 py-2 rounded-full text-sm font-medium transition-all z-10 ${
                  userMode === 'participate'
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
                data-testid="toggle-participate"
              >
                참여
              </button>
              {/* Sliding background */}
              <div
                className={`absolute top-[0.5px] bottom-[0.5px] w-[calc(50%-0.5px)] bg-gray-800 rounded-full transition-transform duration-200 ${
                  userMode === 'participate' ? 'translate-x-[calc(100%+0.5px)]' : 'translate-x-[0.5px]'
                }`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
