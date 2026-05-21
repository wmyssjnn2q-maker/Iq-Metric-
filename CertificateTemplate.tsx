import type { ReportData } from './types';

const DOMAIN_LABELS: Record<string, string> = {
  MATRIX: 'Matryce',
  NUMBER_SERIES: 'Ciągi',
  ANALOGY: 'Analogie',
  SPATIAL: 'Przestrzeń',
  LOGIC: 'Logika',
};

/** A4 poziomo — szablon pod PDF (html2canvas) i e-mail */
export const CertificateTemplate = ({ data, userName }: { data: ReportData; userName: string }) => {
  const certId = `BMQ-${data.stats.iqScore}-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
  const dateStr = new Date(data.timestamp).toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const displayName = userName?.trim() || 'Uczestnik Badania';
  const iqScoreText = String(data.stats.iqScore);
  const iqScoreFontSize =
    iqScoreText.length >= 3 ? '52px' : iqScoreText.length === 2 ? '64px' : '72px';
  const domains = Object.entries(data.stats.domainScores).map(([key, value]) => ({
    key,
    label: DOMAIN_LABELS[key] || key,
    value: Math.max(0, Math.min(100, Math.round(value as number))),
  }));

  const navy = '#0c1e3f';
  const gold = '#c9a227';
  const goldLight = '#e8d5a3';

  return (
    <div
      style={{
        width: '1123px',
        height: '794px',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        fontFamily: 'Georgia, "Times New Roman", serif',
        background: '#faf8f5',
        color: navy,
      }}
    >
      {/* Ramka */}
      <div style={{ position: 'absolute', inset: '14px', border: `3px solid ${navy}`, borderRadius: '4px' }} />
      <div style={{ position: 'absolute', inset: '22px', border: `1px solid ${gold}`, borderRadius: '2px' }} />

      {/* Lewy panel — wynik IQ */}
      <div
        style={{
          position: 'absolute',
          top: '22px',
          left: '22px',
          bottom: '22px',
          width: '340px',
          background: `linear-gradient(165deg, ${navy} 0%, #1a3a6b 55%, #0f2847 100%)`,
          borderRadius: '2px 0 0 2px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '40px 28px 36px',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%', textAlign: 'center' }}>
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: goldLight,
              fontFamily: 'Inter, Arial, sans-serif',
            }}
          >
            brainmediq
          </div>
          <div
            style={{
              marginTop: '6px',
              fontSize: '9px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.45)',
              fontFamily: 'Inter, Arial, sans-serif',
            }}
          >
            Centrum Badań Psychometrycznych
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <div
            style={{
              width: '212px',
              height: '212px',
              margin: '0 auto',
              borderRadius: '50%',
              border: `3px solid ${gold}`,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(255,255,255,0.06)',
              boxShadow: `0 0 0 8px rgba(201, 162, 39, 0.15), inset 0 0 40px rgba(0,0,0,0.2)`,
              overflow: 'hidden',
              boxSizing: 'border-box',
              padding: '26px 16px 22px',
            }}
          >
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: 0,
              }}
            >
              <div
                style={{
                  fontSize: iqScoreFontSize,
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 0.9,
                  letterSpacing: iqScoreText.length >= 3 ? '-0.05em' : '-0.03em',
                  fontVariantNumeric: 'tabular-nums',
                  maxWidth: '100%',
                  textAlign: 'center',
                  whiteSpace: 'nowrap',
                }}
              >
                {iqScoreText}
              </div>
            </div>
            <div
              style={{
                flexShrink: 0,
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: gold,
                fontFamily: 'Inter, Arial, sans-serif',
                lineHeight: 1.2,
                paddingTop: '6px',
              }}
            >
              Wynik IQ
            </div>
          </div>
          <div
            style={{
              marginTop: '22px',
              display: 'inline-block',
              padding: '8px 20px',
              borderRadius: '999px',
              border: `1px solid ${gold}`,
              background: 'rgba(201,162,39,0.12)',
              fontSize: '13px',
              fontWeight: 700,
              color: goldLight,
              fontFamily: 'Inter, Arial, sans-serif',
            }}
          >
            Percentyl {data.stats.percentile}%
          </div>
        </div>

        <div style={{ textAlign: 'center', width: '100%' }}>
          <div
            style={{
              fontSize: '8px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'Inter, Arial, sans-serif',
            }}
          >
            ID dokumentu
          </div>
          <div
            style={{
              marginTop: '6px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Inter, Arial, monospace',
              letterSpacing: '0.06em',
            }}
          >
            {certId}
          </div>
        </div>
      </div>

      {/* Prawa strona — treść */}
      <div
        style={{
          position: 'absolute',
          top: '22px',
          left: '362px',
          right: '22px',
          bottom: '22px',
          padding: '44px 52px 40px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
          <div>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.32em',
                textTransform: 'uppercase',
                color: gold,
                fontFamily: 'Inter, Arial, sans-serif',
              }}
            >
              Certyfikat oficjalny
            </div>
            <h1
              style={{
                margin: '10px 0 0',
                fontSize: '42px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                lineHeight: 1.05,
                color: navy,
              }}
            >
              ILORAZU
              <br />
              INTELIGENCJI
            </h1>
          </div>
          <div style={{ textAlign: 'right', fontFamily: 'Inter, Arial, sans-serif' }}>
            <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#64748b' }}>
              Data badania
            </div>
            <div style={{ marginTop: '6px', fontSize: '13px', fontWeight: 700, color: navy }}>{dateStr}</div>
          </div>
        </div>

        <div style={{ width: '120px', height: '2px', background: `linear-gradient(90deg, ${gold}, transparent)`, marginBottom: '24px' }} />

        <p style={{ margin: '0 0 10px', fontSize: '17px', fontStyle: 'italic', color: '#475569' }}>Niniejszym potwierdza się, że</p>
        <p
          style={{
            margin: '0 0 18px',
            paddingBottom: '10px',
            borderBottom: `2px solid ${gold}`,
            fontSize: '44px',
            fontWeight: 700,
            fontStyle: 'italic',
            color: '#111827',
            lineHeight: 1.1,
          }}
        >
          {displayName}
        </p>
        <p
          style={{
            margin: '0 0 28px',
            maxWidth: '620px',
            fontSize: '14px',
            lineHeight: 1.65,
            color: '#475569',
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          ukończył/a test inteligencji na platformie brainmediq.com i uzyskał/a wynik w pomiarze zdolności poznawczych
          przedstawiony na certyfikacie.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            marginBottom: '22px',
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          {[
            { label: 'Przedział ufności 95%', value: `${data.stats.confidenceInterval[0]} – ${data.stats.confidenceInterval[1]}` },
            ...(data.stats.ageBracketLabel
              ? [{ label: 'Norma wiekowa', value: data.stats.ageBracketLabel }]
              : []),
            { label: 'Model', value: data.isPro ? 'Analiza PRO · CHC' : 'Standard' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 14px rgba(15,23,42,0.05)',
              }}
            >
              <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#94a3b8' }}>
                {item.label}
              </div>
              <div style={{ marginTop: '6px', fontSize: '15px', fontWeight: 800, color: navy }}>{item.value}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.max(1, domains.length)}, 1fr)`,
            gap: '10px',
            marginBottom: 'auto',
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          {domains.map((d) => (
            <div
              key={d.key}
              style={{
                padding: '10px 8px',
                borderRadius: '10px',
                background: '#fff',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: 900, color: navy }}>{d.value}%</div>
              <div style={{ height: '4px', margin: '6px 0', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${d.value}%`, background: `linear-gradient(90deg, ${navy}, ${gold})` }} />
              </div>
              <div style={{ fontSize: '7px', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>
                {d.label}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0',
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: navy }}>brainmediq.com</div>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginTop: '4px' }}>
              Platforma badania online
            </div>
          </div>

          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: `radial-gradient(circle at 35% 30%, #f0d78c, ${gold} 45%, #8a6a2f)`,
              border: `2px solid ${goldLight}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(15,23,42,0.12)',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6">
              <path d="M12 3l2.4 4.8 5.3.8-3.8 3.7.9 5.2L12 15l-4.8 2.5.9-5.2-3.8-3.7 5.3-.8L12 3z" />
            </svg>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '22px', fontWeight: 700, fontStyle: 'italic', color: navy }}>Brainmediq</div>
            <div style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginTop: '4px' }}>
              Autoryzacja systemowa
            </div>
          </div>
        </div>

        <p
          style={{
            margin: '14px 0 0',
            fontSize: '8px',
            color: '#94a3b8',
            lineHeight: 1.5,
            textAlign: 'center',
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          Certyfikat ma charakter informacyjno-rozwojowy i potwierdza wynik uzyskany w teście online. Nie stanowi diagnozy klinicznej ani dokumentu urzędowego.
        </p>
      </div>
    </div>
  );
};
