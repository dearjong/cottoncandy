import { ArrowUp, MessageCircle, X, Send } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ text: string; isUser: boolean }>>([
    { text: "안녕하세요! Cotton Candy 챗봇입니다. 무엇을 도와드릴까요?", isUser: false }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    setMessages(prev => [...prev, { text: inputMessage, isUser: true }]);
    
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: "죄송합니다. 현재 상담사와 연결 중입니다. 잠시만 기다려주세요.", 
        isUser: false 
      }]);
    }, 1000);

    setInputMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] md:gap-8">
            {/* Logo - Left Side */}
            <div className="mb-4 md:mb-0 md:ml-3 lg:ml-44">
              <a href="/design-system" className="block text-lg font-bold cursor-pointer" aria-label="Design System">
                <span className="cotton-pastel-cobalt">Cotton</span>
                <span className="cotton-candy-pink"> Candy</span>
              </a>
            </div>

            {/* Content - Right Side */}
            <div>
              {/* Navigation Links */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-700">
                  <a href="#" className="hover:text-pink-600 transition-colors">Cotton Candy 특장점</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-pink-600 transition-colors">이용방법</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-pink-600 transition-colors">자주 묻는 질문</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-pink-600 transition-colors">1:1 문의</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-pink-600 transition-colors">공지사항</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-pink-600 transition-colors">이벤트</a>
                </div>
              </div>

              {/* Secondary Links */}
              <div className="mb-3">
                <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600">
                  <a href="#" className="hover:text-pink-600 transition-colors">개인정보취급방침</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-pink-600 transition-colors">회원약관</a>
                  <span className="text-gray-300">|</span>
                  <a href="#" className="hover:text-pink-600 transition-colors">제휴안내</a>
                  <span className="text-gray-300">|</span>
                  <span>비즈니스 이메일: <a href="mailto:business@tvcf.co.kr" className="hover:text-pink-600 transition-colors">business@tvcf.co.kr</a></span>
                </div>
              </div>

              {/* Company Info */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>TEL:02-3447-0101&nbsp;&nbsp;FAX:02-3447-1231&nbsp;&nbsp;평일 10:00~17:00 (점심시간 11:30~13:00)</p>
                <p>작업 의뢰는 기업에 직접 문의해 주세요.</p>
                <p>06039) 서울특별시 강남구 도산대로12길 25-1(구주소 : 서울특별시 강남구 논현동 11-19)</p>
                <p>사업자등록번호: 211-87-58665&nbsp;&nbsp;통신판매업신고 제 강남-6953 호 (주)애드크림 대표이사 : 김용필</p>
                <p className="mt-2">Copyright © 2002 by TVCF All right reserved. Contact webmaster for more information.</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col">
          {/* Chat Header */}
          <div className="bg-[#EA4C89] text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">Cotton Candy 채팅 상담</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-colors"
              data-testid="button-close-chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                    message.isUser
                      ? 'bg-[#EA4C89] text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="메시지를 입력하세요..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#EA4C89] focus:border-transparent text-sm"
                data-testid="input-chat-message"
              />
              <button
                onClick={handleSendMessage}
                className="bg-[#EA4C89] text-white p-2 rounded-full hover:bg-[#d6417a] transition-colors"
                data-testid="button-send-message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        {/* Chat/Message Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-12 h-12 bg-[#EA4C89] rounded-full flex items-center justify-center shadow-lg hover:bg-[#d6417a] transition-colors"
          data-testid="button-chat"
          aria-label="문의하기"
        >
          {isChatOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <MessageCircle className="w-6 h-6 text-white" />
          )}
        </button>

        {/* Scroll to Top Button */}
        <button
          onClick={scrollToTop}
          className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-700 transition-colors"
          data-testid="button-scroll-top"
          aria-label="맨 위로"
        >
          <ArrowUp className="w-6 h-6 text-white" />
        </button>
      </div>
    </>
  );
}
