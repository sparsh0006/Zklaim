"use client";

interface AIAssistantButtonProps {
  onClick: () => void;
}

const RobotIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 sm:w-8 sm:h-8">
    <path fillRule="evenodd" d="M4.5 3.75a3 3 0 00-3 3v10.5a3 3 0 003 3h15a3 3 0 003-3V6.75a3 3 0 00-3-3h-15zm4.125 3.375a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75zm0 3.75a.75.75 0 000 1.5h6.75a.75.75 0 000-1.5h-6.75z" clipRule="evenodd" />
    <path d="M2.25 9.75A.75.75 0 003 9h18a.75.75 0 00.75-.75V6.75a.75.75 0 00-.75-.75H3a.75.75 0 00-.75.75v2.25z" />
  </svg>
);

const AIAssistantButton: React.FC<AIAssistantButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: "#00e6c2" }} // 👈 Mint green background from agent response
      className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40
                 hover:bg-opacity-80 text-black
                 p-3 sm:p-4 rounded-full shadow-xl hover:shadow-lg
                 transition-all duration-300 ease-in-out transform hover:scale-110
                 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75"
      aria-label="Open AI Assistant Chat"
    >
      <RobotIcon />
    </button>
  );
};

export default AIAssistantButton;
