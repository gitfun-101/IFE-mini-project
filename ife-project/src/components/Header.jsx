import { config } from '../theme';

export default function Header() {
  return (
    <header className="header">
      <span>{config.logo} {config.name}</span>
    </header>
  );
}