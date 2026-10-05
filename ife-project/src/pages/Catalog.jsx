import { useState } from 'react';
import { config } from '../theme';
import content from '../data/content.json';
import Header from '../components/Header';

export default function Catalog() {
  const [selected, setSelected] = useState(config.categories[0]);

  const visible = content.filter(
    item => config.categories.includes(item.category) && item.category === selected
  );

  return (
    <>
      <Header />

      <nav>
        {config.categories.map(cat => (
          <button
            key={cat}
            className={cat === selected ? 'tab active' : 'tab'}
            onClick={() => setSelected(cat)}
          >
            {cat}
          </button>
        ))}
      </nav>

      <div className="grid">
        {visible.map(item => (
          <div key={item.id} className="card">
            <img src={item.poster} alt={item.title} />
            <h3>{item.title}</h3>
          </div>
        ))}
      </div>
    </>
  );
}