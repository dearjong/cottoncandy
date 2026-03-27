import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  testId?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "검색어를 입력하세요",
  className = "",
  testId = "input-search"
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-4 pr-12 py-6 text-base rounded-full"
        data-testid={testId}
      />
      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" data-testid="button-search">
        <Search className="w-5 h-5" />
      </button>
    </div>
  );
}
