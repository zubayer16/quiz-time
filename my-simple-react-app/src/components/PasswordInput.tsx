import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { Input } from './ui/input';

const PasswordInput = ({
  id,
  value,
  onChange,
  showPassword,
  onToggleVisibility,
}: {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPassword: boolean;
  onToggleVisibility: () => void;
}) => (
  <div className='relative'>
    <Input
      id={id}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      required
    />
    <button
      type='button'
      className='absolute right-2 top-1/4 text-gray-400 hover:text-gray-600 focus:outline-none appearance-none bg-transparent hover:bg-transparent'
      onClick={onToggleVisibility}
    >
      {showPassword ? <EyeOffIcon className='h-4 w-4' /> : <EyeIcon className='h-4 w-4' />}
    </button>
  </div>
);

export default PasswordInput;
