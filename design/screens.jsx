/* global React */
// HabitFlow — "Warm Linen" comfort redesign
// All screens accept a `palette` prop so we can swap palettes for variants.

// ───────────────────────────────────────────────────────────
// Palettes
// ───────────────────────────────────────────────────────────
const linenPalette = {
  bg: '#F2EDE3',        // warm oat
  surface: '#FBF7EF',   // cream
  sunken: '#EDE5D6',    // deeper oat
  ink: '#2A2520',       // warm near-black
  ink2: '#5C544A',
  muted: '#9A8F80',
  border: '#E3DAC7',
  hairline: '#E8E0CE',
  primary: '#5F7A60',   // muted sage
  primarySoft: '#DDE3D8',
  accent: '#B36B4E',    // warm clay
  accentSoft: '#EFD9CB',
  // habit dot colors – earthy versions of the originals
  habit: ['#C97064','#D89465','#C9A961','#7A9B6A','#7BA5A8','#7B85A8','#9784A5','#B58198'],
};

const morningPalette = {
  bg: '#F1E9DC',
  surface: '#FAF3E7',
  sunken: '#E9DFCC',
  ink: '#33271C',
  ink2: '#6A5947',
  muted: '#A4937D',
  border: '#E3D6BE',
  hairline: '#EADCC2',
  primary: '#B26A3F',   // warm clay primary
  primarySoft: '#F1DCC9',
  accent: '#7D8C5E',    // olive
  accentSoft: '#E0E2CE',
  habit: ['#C97064','#D89465','#C9A961','#7A9B6A','#7BA5A8','#7B85A8','#9784A5','#B58198'],
};

window.linenPalette = linenPalette;
window.morningPalette = morningPalette;

// ───────────────────────────────────────────────────────────
// Atoms
// ───────────────────────────────────────────────────────────
function Ring({ percent, size = 92, stroke = 7, p }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - percent / 100);
  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={p.sunken} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={p.primary} strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c} strokeDashoffset={off}
        transform={`rotate(-90 ${size/2} ${size/2})`} />
    </svg>
  );
}

function Bar({ pct, color, bg, h = 4 }) {
  return (
    <div style={{ height: h, background: bg, borderRadius: 99, overflow: 'hidden' }}>
      <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 99 }} />
    </div>
  );
}

// Tiny weekday dot trail (recent 7 days)
function WeekDots({ done, p, color }) {
  // done: array of 7 booleans, last = today
  const labels = ['P','S','Ç','P','C','C','P']; // Pzt..Pzr (tr abbrev)
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {done.map((d, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{
            width: 8, height: 8, borderRadius: 4,
            background: d ? color : p.sunken,
            outline: i === 6 ? `2px solid ${p.surface}` : 'none',
            boxShadow: i === 6 ? `0 0 0 2px ${color}66` : 'none',
          }} />
          <span style={{ fontSize: 9, color: p.muted, letterSpacing: 0.4 }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Habit row — softer than original card
// ───────────────────────────────────────────────────────────
function HabitRow({ habit, p }) {
  const done = habit.done;
  const isNumeric = habit.type === 'numeric';
  const progress = isNumeric ? Math.min(habit.value / habit.target, 1) : (done ? 1 : 0);

  return (
    <div style={{
      background: p.surface,
      borderRadius: 22,
      padding: '14px 16px 14px 14px',
      display: 'flex', alignItems: 'center', gap: 14,
      border: `1px solid ${p.hairline}`,
    }}>
      {/* Dot + completion ring */}
      <div style={{ position: 'relative', width: 28, height: 28, flexShrink: 0 }}>
        <svg width="28" height="28" style={{ position: 'absolute', inset: 0 }}>
          <circle cx="14" cy="14" r="12" fill="none" stroke={p.sunken} strokeWidth="2" />
          <circle cx="14" cy="14" r="12" fill="none" stroke={habit.color} strokeWidth="2"
            strokeLinecap="round" strokeDasharray={2 * Math.PI * 12}
            strokeDashoffset={2 * Math.PI * 12 * (1 - progress)}
            transform="rotate(-90 14 14)" />
        </svg>
        {done && (
          <div style={{
            position: 'absolute', inset: 4, borderRadius: 99,
            background: habit.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
              <path d="M2 5.5l2.2 2.2L9 2.5" stroke="#FBF7EF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
          <span style={{
            fontSize: 15, fontWeight: 500, color: done ? p.muted : p.ink,
            letterSpacing: -0.1,
            textDecoration: done ? 'line-through' : 'none',
            textDecorationColor: p.muted,
          }}>{habit.name}</span>
          {isNumeric && (
            <span style={{ fontSize: 12, color: p.muted, fontFeatureSettings: '"tnum"' }}>
              {habit.value}/{habit.target}
            </span>
          )}
        </div>
        <div style={{ marginTop: 8 }}>
          <Bar pct={progress * 100} color={habit.color} bg={p.sunken} h={3} />
        </div>
      </div>

      {isNumeric ? (
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={{
            width: 30, height: 30, borderRadius: 10,
            background: p.sunken, border: 'none', color: p.ink,
            fontSize: 16, lineHeight: 1, cursor: 'pointer',
          }}>−</button>
          <button style={{
            width: 30, height: 30, borderRadius: 10,
            background: habit.color, border: 'none', color: '#FBF7EF',
            fontSize: 16, lineHeight: 1, cursor: 'pointer',
          }}>+</button>
        </div>
      ) : (
        <div style={{
          width: 28, height: 28, borderRadius: 99,
          border: `1.5px solid ${done ? habit.color : p.border}`,
          background: done ? habit.color : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {done && (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M2.5 6.5L5.5 9.5L10.5 3.5" stroke="#FBF7EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </div>
      )}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Soft tab bar — uses outline strokes, not emoji
// ───────────────────────────────────────────────────────────
function TabBar({ active = 'home', p }) {
  const tabs = [
    { key: 'home', label: 'Bugün',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 10l8-6 8 6v8a1 1 0 01-1 1h-4v-6h-6v6H4a1 1 0 01-1-1v-8z"
            stroke={a ? p.ink : p.muted} strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
      ),
    },
    { key: 'reflect', label: 'Günlük',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <rect x="4" y="3" width="14" height="16" rx="2" stroke={a ? p.ink : p.muted} strokeWidth="1.6"/>
          <path d="M7 7h8M7 11h8M7 15h5" stroke={a ? p.ink : p.muted} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ),
    },
    { key: 'stats', label: 'Akış',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M4 14l4-4 3 3 6-7" stroke={a ? p.ink : p.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 6h4v4" stroke={a ? p.ink : p.muted} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
    { key: 'settings', label: 'Ayarlar',
      icon: (a) => (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="3" stroke={a ? p.ink : p.muted} strokeWidth="1.6"/>
          <path d="M11 2v2M11 18v2M20 11h-2M4 11H2M17.4 4.6l-1.4 1.4M6 16l-1.4 1.4M17.4 17.4L16 16M6 6L4.6 4.6"
            stroke={a ? p.ink : p.muted} strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      ),
    },
  ];
  return (
    <div style={{
      position: 'absolute', left: 12, right: 12, bottom: 28,
      background: `${p.surface}E6`,
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: 26,
      padding: '10px 8px 12px',
      display: 'flex', justifyContent: 'space-around',
      border: `1px solid ${p.hairline}`,
      boxShadow: `0 8px 32px ${p.ink}10`,
    }}>
      {tabs.map(t => {
        const a = t.key === active;
        return (
          <div key={t.key} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 4, padding: '2px 10px', minWidth: 56,
          }}>
            {t.icon(a)}
            <span style={{
              fontSize: 10, color: a ? p.ink : p.muted,
              fontWeight: a ? 600 : 500, letterSpacing: 0.1,
            }}>{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Dashboard
// ───────────────────────────────────────────────────────────
function Dashboard({ palette: p = linenPalette }) {
  const habits = {
    morning: [
      { id: 1, name: 'Suyumu içtim', color: p.habit[4], type: 'boolean', done: true },
      { id: 2, name: 'Sabah esnemesi', color: p.habit[3], type: 'boolean', done: true },
      { id: 3, name: 'Meditasyon', color: p.habit[6], type: 'numeric', value: 8, target: 10, done: false },
    ],
    afternoon: [
      { id: 4, name: 'Yürüyüş', color: p.habit[1], type: 'numeric', value: 4200, target: 6000, done: false },
    ],
    evening: [
      { id: 5, name: 'Okuma', color: p.habit[7], type: 'numeric', value: 0, target: 30, done: false },
      { id: 6, name: 'Telefonsuz akşam', color: p.habit[2], type: 'boolean', done: false },
    ],
  };

  const total = 6, completed = 2, pct = Math.round(completed/total*100);

  return (
    <div style={{
      minHeight: '100%', background: p.bg,
      fontFamily: '"DM Sans", -apple-system, system-ui, sans-serif',
      color: p.ink, paddingBottom: 110,
    }}>
      {/* Header */}
      <div style={{ padding: '12px 22px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: p.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>
            Salı · 16 Mayıs
          </div>
          <div style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 32, fontWeight: 400, color: p.ink,
            letterSpacing: -0.8, lineHeight: 1.1, marginTop: 4,
          }}>
            Günaydın, Ela.
          </div>
        </div>
        <div style={{
          width: 38, height: 38, borderRadius: 99,
          background: p.surface, border: `1px solid ${p.hairline}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 1.5v1.5M9 15v1.5M16.5 9H15M3 9H1.5M14.3 3.7l-1.1 1.1M4.8 13.2l-1.1 1.1M14.3 14.3l-1.1-1.1M4.8 4.8L3.7 3.7" stroke={p.ink2} strokeWidth="1.4" strokeLinecap="round"/>
            <circle cx="9" cy="9" r="3.5" stroke={p.ink2} strokeWidth="1.4"/>
          </svg>
        </div>
      </div>

      {/* Calm hero — no aggressive gradient, just a quiet ring + soft prose */}
      <div style={{
        margin: '14px 18px 0',
        background: p.surface,
        borderRadius: 28,
        padding: '22px 22px',
        border: `1px solid ${p.hairline}`,
        display: 'flex', alignItems: 'center', gap: 18,
      }}>
        <div style={{ position: 'relative' }}>
          <Ring percent={pct} size={92} stroke={6} p={p} />
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 26, color: p.ink, lineHeight: 1,
            }}>{completed}</span>
            <span style={{ fontSize: 10, color: p.muted, letterSpacing: 0.4, marginTop: 2 }}>/ {total}</span>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, color: p.ink2, lineHeight: 1.45 }}>
            Güzel bir başlangıç.<br/>
            <span style={{ color: p.muted }}>4 alışkanlık seni bekliyor — acelesi yok.</span>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{
                width: 6, height: 6, borderRadius: 99, background: p.primary,
              }}/>
              <span style={{ fontSize: 12, color: p.ink2 }}>14 günlük akış</span>
            </div>
            <span style={{ width: 1, height: 10, background: p.border }}/>
            <span style={{ fontSize: 12, color: p.ink2 }}>Bu hafta · %72</span>
          </div>
        </div>
      </div>

      {/* Habit groups */}
      <div style={{ padding: '24px 18px 0' }}>
        {[
          { key: 'morning', label: 'Sabah',     time: '06:00 — 11:00', items: habits.morning },
          { key: 'afternoon', label: 'Öğleden sonra', time: '11:00 — 17:00', items: habits.afternoon },
          { key: 'evening', label: 'Akşam',     time: '17:00 — sonrası', items: habits.evening },
        ].map(g => (
          <div key={g.key} style={{ marginBottom: 26 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              marginBottom: 10, padding: '0 4px',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                <span style={{
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  fontSize: 19, color: p.ink, letterSpacing: -0.3,
                }}>{g.label}</span>
                <span style={{ fontSize: 11, color: p.muted, letterSpacing: 0.3 }}>{g.time}</span>
              </div>
              <span style={{ fontSize: 11, color: p.muted }}>
                {g.items.filter(h => h.done).length}/{g.items.length}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {g.items.map(h => <HabitRow key={h.id} habit={h} p={p} />)}
            </div>
          </div>
        ))}

        {/* A gentle prompt instead of an empty CTA */}
        <div style={{
          marginTop: 8,
          padding: '16px 18px',
          background: 'transparent',
          borderRadius: 22,
          border: `1px dashed ${p.border}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: 99,
            background: p.primarySoft, color: p.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, lineHeight: 1, fontWeight: 300,
          }}>+</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: p.ink }}>Yeni bir alışkanlık ekle</div>
            <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>Küçük başla. Bir bardak su yeter.</div>
          </div>
        </div>
      </div>

      <TabBar active="home" p={p} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Add Habit modal (full screen variant; on real device it's a sheet)
// ───────────────────────────────────────────────────────────
function AddHabit({ palette: p = linenPalette }) {
  const colors = p.habit;
  const selectedColor = colors[3]; // sage
  return (
    <div style={{
      minHeight: '100%', background: p.bg,
      fontFamily: '"DM Sans", -apple-system, system-ui, sans-serif',
      color: p.ink, position: 'relative',
    }}>
      {/* Dimmed bg + sheet feel */}
      <div style={{ height: 80, background: p.bg }}/>
      <div style={{
        background: p.surface,
        borderTopLeftRadius: 32, borderTopRightRadius: 32,
        padding: '14px 22px 24px',
        minHeight: 720,
        border: `1px solid ${p.hairline}`,
        borderBottom: 'none',
      }}>
        <div style={{
          width: 40, height: 4, borderRadius: 2, background: p.border,
          margin: '0 auto 18px',
        }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 11, color: p.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              Yeni
            </div>
            <div style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 28, color: p.ink, lineHeight: 1.1, marginTop: 2,
            }}>Bir alışkanlık daha</div>
          </div>
          <div style={{
            width: 32, height: 32, borderRadius: 99,
            background: p.sunken, color: p.ink2,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14,
          }}>✕</div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, color: p.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
            Ne yapmak istiyorsun?
          </div>
          <div style={{
            background: p.bg,
            border: `1px solid ${p.hairline}`,
            borderRadius: 14,
            padding: '14px 16px',
            fontSize: 16, color: p.ink,
          }}>
            10 dakika dışarıda yürümek
            <span style={{
              display: 'inline-block', width: 1.5, height: 18,
              background: p.primary, verticalAlign: 'middle',
              marginLeft: 1, animation: 'blink 1s infinite',
            }}/>
          </div>
        </div>

        {/* Color */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, color: p.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>
            Renk
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {colors.map(c => (
              <div key={c} style={{
                width: 32, height: 32, borderRadius: 11, background: c,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                outline: c === selectedColor ? `2px solid ${c}` : 'none',
                outlineOffset: 3,
              }}>
                {c === selectedColor && (
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                    <path d="M2.5 6.5L5.5 9.5L10.5 3.5" stroke="#FBF7EF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Time of day — soft segmented */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, color: p.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>
            Ne zaman?
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8,
          }}>
            {[
              { label: 'Sabah', a: false },
              { label: 'Öğle', a: false },
              { label: 'Akşam', a: true },
              { label: 'Esnek', a: false },
            ].map(t => (
              <div key={t.label} style={{
                background: t.a ? p.ink : p.bg,
                color: t.a ? p.surface : p.ink2,
                border: `1px solid ${t.a ? p.ink : p.hairline}`,
                borderRadius: 14, padding: '12px 0',
                textAlign: 'center', fontSize: 13, fontWeight: 500,
              }}>{t.label}</div>
            ))}
          </div>
        </div>

        {/* Type */}
        <div style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 11, color: p.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10 }}>
            Nasıl ölçeceksin?
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{
              background: p.bg, border: `1.5px solid ${p.primary}`,
              borderRadius: 18, padding: '14px 14px',
            }}>
              <div style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: 17, color: p.ink, marginBottom: 2,
              }}>Yaptım</div>
              <div style={{ fontSize: 12, color: p.muted, lineHeight: 1.35 }}>
                Tek bir kutucuk. Bugün yaptın mı?
              </div>
            </div>
            <div style={{
              background: p.bg, border: `1px solid ${p.hairline}`,
              borderRadius: 18, padding: '14px 14px',
            }}>
              <div style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: 17, color: p.ink, marginBottom: 2,
              }}>Sayarak</div>
              <div style={{ fontSize: 12, color: p.muted, lineHeight: 1.35 }}>
                Bir hedef belirle. Adım, sayfa, dakika…
              </div>
            </div>
          </div>
        </div>

        {/* Hint */}
        <div style={{
          background: p.primarySoft, color: p.primary,
          borderRadius: 14, padding: '12px 14px',
          fontSize: 12, lineHeight: 1.5, marginBottom: 18,
        }}>
          <span style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 15 }}>Bir öneri — </span>
          küçük başla. Beş dakikalık bir adım, bir saatten daha sürdürülebilirdir.
        </div>

        {/* Save */}
        <div style={{
          background: p.ink, color: p.surface,
          borderRadius: 16, padding: '15px 0',
          textAlign: 'center', fontSize: 15, fontWeight: 500, letterSpacing: 0.1,
        }}>
          Listeme ekle
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Habit detail
// ───────────────────────────────────────────────────────────
function HabitDetail({ palette: p = linenPalette }) {
  const c = p.habit[3]; // sage
  // generate a 35-day grid (5 weeks) with mostly true
  const cells = Array.from({ length: 35 }, (_, i) => {
    const r = ((i * 53) % 7);
    return r < 5 || i > 30;
  });

  return (
    <div style={{
      minHeight: '100%', background: p.bg,
      fontFamily: '"DM Sans", -apple-system, system-ui, sans-serif',
      color: p.ink,
    }}>
      {/* nav row */}
      <div style={{ padding: '12px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: p.ink2 }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M11 4l-5 5 5 5" stroke={p.ink2} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize: 14 }}>Bugün</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: p.surface, border: `1px solid ${p.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v12M1 7h12" stroke={p.ink2} strokeWidth="1.4" strokeLinecap="round"/></svg>
          </div>
          <div style={{ width: 32, height: 32, borderRadius: 99, background: p.surface, border: `1px solid ${p.hairline}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="3" r="1" fill={p.ink2}/><circle cx="7" cy="7" r="1" fill={p.ink2}/><circle cx="7" cy="11" r="1" fill={p.ink2}/></svg>
          </div>
        </div>
      </div>

      {/* title block */}
      <div style={{ padding: '8px 22px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, background: c }}/>
          <span style={{ fontSize: 12, color: p.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>Sabah · sayarak</span>
        </div>
        <div style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 36, color: p.ink, letterSpacing: -0.8, lineHeight: 1.05,
        }}>Sabah esnemesi</div>
        <div style={{ marginTop: 10, fontSize: 13, color: p.ink2, lineHeight: 1.5 }}>
          Yatakta uzun uzun gerinmek. Hiçbir şey ispatlamak zorunda değilsin.
        </div>
      </div>

      {/* stat strip */}
      <div style={{
        margin: '0 18px 18px',
        background: p.surface, borderRadius: 24,
        border: `1px solid ${p.hairline}`,
        padding: '18px 4px',
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
      }}>
        {[
          { v: '23', l: 'günlük akış', sub: 'en uzun 41' },
          { v: '87%', l: 'son 30 gün', sub: '26 / 30' },
          { v: '142', l: 'toplam', sub: 'Mart\'tan beri' },
        ].map((s, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            borderLeft: i > 0 ? `1px solid ${p.hairline}` : 'none',
            padding: '0 8px',
          }}>
            <div style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 26, color: p.ink, lineHeight: 1,
            }}>{s.v}</div>
            <div style={{ fontSize: 11, color: p.ink2, marginTop: 6, letterSpacing: 0.3 }}>{s.l}</div>
            <div style={{ fontSize: 10, color: p.muted, marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* heatmap */}
      <div style={{
        margin: '0 18px 18px',
        background: p.surface, borderRadius: 24,
        border: `1px solid ${p.hairline}`,
        padding: '18px 18px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <span style={{
            fontFamily: '"Instrument Serif", Georgia, serif', fontSize: 17, color: p.ink,
          }}>Son 5 hafta</span>
          <span style={{ fontSize: 11, color: p.muted }}>Nis 12 — Mayıs 16</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {cells.map((on, i) => (
            <div key={i} style={{
              aspectRatio: '1 / 1', borderRadius: 7,
              background: on ? c : p.sunken,
              opacity: on ? (0.45 + ((i % 4) * 0.18)) : 1,
            }}/>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
          <span style={{ fontSize: 10, color: p.muted, letterSpacing: 0.4 }}>P S Ç P C C P</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, color: p.muted }}>az</span>
            {[0.3, 0.55, 0.8, 1].map(o => (
              <div key={o} style={{ width: 10, height: 10, borderRadius: 3, background: c, opacity: o }}/>
            ))}
            <span style={{ fontSize: 10, color: p.muted }}>çok</span>
          </div>
        </div>
      </div>

      {/* Reflection note */}
      <div style={{
        margin: '0 18px 18px',
        background: p.accentSoft,
        borderRadius: 24,
        padding: '18px 20px',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 12, right: 16,
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 50, color: p.accent, opacity: 0.4, lineHeight: 1,
        }}>"</div>
        <div style={{ fontSize: 11, color: p.accent, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 6 }}>
          12 Mayıs · Pazartesi
        </div>
        <div style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 17, color: p.ink, lineHeight: 1.35, paddingRight: 30,
        }}>
          Sırtım gerçekten yumuşadı. Beş dakika için bile değer.
        </div>
      </div>

      <div style={{ height: 30 }}/>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Settings
// ───────────────────────────────────────────────────────────
function Settings({ palette: p = linenPalette }) {
  return (
    <div style={{
      minHeight: '100%', background: p.bg,
      fontFamily: '"DM Sans", -apple-system, system-ui, sans-serif',
      color: p.ink, paddingBottom: 110,
    }}>
      {/* Header */}
      <div style={{ padding: '14px 22px 6px' }}>
        <div style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 32, color: p.ink, letterSpacing: -0.8, lineHeight: 1.05,
        }}>Senin alanın</div>
        <div style={{ fontSize: 13, color: p.muted, marginTop: 4 }}>
          Ela · ela@ornek.com
        </div>
      </div>

      {/* Profile card — calm, no gradient */}
      <div style={{
        margin: '20px 18px 0',
        background: p.surface, borderRadius: 28,
        border: `1px solid ${p.hairline}`,
        padding: '22px',
      }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <div style={{
            width: 56, height: 56, borderRadius: 99,
            background: p.primarySoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 26, color: p.primary,
          }}>E</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: p.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>
              Mart 2024'ten beri
            </div>
            <div style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 22, color: p.ink, lineHeight: 1.1, marginTop: 2,
            }}>
              483 küçük adım
            </div>
          </div>
        </div>
        <div style={{
          marginTop: 18, paddingTop: 16,
          borderTop: `1px solid ${p.hairline}`,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
        }}>
          {[
            { v: '23', l: 'günlük akış' },
            { v: '8', l: 'alışkanlık' },
            { v: '%87', l: 'bu ay' },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{
                fontFamily: '"Instrument Serif", Georgia, serif',
                fontSize: 22, color: p.ink, lineHeight: 1,
              }}>{s.v}</div>
              <div style={{ fontSize: 11, color: p.muted, marginTop: 4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: gentle */}
      {[
        { title: 'Görünüm', items: [
          { name: 'Karanlık mod', sub: 'Otomatik · gün batımında', toggle: false },
          { name: 'Yazı tipi', sub: 'Instrument · DM Sans', chev: true },
          { name: 'Renk teması', sub: 'Keten · Sabah', chev: true },
        ]},
        { title: 'Hatırlatma', items: [
          { name: 'Yumuşak hatırlatıcı', sub: 'Her gün 09:00\'da', toggle: true },
          { name: 'Akşam özeti', sub: '21:30\'da · isteğe bağlı', toggle: false },
        ]},
        { title: 'Veri', items: [
          { name: 'Yedeği dışa aktar', sub: 'JSON dosyası', chev: true },
          { name: 'Yeniden başla', sub: 'Tüm geçmişi temizle', chev: true, danger: true },
        ]},
      ].map(s => (
        <div key={s.title} style={{ marginTop: 26 }}>
          <div style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 18, color: p.ink2, letterSpacing: -0.2,
            padding: '0 22px', marginBottom: 10,
          }}>{s.title}</div>
          <div style={{
            margin: '0 18px',
            background: p.surface,
            borderRadius: 22,
            border: `1px solid ${p.hairline}`,
            overflow: 'hidden',
          }}>
            {s.items.map((it, i) => (
              <div key={i} style={{
                padding: '14px 18px',
                borderTop: i > 0 ? `1px solid ${p.hairline}` : 'none',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: it.danger ? p.accent : p.ink, fontWeight: 500 }}>{it.name}</div>
                  <div style={{ fontSize: 11, color: p.muted, marginTop: 2 }}>{it.sub}</div>
                </div>
                {it.toggle !== undefined ? (
                  <div style={{
                    width: 38, height: 22, borderRadius: 99,
                    background: it.toggle ? p.primary : p.sunken,
                    position: 'relative', flexShrink: 0,
                  }}>
                    <div style={{
                      position: 'absolute', top: 2, left: it.toggle ? 18 : 2,
                      width: 18, height: 18, borderRadius: 99, background: p.surface,
                      boxShadow: `0 1px 3px ${p.ink}22`, transition: 'left 0.2s',
                    }}/>
                  </div>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M5 3l4 4-4 4" stroke={p.muted} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{
        margin: '36px 0 0', textAlign: 'center',
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontSize: 14, color: p.muted, fontStyle: 'italic',
      }}>
        Her gün bir nefes.
      </div>

      <TabBar active="settings" p={p} />
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Onboarding / first-run – the comforting welcome
// ───────────────────────────────────────────────────────────
function Welcome({ palette: p = linenPalette }) {
  return (
    <div style={{
      minHeight: '100%', background: p.bg,
      fontFamily: '"DM Sans", -apple-system, system-ui, sans-serif',
      color: p.ink, display: 'flex', flexDirection: 'column',
    }}>
      {/* Top art: soft layered ovals (no AI-slop SVG) */}
      <div style={{ height: 320, position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 90, left: '50%', transform: 'translateX(-50%)',
          width: 340, height: 340, borderRadius: '50%',
          background: p.primarySoft, opacity: 0.7,
        }}/>
        <div style={{
          position: 'absolute', top: 150, left: '50%', transform: 'translateX(-50%)',
          width: 240, height: 240, borderRadius: '50%',
          background: p.accentSoft, opacity: 0.7,
        }}/>
        <div style={{
          position: 'absolute', top: 200, left: '50%', transform: 'translateX(-50%)',
          width: 140, height: 140, borderRadius: '50%',
          background: p.surface,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 70, color: p.ink, lineHeight: 1,
          border: `1px solid ${p.hairline}`,
        }}>h</div>
      </div>

      <div style={{ padding: '0 28px', textAlign: 'center', flex: 1 }}>
        <div style={{ fontSize: 12, color: p.muted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 14 }}>
          HabitFlow
        </div>
        <div style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 38, color: p.ink, letterSpacing: -1, lineHeight: 1.05,
        }}>
          Acelesi olmayan<br/>
          <span style={{ fontStyle: 'italic', color: p.primary }}>küçük adımlar.</span>
        </div>
        <div style={{
          marginTop: 18, fontSize: 14, color: p.ink2, lineHeight: 1.55,
          maxWidth: 280, margin: '18px auto 0',
        }}>
          Mükemmel olmana gerek yok. Sadece bugün için bir şey seç.
        </div>
      </div>

      <div style={{ padding: '0 22px 30px' }}>
        <div style={{
          background: p.ink, color: p.surface,
          borderRadius: 16, padding: '15px 0',
          textAlign: 'center', fontSize: 15, fontWeight: 500,
        }}>Başlayalım</div>
        <div style={{
          textAlign: 'center', marginTop: 14,
          fontSize: 13, color: p.muted,
        }}>Hesabım var <span style={{ color: p.ink, fontWeight: 500 }}>· giriş yap</span></div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Dashboard, AddHabit, HabitDetail, Settings, Welcome,
  linenPalette, morningPalette,
});
