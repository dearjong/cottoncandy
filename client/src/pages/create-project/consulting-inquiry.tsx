import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import Layout from "@/components/layout/layout";
import StepIndicator from "@/components/project-creation/step-indicator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Upload } from "lucide-react";
import { COMMON_MESSAGES } from "@/lib/messages";

export default function ConsultingInquiry() {
  const stepNumber = 2;
  const [, setLocation] = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [phone1, setPhone1] = useState("");
  const [phone2, setPhone2] = useState("");
  const [phone3, setPhone3] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handlePrevious = () => {
    setLocation('/create-project/step1');
  };

  const handleSubmit = () => {
    // 첫 번째 확인 팝업 표시
    setShowConfirmDialog(true);
  };

  const handleConfirm = () => {
    // TODO: 실제 제출 로직
    console.log({ title, content, phone: `${phone1}-${phone2}-${phone3}`, files });
    
    // 첫 번째 팝업 닫고 두 번째 완료 팝업 표시
    setShowConfirmDialog(false);
    setShowCompleteDialog(true);
  };

  const handleComplete = () => {
    setShowCompleteDialog(false);
    // 홈으로 이동 또는 원하는 페이지로 이동
    setLocation('/');
  };

  const isFormValid = title.trim() !== "" && content.trim() !== "" && phone1 !== "" && phone2.trim() !== "" && phone3.trim() !== "";

  return (
    <Layout>
      <div className="py-8 sm:py-12 md:py-20 bg-white">
        <div className="page-content">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 sm:mb-10 md:mb-12"
          >
            <h1 className="page-title" data-testid="title-page">
              컨설팅 문의 드립니다.
            </h1>
            <p className="page-subtitle mt-4" data-testid="subtitle-page">
              전문가가 파트너 상담 및 대행사/제작사 매칭을 도와드립니다.
            </p>
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8 sm:mb-12 md:mb-16 options-container"
          >
            {/* 제목 */}
            <div className="project-section project-section-horizontal">
              <span className="project-section-title">
                <span className="cotton-candy-pink">*</span> 제목
              </span>
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="ex) 광고제작을 처음 하는데 어떻게 해야 할지 모르겠어요."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                  data-testid="input-title"
                />
              </div>
            </div>

            {/* 문의내용 */}
            <div className="project-section project-section-horizontal">
              <span className="project-section-title">
                <span className="cotton-candy-pink">*</span> 문의내용
              </span>
              <div className="flex-1">
                <Textarea
                  placeholder="상세 내용을 입력해주세요."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[225px]"
                  data-testid="textarea-content"
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div className="project-section project-section-horizontal">
              <span className="project-section-title">
                <span className="cotton-candy-pink">*</span> 전화
              </span>
              <div className="flex-1 flex items-center gap-3">
                <select
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  data-testid="select-phone1"
                >
                  <option value="">선택</option>
                  <option value="010">010</option>
                  <option value="011">011</option>
                  <option value="016">016</option>
                  <option value="017">017</option>
                  <option value="018">018</option>
                  <option value="019">019</option>
                  <option value="02">02</option>
                  <option value="031">031</option>
                  <option value="032">032</option>
                </select>
                <span className="text-gray-400">-</span>
                <Input
                  type="text"
                  placeholder="입력"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  maxLength={4}
                  className="w-28"
                  data-testid="input-phone2"
                />
                <span className="text-gray-400">-</span>
                <Input
                  type="text"
                  placeholder="입력"
                  value={phone3}
                  onChange={(e) => setPhone3(e.target.value)}
                  maxLength={4}
                  className="w-28"
                  data-testid="input-phone3"
                />
              </div>
            </div>

            {/* 첨부파일 */}
            <div className="project-section project-section-horizontal">
              <span className="project-section-title">첨부파일</span>
              <div className="flex-1">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={files.length > 0 ? `${files.length}개 파일 선택됨` : "파일을 업로드해 주세요."}
                    readOnly
                    className="flex-1"
                    data-testid="input-file-display"
                  />
                  <button
                    type="button"
                    onClick={handleFileUploadClick}
                    className="px-6 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center gap-2"
                    data-testid="button-file-upload"
                  >
                    <Upload className="w-4 h-4" />
                    파일업로드
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    data-testid="input-file"
                  />
                </div>
                {files.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeFile(index)}
                          className="text-gray-400 hover:text-gray-600"
                          data-testid={`button-remove-file-${index}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                className="btn-white"
                data-testid="button-previous"
              >
                이전
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="btn-pink"
                data-testid="button-submit"
              >
                확인
              </Button>
            </div>
            
            <p className="project-description mt-4">
              {COMMON_MESSAGES.TEMP_SAVE_NOTICE}
            </p>

            <StepIndicator currentStep={stepNumber} />
          </motion.div>
        </div>
      </div>

      {/* 확인 팝업 */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold mb-2">전문가의 컨설팅을 받으시겠어요?</h3>
            <p className="text-sm text-gray-600 mb-6">컨설턴트가 검토 후 곧 연락드립니다.</p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="btn-white"
                data-testid="button-cancel-dialog"
              >
                취소
              </button>
              <button
                onClick={handleConfirm}
                className="btn-pink"
                data-testid="button-confirm-dialog"
              >
                확인
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 완료 팝업 */}
      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center py-6">
            <h3 className="text-lg font-semibold mb-2">컨설팅 문의가 완료되었어요.</h3>
            <p className="text-sm text-gray-600 mb-1">전문 컨설턴트가 3일(영업일) 이내로 연락드립니다.</p>
            <p className="text-sm text-gray-600 mb-6">(02-0000-0000)</p>
            
            <button
              onClick={handleComplete}
              className="btn-pink mx-auto"
              data-testid="button-complete-dialog"
            >
              확인
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
