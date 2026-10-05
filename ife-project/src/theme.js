import skyways from './config/skyways.json';
import sunrise from './config/sunrise.json';

const airlines = { skyways, sunrise };

function pickAirline() {
  const key = new URLSearchParams(window.location.search).get('airline');
  return airlines[key] || skyways; // default airline
}

// Runs once when the page loads
export const config = pickAirline();

export function applyTheme() {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', config.colors.primary);
  root.style.setProperty('--color-secondary', config.colors.secondary);
  root.style.setProperty('--color-background', config.colors.background);
  root.style.setProperty('--color-card', config.colors.card);
  root.style.setProperty('--color-text', config.colors.text);
  document.title = config.name;
}