/* global React, linenPalette, HabitRow, TabBar */

// ───────────────────────────────────────────────────────────
// HabitFlow growth mascots — Plant & Campfire
// Shapes mirror src/components/mascots/Plant.tsx + Campfire.tsx exactly:
// viewBox "0 0 100 120", 6 stages (-1..4), spec-supplied palette.
// CSS animations replace RN Animated for the canvas preview.
// ───────────────────────────────────────────────────────────

const motionCSS = `
@keyframes plantSway {
  0%, 100% { transform: rotate(-2deg); }
  50%      { transform: rotate(2deg); }
}
@keyframes fireFlicker {
  0%, 100% { opacity: 1; }
  25%      { opacity: 0.65; }
  50%      { opacity: 1; }
  75%      { opacity: 0.85; }
}
@keyframes fireGlow {
  0%, 100% { opacity: 0.35; }
  50%      { opacity: 0.55; }
}
@keyframes wiltShake {
  0%       { transform: translateX(0); }
  3%       { transform: translateX(-3px); }
  6%       { transform: translateX(3px); }
  9%       { transform: translateX(-3px); }
  12%      { transform: translateX(3px); }
  15%, 100%{ transform: translateX(0); }
}
`;

function MascotMotionStyle() {
  return <style dangerouslySetInnerHTML={{ __html: motionCSS }} />;
}

// ───────────────────────────────────────────────────────────
// Plant
// ───────────────────────────────────────────────────────────
const PC = {
  soil:        '#4a2c0a',
  soilDark:    '#3a2206',
  seed:        '#7c5a3f',
  wiltStem:    '#8a7025',
  wiltLeaf:    '#c8a020',
  wiltLeafD:   '#a07e14',
  stem1:       '#558b2f',
  stem3:       '#33691e',
  stem4:       '#1b5e20',
  leaf:        '#7cb342',
  leafLight:   '#8bc34a',
  leafBright:  '#9ccc65',
  bush1:       '#388e3c',
  bush2:       '#43a047',
  bush3:       '#4caf50',
  bush4:       '#66bb6a',
  bush5:       '#81c784',
  flowerOuter: '#f9a825',
  flowerInner: '#ff8f00',
  eye:         '#2a2520',
  cheek:       '#e8a8a0',
};

function plantStage(stage) {
  if (stage === -1) {
    return (
      <g transform="rotate(10 50 100)">
        <rect x="48" y="50" width="4" height="50.5" fill={PC.wiltStem} rx="2"/>
        <ellipse cx="38" cy="75" rx="8" ry="3" fill={PC.wiltLeaf} transform="rotate(55 38 75)"/>
        <ellipse cx="62" cy="82" rx="8" ry="3" fill={PC.wiltLeafD} transform="rotate(-55 62 82)"/>
        <ellipse cx="40" cy="58" rx="7" ry="2.5" fill={PC.wiltLeaf} transform="rotate(60 40 58)"/>
        <ellipse cx="60" cy="62" rx="7" ry="2.5" fill={PC.wiltLeafD} transform="rotate(-60 60 62)"/>
        <circle cx="50" cy="46" r="11.5" fill={PC.wiltLeaf}/>
        <circle cx="50" cy="46" r="9.5" fill={PC.wiltLeafD} opacity="0.35"/>
        <path d="M 43 46 Q 45 48 47 46" stroke={PC.eye} strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M 53 46 Q 55 48 57 46" stroke={PC.eye} strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M 46 52 Q 50 50 54 52" stroke={PC.eye} strokeWidth="1" fill="none" strokeLinecap="round"/>
      </g>
    );
  }
  if (stage === 0) {
    return <ellipse cx="50" cy="101.5" rx="2.5" ry="1.3" fill={PC.seed}/>;
  }
  if (stage === 1) {
    return (
      <g>
        <rect x="48.5" y="82" width="3" height="18.5" fill={PC.stem1} rx="1.5"/>
        <ellipse cx="42" cy="84" rx="5" ry="2.5" fill={PC.leaf} transform="rotate(-35 42 84)"/>
        <ellipse cx="58" cy="84" rx="5" ry="2.5" fill={PC.leafLight} transform="rotate(35 58 84)"/>
      </g>
    );
  }
  if (stage === 2) {
    return (
      <g>
        <rect x="48.5" y="62" width="3" height="38.5" fill={PC.stem1} rx="1.5"/>
        <ellipse cx="40" cy="88" rx="7" ry="3" fill={PC.leaf} transform="rotate(-30 40 88)"/>
        <ellipse cx="60" cy="88" rx="7" ry="3" fill={PC.leaf} transform="rotate(30 60 88)"/>
        <ellipse cx="42" cy="73" rx="6" ry="2.8" fill={PC.leafLight} transform="rotate(-30 42 73)"/>
        <ellipse cx="58" cy="73" rx="6" ry="2.8" fill={PC.leafLight} transform="rotate(30 58 73)"/>
        <circle cx="50" cy="60" r="10" fill={PC.leaf}/>
        <circle cx="45" cy="57" r="5.5" fill={PC.leafLight}/>
        <circle cx="55" cy="57" r="5.5" fill={PC.leafLight}/>
        <circle cx="50" cy="54" r="4.5" fill={PC.leafBright}/>
        <circle cx="46" cy="61" r="1.5" fill={PC.eye}/>
        <circle cx="54" cy="61" r="1.5" fill={PC.eye}/>
        <circle cx="43" cy="64" r="1.3" fill={PC.cheek} opacity="0.75"/>
        <circle cx="57" cy="64" r="1.3" fill={PC.cheek} opacity="0.75"/>
        <path d="M 47 64 Q 50 67 53 64" stroke={PC.eye} strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      </g>
    );
  }
  if (stage === 3) {
    return (
      <g>
        <rect x="48.5" y="48" width="3" height="52.5" fill={PC.stem3} rx="1.5"/>
        <circle cx="37" cy="86" r="6" fill={PC.leaf}/>
        <circle cx="41" cy="82" r="5" fill={PC.leafLight}/>
        <circle cx="63" cy="86" r="6" fill={PC.leaf}/>
        <circle cx="59" cy="82" r="5" fill={PC.leafLight}/>
        <circle cx="38" cy="68" r="5.5" fill={PC.leafLight}/>
        <circle cx="62" cy="68" r="5.5" fill={PC.leafLight}/>
        <circle cx="42" cy="65" r="4" fill={PC.leafBright}/>
        <circle cx="58" cy="65" r="4" fill={PC.leafBright}/>
        <circle cx="50" cy="43" r="13" fill={PC.leaf}/>
        <circle cx="43" cy="41" r="7" fill={PC.leafLight}/>
        <circle cx="57" cy="41" r="7" fill={PC.leafLight}/>
        <circle cx="50" cy="36" r="6" fill={PC.leafBright}/>
        <circle cx="46" cy="47" r="5" fill={PC.leafBright} opacity="0.7"/>
        <circle cx="54" cy="47" r="5" fill={PC.leafBright} opacity="0.7"/>
        <circle cx="45" cy="43" r="1.7" fill={PC.eye}/>
        <circle cx="55" cy="43" r="1.7" fill={PC.eye}/>
        <circle cx="42" cy="47" r="1.6" fill={PC.cheek} opacity="0.75"/>
        <circle cx="58" cy="47" r="1.6" fill={PC.cheek} opacity="0.75"/>
        <path d="M 46 49 Q 50 52 54 49" stroke={PC.eye} strokeWidth="1" fill="none" strokeLinecap="round"/>
      </g>
    );
  }
  // stage 4 — full bush + flower
  return (
    <g>
      <rect x="48.5" y="48" width="3" height="52.5" fill={PC.stem4} rx="1.5"/>
      <circle cx="32" cy="75" r="8"  fill={PC.bush1}/>
      <circle cx="68" cy="75" r="8"  fill={PC.bush1}/>
      <circle cx="27" cy="60" r="9"  fill={PC.bush2}/>
      <circle cx="73" cy="60" r="9"  fill={PC.bush2}/>
      <circle cx="34" cy="50" r="10" fill={PC.bush3}/>
      <circle cx="66" cy="50" r="10" fill={PC.bush3}/>
      <circle cx="24" cy="45" r="8"  fill={PC.bush2}/>
      <circle cx="76" cy="45" r="8"  fill={PC.bush2}/>
      <circle cx="40" cy="37" r="10" fill={PC.bush4}/>
      <circle cx="60" cy="37" r="10" fill={PC.bush4}/>
      <circle cx="50" cy="45" r="16" fill={PC.bush3}/>
      <circle cx="50" cy="33" r="13" fill={PC.bush5}/>
      <circle cx="42" cy="42" r="7"  fill={PC.bush5} opacity="0.55"/>
      <circle cx="58" cy="42" r="7"  fill={PC.bush5} opacity="0.55"/>
      <circle cx="46" cy="42" r="1.7" fill={PC.eye}/>
      <circle cx="54" cy="42" r="1.7" fill={PC.eye}/>
      <circle cx="43" cy="46" r="1.6" fill={PC.cheek} opacity="0.75"/>
      <circle cx="57" cy="46" r="1.6" fill={PC.cheek} opacity="0.75"/>
      <path d="M 46 48 Q 50 51 54 48" stroke={PC.eye} strokeWidth="1" fill="none" strokeLinecap="round"/>
      <circle cx="50" cy="14" r="3.2" fill={PC.flowerOuter}/>
      <circle cx="55" cy="18" r="3.2" fill={PC.flowerOuter}/>
      <circle cx="45" cy="18" r="3.2" fill={PC.flowerOuter}/>
      <circle cx="53" cy="23" r="3.2" fill={PC.flowerOuter}/>
      <circle cx="47" cy="23" r="3.2" fill={PC.flowerOuter}/>
      <circle cx="50" cy="19" r="2.6" fill={PC.flowerInner}/>
    </g>
  );
}

function Plant({ stage = 3, size = 120, animate = true }) {
  const w = size, h = size * 1.2;
  const sway = animate && stage > -1
    ? { animation: 'plantSway 3.4s ease-in-out infinite', transformOrigin: '50px 100px', transformBox: 'fill-box' }
    : {};
  const shake = animate && stage === -1
    ? { animation: 'wiltShake 6s ease-in-out infinite' }
    : {};
  return (
    <div style={{ width: w, height: h, position: 'relative', ...shake }}>
      <svg width={w} height={h} viewBox="0 0 100 120">
        <ellipse cx="50" cy="103" rx="32" ry="3.5" fill={PC.soil} opacity="0.5"/>
        <rect x="18" y="100" width="64" height="14" rx="6" fill={PC.soil}/>
        <rect x="18" y="100" width="64" height="2" fill={PC.soilDark}/>
        <g style={sway}>{plantStage(stage)}</g>
      </svg>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Campfire
// ───────────────────────────────────────────────────────────
const FC = {
  logActive:  '#5d3a1a',
  logActiveL: '#6d4c2a',
  logEmber:   '#3e1f00',
  logEmberL:  '#4a2800',
  ash1: '#78909c',
  ash2: '#b0bec5',
  emberDot: '#e84000',
  emberDark: '#cc3300',
  emberBright: '#ffd700',
  flameOut: '#ff6b35',
  flameMid: '#ff8c42',
  flameInD: '#ff4500',
  flameIn:  '#ffd93d',
  flameTip: '#ffee00',
  glow: '#ff6b35',
  spark1: '#ffd93d',
  spark2: '#ff8c42',
  spark3: '#ffee00',
  spark4: '#ffa726',
  eye: '#2a2520',
  cheek: '#ffb3a0',
};

function flamePath(cx, baseY, w, h) {
  const top = baseY - h;
  return (
    `M ${cx} ${baseY}` +
    ` C ${cx - w} ${baseY} ${cx - w * 0.85} ${baseY - h * 0.45} ${cx - w * 0.4} ${baseY - h * 0.78}` +
    ` Q ${cx - w * 0.1} ${top + h * 0.08} ${cx} ${top}` +
    ` Q ${cx + w * 0.1} ${top + h * 0.08} ${cx + w * 0.4} ${baseY - h * 0.78}` +
    ` C ${cx + w * 0.85} ${baseY - h * 0.45} ${cx + w} ${baseY} ${cx} ${baseY}` +
    ` Z`
  );
}

function Logs({ active = true }) {
  const log  = active ? FC.logActive  : FC.logEmber;
  const logL = active ? FC.logActiveL : FC.logEmberL;
  return (
    <g>
      <g transform="translate(50 107) rotate(-12)">
        <rect x="-26" y="-3" width="52" height="6" rx="3" fill={log}/>
        <ellipse cx="-24" cy="0" rx="1.5" ry="2" fill={logL}/>
        <ellipse cx="24"  cy="0" rx="1.5" ry="2" fill={logL}/>
      </g>
      <g transform="translate(50 102) rotate(12)">
        <rect x="-26" y="-3" width="52" height="6" rx="3" fill={log}/>
        <ellipse cx="-24" cy="0" rx="1.5" ry="2" fill={logL}/>
        <ellipse cx="24"  cy="0" rx="1.5" ry="2" fill={logL}/>
      </g>
    </g>
  );
}

function fireStage(stage) {
  if (stage === -1) {
    return (
      <g>
        <Logs active={false}/>
        <circle cx="42" cy="103" r="2.2" fill={FC.emberDot}/>
        <circle cx="42" cy="103" r="1"   fill={FC.emberBright}/>
        <circle cx="52" cy="100" r="2.4" fill={FC.emberDot}/>
        <circle cx="52" cy="100" r="1.2" fill={FC.emberBright}/>
        <circle cx="59" cy="104" r="2"   fill={FC.emberDark}/>
        <circle cx="59" cy="104" r="0.9" fill={FC.emberBright}/>
      </g>
    );
  }
  if (stage === 0) {
    return (
      <g>
        <Logs active={true}/>
        <ellipse cx="50" cy="98" rx="16" ry="4"   fill={FC.ash1}/>
        <ellipse cx="50" cy="95" rx="11" ry="2.8" fill={FC.ash2}/>
        <ellipse cx="46" cy="94" rx="3"  ry="1.2" fill={FC.ash2} opacity="0.7"/>
        <ellipse cx="54" cy="94" rx="3"  ry="1.2" fill={FC.ash2} opacity="0.7"/>
      </g>
    );
  }
  return null;
}

function Campfire({ stage = 3, size = 120, animate = true }) {
  const w = size, h = size * 1.2;
  const shake = animate && stage === -1
    ? { animation: 'wiltShake 6s ease-in-out infinite' }
    : {};
  const flick = animate && stage >= 1
    ? { animation: 'fireFlicker 0.8s ease-in-out infinite', transformOrigin: '50px 96px' }
    : {};
  const glow = animate && stage >= 2
    ? { animation: 'fireGlow 2s ease-in-out infinite' }
    : {};

  // glow opacity range by stage
  const glowMax = stage === 4 ? 0.55 : stage === 3 ? 0.45 : stage === 2 ? 0.35 : 0;

  return (
    <div style={{ width: w, height: h, position: 'relative', ...shake }}>
      {stage >= 2 && (
        <div style={{
          position: 'absolute',
          left: w * 0.18, top: h * (95 / 120) - w * 0.18,
          width: w * 0.64, height: w * 0.36,
          borderRadius: w * 0.32,
          background: FC.glow,
          opacity: glowMax,
          ...glow,
          pointerEvents: 'none',
        }}/>
      )}
      <svg width={w} height={h} viewBox="0 0 100 120" style={{ position: 'relative' }}>
        <ellipse cx="50" cy="113" rx="36" ry="3.5" fill="#2a2520" opacity="0.18"/>

        {(stage === -1 || stage === 0) && fireStage(stage)}

        {stage >= 1 && (
          <>
            <Logs active={true}/>
            <g style={flick}>
              {stage === 1 && (
                <g>
                  <path d={flamePath(50, 96, 6,   22)} fill={FC.flameOut}/>
                  <path d={flamePath(50, 96, 3.2, 14)} fill={FC.flameIn}/>
                </g>
              )}
              {stage === 2 && (
                <g>
                  <path d={flamePath(42, 96, 5,   20)} fill={FC.flameOut}/>
                  <path d={flamePath(42, 96, 2.5, 12)} fill={FC.flameIn}/>
                  <path d={flamePath(58, 96, 5,   24)} fill={FC.flameOut}/>
                  <path d={flamePath(58, 96, 2.5, 15)} fill={FC.flameIn}/>
                  <path d={flamePath(50, 96, 8,   38)} fill={FC.flameOut}/>
                  <path d={flamePath(50, 96, 5,   28)} fill={FC.flameMid}/>
                  <path d={flamePath(50, 96, 2.7, 20)} fill={FC.flameIn}/>
                  <circle cx="47" cy="78" r="1.5" fill={FC.eye}/>
                  <circle cx="53" cy="78" r="1.5" fill={FC.eye}/>
                  <circle cx="45" cy="81" r="1.3" fill={FC.cheek} opacity="0.7"/>
                  <circle cx="55" cy="81" r="1.3" fill={FC.cheek} opacity="0.7"/>
                  <ellipse cx="50" cy="83" rx="2" ry="0.8" fill={FC.eye}/>
                </g>
              )}
              {stage === 3 && (
                <g>
                  <path d={flamePath(36, 96, 4,   16)} fill={FC.flameInD}/>
                  <path d={flamePath(36, 96, 2,   11)} fill={FC.flameIn}/>
                  <path d={flamePath(64, 96, 4,   18)} fill={FC.flameInD}/>
                  <path d={flamePath(64, 96, 2,   12)} fill={FC.flameIn}/>
                  <path d={flamePath(44, 96, 5,   32)} fill={FC.flameOut}/>
                  <path d={flamePath(44, 96, 3,   23)} fill={FC.flameIn}/>
                  <path d={flamePath(56, 96, 5,   34)} fill={FC.flameOut}/>
                  <path d={flamePath(56, 96, 3,   25)} fill={FC.flameIn}/>
                  <path d={flamePath(50, 96, 9,   54)} fill={FC.flameInD}/>
                  <path d={flamePath(50, 96, 6.2, 42)} fill={FC.flameOut}/>
                  <path d={flamePath(50, 96, 4,   32)} fill={FC.flameMid}/>
                  <path d={flamePath(50, 96, 2.2, 22)} fill={FC.flameTip}/>
                  <circle cx="47" cy="70" r="1.7" fill={FC.eye}/>
                  <circle cx="53" cy="70" r="1.7" fill={FC.eye}/>
                  <circle cx="44" cy="74" r="1.6" fill={FC.cheek} opacity="0.7"/>
                  <circle cx="56" cy="74" r="1.6" fill={FC.cheek} opacity="0.7"/>
                  <ellipse cx="50" cy="76" rx="2.5" ry="1" fill={FC.eye}/>
                </g>
              )}
              {stage === 4 && (
                <g>
                  <path d={flamePath(32, 96, 4,   20)} fill={FC.flameInD}/>
                  <path d={flamePath(32, 96, 2,   13)} fill={FC.flameIn}/>
                  <path d={flamePath(68, 96, 4,   22)} fill={FC.flameInD}/>
                  <path d={flamePath(68, 96, 2,   14)} fill={FC.flameIn}/>
                  <path d={flamePath(40, 96, 5,   36)} fill={FC.flameInD}/>
                  <path d={flamePath(40, 96, 3,   27)} fill={FC.flameIn}/>
                  <path d={flamePath(60, 96, 5,   40)} fill={FC.flameInD}/>
                  <path d={flamePath(60, 96, 3,   31)} fill={FC.flameIn}/>
                  <path d={flamePath(46, 96, 6,   52)} fill={FC.flameOut}/>
                  <path d={flamePath(46, 96, 4,   40)} fill={FC.flameMid}/>
                  <path d={flamePath(54, 96, 6,   56)} fill={FC.flameOut}/>
                  <path d={flamePath(54, 96, 4,   44)} fill={FC.flameMid}/>
                  <path d={flamePath(50, 96, 10,  72)} fill={FC.flameInD}/>
                  <path d={flamePath(50, 96, 7,   60)} fill={FC.flameOut}/>
                  <path d={flamePath(50, 96, 4.5, 46)} fill={FC.flameIn}/>
                  <path d={flamePath(50, 96, 2.5, 32)} fill={FC.flameTip}/>
                  <circle cx="47" cy="62" r="1.9" fill={FC.eye}/>
                  <circle cx="53" cy="62" r="1.9" fill={FC.eye}/>
                  <circle cx="43" cy="67" r="1.8" fill={FC.cheek} opacity="0.7"/>
                  <circle cx="57" cy="67" r="1.8" fill={FC.cheek} opacity="0.7"/>
                  <ellipse cx="50" cy="70" rx="3" ry="1.2" fill={FC.eye}/>
                </g>
              )}
            </g>
            {stage === 4 && (
              <g>
                <circle cx="30" cy="22" r="1"   fill={FC.spark1}/>
                <circle cx="42" cy="14" r="0.8" fill={FC.spark3}/>
                <circle cx="58" cy="18" r="1"   fill={FC.spark2}/>
                <circle cx="68" cy="26" r="0.8" fill={FC.spark4}/>
                <circle cx="50" cy="10" r="1.2" fill={FC.spark3}/>
                <circle cx="36" cy="32" r="0.7" fill={FC.spark2}/>
                <circle cx="64" cy="36" r="0.8" fill={FC.spark1}/>
                <circle cx="26" cy="38" r="0.6" fill={FC.spark4}/>
                <circle cx="74" cy="42" r="0.7" fill={FC.spark1}/>
              </g>
            )}
          </>
        )}
      </svg>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Growth system spec — now 6 stages
// ───────────────────────────────────────────────────────────
function GrowthSpec({ palette: p = linenPalette }) {
  const plantStages = [
    { i: -1, label: 'Solgun',      sub: '3+ gün ara'  },
    { i:  0, label: 'Tohum',       sub: '0 gün'       },
    { i:  1, label: 'Filiz',       sub: '1–3 gün'     },
    { i:  2, label: 'Genç',        sub: '4–10 gün'    },
    { i:  3, label: 'Yetişmiş',    sub: '11–25 gün'   },
    { i:  4, label: 'Çiçeklenme',  sub: '26+ gün'     },
  ];
  const fireStages = [
    { i: -1, label: 'Köz',        sub: '3+ gün ara'   },
    { i:  0, label: 'Soğuk',      sub: '0 gün'        },
    { i:  1, label: 'Kıvılcım',   sub: '1–3 gün'      },
    { i:  2, label: 'Küçük',      sub: '4–10 gün'     },
    { i:  3, label: 'Şenlik',     sub: '11–25 gün'    },
    { i:  4, label: 'Coşkulu',    sub: '26+ gün'      },
  ];
  return (
    <div style={{
      padding: '32px 28px', background: p.surface,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      color: p.ink, height: '100%', boxSizing: 'border-box',
      borderRadius: 16, border: `1px solid ${p.hairline}`,
      overflow: 'auto',
    }}>
      <MascotMotionStyle/>

      <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: p.muted }}>
        Mascot growth · spec
      </div>
      <div style={{
        fontFamily: '"Instrument Serif", Georgia, serif',
        fontSize: 34, lineHeight: 1.05, letterSpacing: -1, marginTop: 6,
      }}>
        İki dost, <span style={{ fontStyle: 'italic', color: p.primary }}>seninle birlikte büyür.</span>
      </div>
      <div style={{ marginTop: 12, fontSize: 13.5, lineHeight: 1.55, color: p.ink2, maxWidth: 480 }}>
        Stage −1 yeni: 3 gün ara verilirse bitki sararır, ateş köze döner — kaybolmazlar.
        Bir tamamlama ile evre geri yükselir.
      </div>

      {/* PLANT row */}
      <div style={{ marginTop: 22 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontFamily: '"Instrument Serif"', fontSize: 20, color: p.ink }}>
            Bitki <span style={{ color: p.muted, fontSize: 13, marginLeft: 6 }}>· sessiz, yavaş</span>
          </div>
          <div style={{ fontSize: 11, color: p.muted }}>6 evre</div>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6,
          background: p.bg, borderRadius: 18, border: `1px solid ${p.hairline}`,
          padding: '14px 6px',
        }}>
          {plantStages.map(s => (
            <div key={s.i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Plant stage={s.i} size={66}/>
              <div style={{ fontFamily: '"Instrument Serif"', fontSize: 13, color: p.ink, marginTop: 2, lineHeight: 1.1 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 9, color: p.muted, letterSpacing: 0.2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FIRE row */}
      <div style={{ marginTop: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ fontFamily: '"Instrument Serif"', fontSize: 20, color: p.ink }}>
            Ateş <span style={{ color: p.muted, fontSize: 13, marginLeft: 6 }}>· canlı, hareketli</span>
          </div>
          <div style={{ fontSize: 11, color: p.muted }}>6 evre</div>
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6,
          background: '#1F1A15', borderRadius: 18,
          padding: '14px 6px',
        }}>
          {fireStages.map(s => (
            <div key={s.i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <Campfire stage={s.i} size={66}/>
              <div style={{ fontFamily: '"Instrument Serif"', fontSize: 13, color: '#FBF7EF', marginTop: 2, lineHeight: 1.1 }}>
                {s.label}
              </div>
              <div style={{ fontSize: 9, color: '#9A8F80', letterSpacing: 0.2 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Motion + Trigger spec */}
      <div style={{
        marginTop: 18, padding: '16px 18px',
        background: p.bg, borderRadius: 20, border: `1px solid ${p.hairline}`,
      }}>
        <div style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: p.muted, marginBottom: 10 }}>
          Hareket · motion spec
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, fontSize: 12.5, lineHeight: 1.45, color: p.ink2 }}>
          <div>
            <div style={{ fontFamily: '"Instrument Serif"', fontSize: 16, color: p.ink, marginBottom: 4 }}>
              Bitki — sway
            </div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              <li>Rotation −2° → +2°</li>
              <li>3.4s · ease-in-out · loop</li>
              <li>−1'de tek seferlik translate−X şake</li>
            </ul>
          </div>
          <div>
            <div style={{ fontFamily: '"Instrument Serif"', fontSize: 16, color: p.ink, marginBottom: 4 }}>
              Ateş — flicker
            </div>
            <ul style={{ paddingLeft: 16, margin: 0 }}>
              <li>opacity 0.65 ↔ 1.0 (4-step)</li>
              <li>0.8s · loop</li>
              <li>Halka: opacity 0.15 ↔ {`{stage}`}max, 2s</li>
            </ul>
          </div>
        </div>
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: `1px dashed ${p.border}`,
          fontSize: 12.5, lineHeight: 1.5, color: p.ink2,
        }}>
          <strong style={{ color: p.ink }}>Tetik:</strong> Ardışık günlerin sayısına göre evre.
          3 gün üst üste atlama → stage −1. Geri dönüş tek bir tamamlama ile başlar.
        </div>
        <div style={{
          marginTop: 10, fontSize: 10.5, color: p.muted, lineHeight: 1.4,
          fontFamily: 'ui-monospace, monospace',
        }}>
          viewBox 0 0 100 120 · width = size · height = size * 1.2 · react-native-svg
        </div>
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Today with plant mascot
// ───────────────────────────────────────────────────────────
function DashboardPlant({ palette: p = linenPalette, stage = 3 }) {
  const items = [
    { id: 1, name: 'Suyumu içtim',     color: p.habit[4], type: 'boolean', done: true },
    { id: 2, name: 'Sabah esnemesi',   color: p.habit[3], type: 'boolean', done: true },
    { id: 3, name: 'Meditasyon',       color: p.habit[6], type: 'numeric', value: 8,    target: 10,   done: false },
    { id: 4, name: 'Yürüyüş',          color: p.habit[1], type: 'numeric', value: 4200, target: 6000, done: false },
    { id: 5, name: 'Okuma',            color: p.habit[7], type: 'numeric', value: 0,    target: 30,   done: false },
  ];
  return (
    <div style={{
      minHeight: '100%', background: p.bg,
      fontFamily: '"DM Sans", -apple-system, system-ui, sans-serif',
      color: p.ink, paddingBottom: 110,
    }}>
      <MascotMotionStyle/>
      <div style={{ padding: '12px 22px 8px' }}>
        <div style={{ fontSize: 12, color: p.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Cumartesi · 17 Mayıs
        </div>
        <div style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 30, color: p.ink, letterSpacing: -0.8, lineHeight: 1.1, marginTop: 4,
        }}>
          Günaydın, Ela.
        </div>
      </div>

      <div style={{
        margin: '14px 18px 0',
        background: p.surface, borderRadius: 28,
        border: `1px solid ${p.hairline}`,
        padding: '16px 20px 18px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 80, background: `linear-gradient(to top, ${p.primarySoft}, transparent)`,
          opacity: 0.5,
        }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <Plant stage={stage} size={110}/>
          <div style={{ flex: 1, paddingBottom: 6 }}>
            <div style={{ fontSize: 11, color: p.muted, letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>
              Dost · bitki
            </div>
            <div style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 22, color: p.ink, lineHeight: 1.15, marginBottom: 8,
            }}>
              Yavaş yavaş büyüyor.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: '"Instrument Serif"', fontSize: 16, color: p.primary, lineHeight: 1,
              }}>14 gün</span>
              <span style={{ width: 1, height: 12, background: p.border }}/>
              <span style={{ fontSize: 12, color: p.muted }}>12 gün sonra çiçek</span>
            </div>
            <div style={{
              marginTop: 8, height: 4, background: p.sunken,
              borderRadius: 99, overflow: 'hidden',
            }}>
              <div style={{ width: '56%', height: '100%', background: p.primary, borderRadius: 99 }}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '22px 18px 0' }}>
        <div style={{
          fontFamily: '"Instrument Serif"', fontSize: 19, color: p.ink,
          letterSpacing: -0.3, marginBottom: 10, padding: '0 4px',
        }}>Bugün</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(h => <HabitRow key={h.id} habit={h} p={p}/>)}
        </div>
      </div>

      <TabBar active="home" p={p}/>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Today with campfire mascot
// ───────────────────────────────────────────────────────────
function DashboardFire({ palette: p = linenPalette, stage = 3 }) {
  const items = [
    { id: 1, name: 'Suyumu içtim',     color: p.habit[4], type: 'boolean', done: true },
    { id: 2, name: 'Sabah esnemesi',   color: p.habit[3], type: 'boolean', done: true },
    { id: 3, name: 'Meditasyon',       color: p.habit[6], type: 'numeric', value: 8,    target: 10,   done: false },
    { id: 4, name: 'Yürüyüş',          color: p.habit[1], type: 'numeric', value: 4200, target: 6000, done: false },
    { id: 5, name: 'Okuma',            color: p.habit[7], type: 'numeric', value: 0,    target: 30,   done: false },
  ];
  return (
    <div style={{
      minHeight: '100%', background: p.bg,
      fontFamily: '"DM Sans", -apple-system, system-ui, sans-serif',
      color: p.ink, paddingBottom: 110,
    }}>
      <MascotMotionStyle/>
      <div style={{ padding: '12px 22px 8px' }}>
        <div style={{ fontSize: 12, color: p.muted, letterSpacing: 0.4, textTransform: 'uppercase' }}>
          Cumartesi · 17 Mayıs
        </div>
        <div style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 30, color: p.ink, letterSpacing: -0.8, lineHeight: 1.1, marginTop: 4,
        }}>
          Günaydın, Ela.
        </div>
      </div>

      <div style={{
        margin: '14px 18px 0',
        background: '#251D17', borderRadius: 28,
        border: '1px solid #3A2F25',
        padding: '16px 20px 18px',
        position: 'relative', overflow: 'hidden',
        color: '#FBF7EF',
      }}>
        <div style={{
          position: 'absolute', bottom: -40, left: '50%', transform: 'translateX(-50%)',
          width: 280, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, #E0845644 0%, transparent 70%)',
        }}/>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 14 }}>
          <Campfire stage={stage} size={110}/>
          <div style={{ flex: 1, paddingBottom: 6 }}>
            <div style={{ fontSize: 11, color: '#9A8F80', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: 4 }}>
              Dost · ateş
            </div>
            <div style={{
              fontFamily: '"Instrument Serif", Georgia, serif',
              fontSize: 22, color: '#FBF7EF', lineHeight: 1.15, marginBottom: 8,
            }}>
              Güzel yanıyor.
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                fontFamily: '"Instrument Serif"', fontSize: 16, color: '#E08456', lineHeight: 1,
              }}>14 gün</span>
              <span style={{ width: 1, height: 12, background: '#4A3D30' }}/>
              <span style={{ fontSize: 12, color: '#9A8F80' }}>köz tutmaya devam</span>
            </div>
            <div style={{
              marginTop: 8, height: 4, background: '#3A2F25',
              borderRadius: 99, overflow: 'hidden',
            }}>
              <div style={{ width: '56%', height: '100%', background: '#E08456', borderRadius: 99 }}/>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '22px 18px 0' }}>
        <div style={{
          fontFamily: '"Instrument Serif"', fontSize: 19, color: p.ink,
          letterSpacing: -0.3, marginBottom: 10, padding: '0 4px',
        }}>Bugün</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map(h => <HabitRow key={h.id} habit={h} p={p}/>)}
        </div>
      </div>

      <TabBar active="home" p={p}/>
    </div>
  );
}

// ───────────────────────────────────────────────────────────
// Picker
// ───────────────────────────────────────────────────────────
function MascotPicker({ palette: p = linenPalette }) {
  return (
    <div style={{
      minHeight: '100%', background: p.bg,
      fontFamily: '"DM Sans", -apple-system, system-ui, sans-serif',
      color: p.ink, display: 'flex', flexDirection: 'column',
    }}>
      <MascotMotionStyle/>
      <div style={{ padding: '20px 28px 0' }}>
        <div style={{ fontSize: 12, color: p.muted, letterSpacing: 0.6, textTransform: 'uppercase' }}>
          Yeni alışkanlık · son adım
        </div>
        <div style={{
          fontFamily: '"Instrument Serif", Georgia, serif',
          fontSize: 32, color: p.ink, letterSpacing: -0.8, lineHeight: 1.1, marginTop: 6,
        }}>
          Bir dost <span style={{ fontStyle: 'italic', color: p.primary }}>seç.</span>
        </div>
        <div style={{ marginTop: 10, fontSize: 14, color: p.ink2, lineHeight: 1.55 }}>
          Her alışkanlığın küçük bir dostu olur. Sen besledikçe büyür.
        </div>
      </div>

      <div style={{ flex: 1, padding: '24px 18px 12px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{
          background: p.surface,
          border: `2px solid ${p.primary}`,
          borderRadius: 26, padding: '16px',
          display: 'flex', gap: 12, alignItems: 'center',
          position: 'relative',
        }}>
          <Plant stage={3} size={86}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Instrument Serif"', fontSize: 22, color: p.ink, lineHeight: 1.1 }}>Bitki</div>
            <div style={{ marginTop: 4, fontSize: 13, color: p.ink2, lineHeight: 1.4 }}>
              Sessiz. Sabit hızda. Düşmeyi affeder.
            </div>
          </div>
          <div style={{
            position: 'absolute', top: 12, right: 14,
            width: 22, height: 22, borderRadius: 99,
            background: p.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#FBF7EF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <div style={{
          background: '#251D17', color: '#FBF7EF',
          border: '1px solid #3A2F25',
          borderRadius: 26, padding: '16px',
          display: 'flex', gap: 12, alignItems: 'center',
        }}>
          <Campfire stage={3} size={86}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: '"Instrument Serif"', fontSize: 22, color: '#FBF7EF', lineHeight: 1.1 }}>Ateş</div>
            <div style={{ marginTop: 4, fontSize: 13, color: '#D6CFC0', lineHeight: 1.4 }}>
              Canlı. Hareketli. Köz bırakır, asla sönmez.
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 6, padding: '12px 14px',
          background: p.primarySoft, color: p.primary,
          borderRadius: 14,
        }}>
          <span style={{ fontFamily: '"Instrument Serif"', fontSize: 14, fontStyle: 'italic' }}>
            İstersen sonra değiştirebilirsin. Dostun hatırasını taşır.
          </span>
        </div>
      </div>

      <div style={{ padding: '0 22px 30px' }}>
        <div style={{
          background: p.ink, color: p.surface,
          borderRadius: 16, padding: '15px 0',
          textAlign: 'center', fontSize: 15, fontWeight: 500,
        }}>Bitki ile başla</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Plant, Campfire, MascotMotionStyle,
  GrowthSpec, DashboardPlant, DashboardFire, MascotPicker,
});
