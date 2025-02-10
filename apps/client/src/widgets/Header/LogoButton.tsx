import { useNavigate } from 'react-router-dom';
import { Logo } from '@/shared/ui/Icons';
import { DefaultCharacter } from '@/shared/ui';

export function LogoButton() {
  const navigate = useNavigate();
  const handleLogoClick = () => {
    if (window.location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <button type="button" className="flex flex-row gap-2 hover:cursor-pointer" onClick={handleLogoClick}>
      <DefaultCharacter size={48} />
      <Logo width={109} height={50} className="text-text-strong" />
    </button>
  );
}
