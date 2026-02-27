/**
 * StatsBar Component - hybikes design
 * 4-column grid with dividers, large numbers, small uppercase labels
 */

import type { GetPageQuery } from '@/types/hygraph-generated';
import type { Locale } from '@/lib/utils/locale';

type StatsBarType = Extract<GetPageQuery['pages'][0]['sections'][0], { __typename?: 'StatsBar' }>;

interface StatsBarProps {
  section: StatsBarType;
  locale: Locale;
}

export default function StatsBar({ section }: StatsBarProps) {
  const stats = section.stats;
  const count = stats.length;

  return (
    <section className="border-b border-[#121212]">
      <div className="grid grid-cols-2 md:grid-cols-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={[
              'p-6 md:p-8 text-center',
              i < count - 1 ? 'border-r border-[#121212]' : '',
              i < 2 && count > 2 ? 'border-b md:border-b-0 border-[#121212]' : '',
            ].join(' ')}
          >
            <p
              className="text-[#121212] mb-1"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 900,
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '-0.04em',
                lineHeight: 1,
              }}
            >
              {/* Split numeric part from unit suffix (e.g. "12kg" → "12" + "kg") */}
              {(() => {
                const match = stat.value.match(/^([0-9.,∞]+)([a-z%★+]*)$/i);
                const num = match ? match[1] : stat.value;
                const unit = match ? match[2] : '';
                return (
                  <>
                    <span>{num}</span>
                    {unit && <span className="text-[#FF4F00]" style={{ fontSize: '0.6em' }}>{unit}</span>}
                  </>
                );
              })()}
            </p>
            <p
              className="text-[#6B6B6B] uppercase tracking-[0.15em]"
              style={{ fontSize: '0.65rem', fontWeight: 500 }}
            >
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
