import GuideLayout from "@/components/guide/guide-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";

export default function Inquiry() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleFileRemove = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <GuideLayout>
      <div>
        <h1 className="page-title mb-8">"1:1 문의 (Q&A)"</h1>
        
        <div className="max-w-2xl">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <Input
                type="text"
                placeholder="ex) 아직 온에어 일자를 모르는데 어떻게 하죠?"
                data-testid="input-inquiry-title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                문의내용
              </label>
              <Textarea
                placeholder="상세 내용을 입력해주세요."
                rows={12}
                data-testid="textarea-inquiry-content"
              />
            </div>

            <div>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                data-testid="input-file-hidden"
              />
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleFileClick}
                data-testid="button-file-upload"
              >
                <Upload className="w-4 h-4 mr-2" />
                파일업로드
              </Button>
              {selectedFile && (
                <div className="mt-2 flex items-center justify-between p-3 bg-gray-50 rounded-lg" data-testid="file-selected-info">
                  <span className="text-sm text-gray-700">{selectedFile.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFileRemove}
                    data-testid="button-file-remove"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            <div>
              <Button className="btn-primary w-full" data-testid="button-inquiry-submit">
                확인
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GuideLayout>
  );
}
