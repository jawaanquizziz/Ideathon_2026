import { useNavigate } from 'react-router-dom';

export default function FAB({ onClick }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) onClick();
    else navigate('/assistant');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed right-6 bottom-24 lg:bottom-8 lg:right-8 w-14 h-14 lg:w-16 lg:h-16 bio-luminescent text-white rounded-full shadow-2xl flex items-center justify-center z-40 hover:scale-110 active:scale-95 transition-transform group glow-primary"
      title="Open AI Assistant"
    >
      <span
        className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform"
        style={{ fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}
      >
        chat_bubble
      </span>
    </button>
  );
}
