/**
 * CELEST LEAGUE — Vídeo Propaganda (Remotion)
 *
 * Como usar:
 *   1. npm create video@latest  (escolha "blank")
 *   2. Substitua src/Root.tsx pelo conteúdo deste arquivo
 *   3. npm run dev  → preview no browser
 *   4. npm run build  → renderiza o vídeo MP4
 *
 * Duração: 15 segundos @ 30fps = 450 frames
 * Resolução: 1920×1080
 */

import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Sequence, Easing } from "remotion";

// ─── Design Tokens (espelhando o CSS do site) ───────────────────────────────
const C = {
  navy950: "#060d1a",
  navy900: "#0a1628",
  navy800: "#0f2040",
  navy700: "#152b58",
  navy600: "#1e3a70",
  blue400: "#4da8da",
  blue300: "#7ec8e3",
  blue200: "#b0dff0",
  accent:  "#5bc4f5",
  accentGlow: "rgba(91,196,245,0.15)",
  gold:    "#e8c97a",
  white:   "#ffffff",
  white70: "rgba(255,255,255,0.7)",
  white30: "rgba(255,255,255,0.3)",
  white10: "rgba(255,255,255,0.08)",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
const ease = (frame, from, to, dur, start = 0, fn = Easing.out(Easing.cubic)) =>
  interpolate(frame, [start, start + dur], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: fn,
  });

// ─── Stars background ────────────────────────────────────────────────────────
const STARS = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: (((i * 1237 + 53) % 1000) / 1000) * 1920,
  y: (((i * 853  + 17) % 1000) / 1000) * 1080,
  size: 1 + ((i * 317) % 25) / 10,
  phase: (i * 0.41) % (Math.PI * 2),
  speed: 2 + ((i * 73) % 30) / 10,
}));

const StarField = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {STARS.map((s) => {
        const opacity = 0.15 + 0.6 * Math.abs(Math.sin(s.phase + frame / (s.speed * 10)));
        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              width: s.size,
              height: s.size,
              borderRadius: "50%",
              background: C.white,
              opacity,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ─── Radial glow background ───────────────────────────────────────────────────
const GlowBG = ({ intensity = 1 }) => (
  <AbsoluteFill
    style={{
      background: `
        radial-gradient(ellipse 70% 50% at 50% 0%, rgba(91,196,245,${0.07 * intensity}) 0%, transparent 60%),
        radial-gradient(ellipse 50% 60% at 50% 50%, rgba(91,196,245,${0.04 * intensity}) 0%, transparent 70%)
      `,
    }}
  />
);

// ─── Particle burst (used on logo reveal) ────────────────────────────────────
const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  angle: (i / 24) * Math.PI * 2,
  dist: 120 + ((i * 37) % 80),
  size: 3 + ((i * 13) % 6),
}));

const Burst = ({ progress }) => (
  <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
    {PARTICLES.map((p, i) => {
      const x = Math.cos(p.angle) * p.dist * progress;
      const y = Math.sin(p.angle) * p.dist * progress;
      const op = 1 - progress;
      return (
        <div
          key={i}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: i % 3 === 0 ? C.gold : C.accent,
            transform: `translate(${x}px, ${y}px)`,
            opacity: op,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// ─── Scanline overlay ─────────────────────────────────────────────────────────
const Scanlines = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `repeating-linear-gradient(
        0deg,
        transparent,
        transparent 3px,
        rgba(0,0,0,0.03) 3px,
        rgba(0,0,0,0.03) 4px
      )`,
      pointerEvents: "none",
    }}
  />
);

// ─── Animated divider line ────────────────────────────────────────────────────
const HLine = ({ progress, color = C.accent, glow = true }) => (
  <div
    style={{
      height: 2,
      width: `${progress * 100}%`,
      background: `linear-gradient(90deg, transparent, ${color})`,
      boxShadow: glow ? `0 0 12px ${color}` : "none",
    }}
  />
);

// ─── Feature card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, desc, delay, frame }) => {
  const start = delay;
  const slideY = ease(frame, 40, 0, 20, start);
  const opacity = ease(frame, 0, 1, 18, start);
  return (
    <div
      style={{
        background: C.navy800,
        border: `1px solid ${C.white10}`,
        borderRadius: 18,
        padding: "24px 20px",
        flex: 1,
        transform: `translateY(${slideY}px)`,
        opacity,
        boxShadow: `0 0 30px rgba(91,196,245,0.06)`,
      }}
    >
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <div
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 20,
          fontWeight: 700,
          color: C.white,
          marginBottom: 6,
          letterSpacing: "0.04em",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 13, color: C.white70, lineHeight: 1.6 }}>{desc}</div>
    </div>
  );
};

// ─── Scene 1: Logo Reveal (frames 0–90) ──────────────────────────────────────
const Scene1 = () => {
  const frame = useCurrentFrame();

  const logoScale = spring({ frame, fps: 30, from: 0.4, to: 1, durationInFrames: 35, config: { damping: 14 } });
  const logoOp    = ease(frame, 0, 1, 20);
  const burstProg = ease(frame, 0, 1, 25, 25, Easing.out(Easing.quad));
  const titleOp   = ease(frame, 0, 1, 20, 40);
  const titleY    = ease(frame, 20, 0, 20, 40);
  const subOp     = ease(frame, 0, 1, 20, 55);
  const lineW     = ease(frame, 0, 1, 25, 50);
  const glowPulse = 0.5 + 0.5 * Math.sin(frame * 0.15);

  return (
    <AbsoluteFill
      style={{
        background: C.navy950,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <StarField />
      <GlowBG intensity={1 + glowPulse * 0.5} />
      <Scanlines />

      {/* Burst */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <Burst progress={burstProg} />
      </AbsoluteFill>

      {/* Logo + Title */}
      <div style={{ position: "relative", zIndex: 10, textAlign: "center" }}>
        {/* Logo placeholder (hexagon with star) */}
        <div
          style={{
            width: 120,
            height: 120,
            margin: "0 auto 24px",
            opacity: logoOp,
            transform: `scale(${logoScale})`,
            filter: `drop-shadow(0 0 ${20 * glowPulse}px ${C.accent})`,
          }}
        >
          <svg viewBox="0 0 120 120" width="120" height="120">
            <defs>
              <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={C.blue400} />
                <stop offset="100%" stopColor={C.accent} />
              </linearGradient>
            </defs>
            <polygon
              points="60,8 104,32 104,88 60,112 16,88 16,32"
              fill="none"
              stroke="url(#hexGrad)"
              strokeWidth="3"
            />
            <polygon
              points="60,8 104,32 104,88 60,112 16,88 16,32"
              fill={C.navy900}
            />
            <text
              x="60" y="72"
              textAnchor="middle"
              fontSize="38"
              fill={C.accent}
              fontFamily="'Rajdhani', sans-serif"
              fontWeight="700"
            >★</text>
          </svg>
        </div>

        {/* CELEST LEAGUE */}
        <div
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 80,
            fontWeight: 700,
            letterSpacing: "0.1em",
            lineHeight: 1,
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <span style={{ color: C.white }}>CELEST </span>
          <span style={{ color: C.accent, textShadow: `0 0 30px ${C.accent}` }}>LEAGUE</span>
        </div>

        {/* Divider */}
        <div style={{ marginTop: 16, opacity: subOp }}>
          <HLine progress={lineW} />
        </div>

        {/* Tagline */}
        <div
          style={{
            marginTop: 16,
            fontSize: 20,
            color: C.white70,
            opacity: subOp,
            letterSpacing: "0.05em",
          }}
        >
          A plataforma completa de campeonatos & recompensas
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 2: Features (frames 90–240) ───────────────────────────────────────
const Scene2 = () => {
  const frame = useCurrentFrame();

  const headerOp = ease(frame, 0, 1, 20);
  const headerY  = ease(frame, 30, 0, 20);
  const line1W   = ease(frame, 0, 1, 30, 15);

  const features = [
    { icon: "🏆", title: "Campeonatos", desc: "Torneios abertos e agendados com premiações reais" },
    { icon: "💎", title: "Pontos & XP",  desc: "Acumule pontos nas lojas parceiras e evolua seu nível" },
    { icon: "📱", title: "QR Code",      desc: "Seu código único para receber pontos em segundos" },
    { icon: "🏪", title: "Lojas Parceiras", desc: "Descontos e resgates exclusivos para membros" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: C.navy900,
        flexDirection: "column",
        padding: "70px 80px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <StarField />
      <Scanlines />

      {/* Header */}
      <div style={{ marginBottom: 50, opacity: headerOp, transform: `translateY(${headerY}px)` }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: C.accent,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Plataforma completa
        </div>
        <div
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: C.white,
            letterSpacing: "0.04em",
            lineHeight: 1.1,
          }}
        >
          Tudo que você precisa
        </div>
        <div style={{ marginTop: 12 }}>
          <HLine progress={line1W} />
        </div>
      </div>

      {/* Cards */}
      <div style={{ display: "flex", gap: 20, flex: 1, alignItems: "stretch" }}>
        {features.map((f, i) => (
          <FeatureCard key={i} {...f} delay={20 + i * 12} frame={frame} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 3: How it works (frames 240–360) ──────────────────────────────────
const StepBubble = ({ num, title, desc, delay, frame }) => {
  const op = ease(frame, 0, 1, 20, delay);
  const y  = ease(frame, 30, 0, 20, delay);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        flex: 1,
        opacity: op,
        transform: `translateY(${y}px)`,
        padding: "0 12px",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.blue400}, ${C.accent})`,
          color: C.navy900,
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          boxShadow: `0 0 24px rgba(91,196,245,0.4)`,
        }}
      >
        {num}
      </div>
      <div
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 22,
          fontWeight: 700,
          color: C.white,
          marginBottom: 8,
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 14, color: C.white70, textAlign: "center", lineHeight: 1.6 }}>
        {desc}
      </div>
    </div>
  );
};

const Scene3 = () => {
  const frame = useCurrentFrame();
  const headerOp = ease(frame, 0, 1, 20);
  const headerY  = ease(frame, 30, 0, 20);
  const lineW    = ease(frame, 0, 1, 30, 15);

  const steps = [
    { num: "1", title: "Crie sua conta", desc: "Registre-se em segundos e receba seu QR Code único" },
    { num: "2", title: "Compre nas lojas", desc: "Mostre o código e acumule pontos automaticamente" },
    { num: "3", title: "Jogue campeonatos", desc: "Inscreva-se, ganhe XP e concorra a prêmios reais" },
    { num: "4", title: "Resgate prêmios", desc: "Troque seus pontos por benefícios nas lojas parceiras" },
  ];

  // Connector line progress
  const connectorW = ease(frame, 0, 1, 40, 10);

  return (
    <AbsoluteFill
      style={{
        background: C.navy950,
        flexDirection: "column",
        padding: "70px 80px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <StarField />
      <GlowBG intensity={0.7} />
      <Scanlines />

      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 50,
          opacity: headerOp,
          transform: `translateY(${headerY}px)`,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: C.accent,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Como funciona
        </div>
        <div
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            color: C.white,
            letterSpacing: "0.04em",
          }}
        >
          Simples e rápido
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: 12 }}>
          <div style={{ width: 400 }}>
            <HLine progress={lineW} />
          </div>
        </div>
      </div>

      {/* Connector line behind steps */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 120,
          right: 120,
          height: 2,
          background: `linear-gradient(90deg, ${C.accent}, ${C.blue300})`,
          opacity: 0.2,
          width: `${connectorW * (1920 - 240)}px`,
        }}
      />

      {/* Steps */}
      <div style={{ display: "flex", gap: 0, flex: 1, alignItems: "center" }}>
        {steps.map((s, i) => (
          <StepBubble key={i} {...s} delay={18 + i * 14} frame={frame} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ─── Scene 4: CTA (frames 360–450) ───────────────────────────────────────────
const Scene4 = () => {
  const frame = useCurrentFrame();

  const bgGlow  = 0.5 + 0.5 * Math.sin(frame * 0.1);
  const logoOp  = ease(frame, 0, 1, 20);
  const logoSc  = spring({ frame, fps: 30, from: 0.6, to: 1, durationInFrames: 25, config: { damping: 12 } });
  const titleOp = ease(frame, 0, 1, 20, 15);
  const titleY  = ease(frame, 20, 0, 20, 15);
  const subOp   = ease(frame, 0, 1, 20, 25);
  const btnOp   = ease(frame, 0, 1, 20, 38);
  const btnSc   = spring({ frame: Math.max(0, frame - 38), fps: 30, from: 0.7, to: 1, durationInFrames: 20, config: { damping: 10 } });
  const lineW   = ease(frame, 0, 1, 30, 20);
  const urlOp   = ease(frame, 0, 1, 20, 55);

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${C.navy900}, ${C.navy800})`,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
      }}
    >
      <StarField />
      {/* Animated glow */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 50%, rgba(91,196,245,${0.08 + 0.06 * bgGlow}) 0%, transparent 70%)`,
        }}
      />
      <Scanlines />

      <div style={{ position: "relative", zIndex: 10, padding: "0 80px", maxWidth: 900 }}>
        {/* Mini logo */}
        <div
          style={{
            fontSize: 64,
            marginBottom: 20,
            opacity: logoOp,
            transform: `scale(${logoSc})`,
            filter: `drop-shadow(0 0 20px ${C.accent})`,
          }}
        >
          ⭐
        </div>

        {/* Main CTA */}
        <div
          style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "0.05em",
            lineHeight: 1.05,
            opacity: titleOp,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <span style={{ color: C.white }}>PRONTO PARA </span>
          <span style={{ color: C.accent, textShadow: `0 0 40px ${C.accent}` }}>JOGAR?</span>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", justifyContent: "center", margin: "16px 0", opacity: titleOp }}>
          <div style={{ width: 600 }}>
            <HLine progress={lineW} />
          </div>
        </div>

        {/* Sub */}
        <div
          style={{
            fontSize: 22,
            color: C.white70,
            marginBottom: 40,
            opacity: subOp,
            lineHeight: 1.6,
          }}
        >
          Crie sua conta gratuitamente e comece a acumular pontos hoje mesmo.
        </div>

        {/* CTA Button */}
        <div
          style={{
            display: "inline-block",
            opacity: btnOp,
            transform: `scale(${btnSc})`,
          }}
        >
          <div
            style={{
              background: `linear-gradient(135deg, ${C.blue400}, ${C.accent})`,
              color: C.navy900,
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "18px 56px",
              borderRadius: 12,
              boxShadow: `0 0 40px rgba(91,196,245,0.5), 0 8px 32px rgba(0,0,0,0.4)`,
              textTransform: "uppercase",
            }}
          >
            Criar Conta Grátis →
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            marginTop: 36,
            fontSize: 18,
            color: C.white30,
            letterSpacing: "0.1em",
            opacity: urlOp,
          }}
        >
          celestleague.com.br
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Transition overlay ───────────────────────────────────────────────────────
const FadeTransition = ({ startFrame, duration = 8 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(
    frame,
    [startFrame, startFrame + duration / 2, startFrame + duration],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return (
    <AbsoluteFill
      style={{
        background: C.navy950,
        opacity,
        pointerEvents: "none",
        zIndex: 999,
      }}
    />
  );
};

// ─── Root composition ─────────────────────────────────────────────────────────
export const CelestLeagueAd = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ background: C.navy950, fontFamily: "'Inter', sans-serif" }}>
      {/* Load Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap');
      `}</style>

      {/* Scene 1: Logo Reveal — 0 to 90 */}
      <Sequence from={0} durationInFrames={95}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: Features — 88 to 240 */}
      <Sequence from={88} durationInFrames={155}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: How it works — 238 to 362 */}
      <Sequence from={238} durationInFrames={125}>
        <Scene3 />
      </Sequence>

      {/* Scene 4: CTA — 360 to 450 */}
      <Sequence from={360} durationInFrames={90}>
        <Scene4 />
      </Sequence>

      {/* Transitions */}
      <FadeTransition startFrame={84}  duration={10} />
      <FadeTransition startFrame={234} duration={10} />
      <FadeTransition startFrame={356} duration={10} />
    </AbsoluteFill>
  );
};

// ─── Remotion entry point ─────────────────────────────────────────────────────
// Paste this into your src/Root.tsx:
//
// import { Composition } from "remotion";
// import { CelestLeagueAd } from "./CelestLeagueAd";
//
// export const RemotionRoot = () => (
//   <>
//     <Composition
//       id="CelestLeagueAd"
//       component={CelestLeagueAd}
//       durationInFrames={450}
//       fps={30}
//       width={1920}
//       height={1080}
//     />
//   </>
// );

export default CelestLeagueAd;