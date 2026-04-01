import GuideLayout from "@/components/guide/guide-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { addSupportTicket } from "@/lib/supportStore";

export default function Inquiry() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [inquiryType, setInquiryType] = useState<"INQUIRY" | "REPORT">("INQUIRY");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
                문의 유형
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                    inquiryType === "INQUIRY"
                      ? "border-pink-600 text-pink-600 bg-pink-50"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setInquiryType("INQUIRY")}
                >
                  일반문의
                </button>
                <button
                  type="button"
                  className={`px-3 py-2 rounded-md border text-sm font-medium transition-colors ${
                    inquiryType === "REPORT"
                      ? "border-rose-600 text-rose-600 bg-rose-50"
                      : "border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                  onClick={() => setInquiryType("REPORT")}
                >
                  신고
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <Input
                type="text"
                placeholder="ex) 아직 온에어 일자를 모르는데 어떻게 하죠?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                value={content}
                onChange={(e) => setContent(e.target.value)}
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
              <Button
                className="btn-primary w-full"
                data-testid="button-inquiry-submit"
                onClick={() => {
                  if (!title.trim() || !content.trim()) {
                    alert("제목과 내용을 입력해주세요.");
                    return;
                  }
                  addSupportTicket({ type: inquiryType, title: title.trim(), content: content.trim() });
                  alert(inquiryType === "REPORT" ? "신고가 접수되었습니다." : "문의가 접수되었습니다.");
                  setTitle("");
                  setContent("");
                }}
              >
                확인
              </Button>
            </div>
          </div>
        </div>
      </div>
    </GuideLayout>
  );
}
