import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'دُعَاء | أذكار وتسبيح يومي فائق البساطة';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          backgroundImage: 'radial-gradient(circle at 50% 40%, #064e3b 0%, #022c22 45%, #000000 85%)',
          color: '#ffffff',
          fontFamily: 'system-ui, sans-serif',
          direction: 'rtl',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Subtle decorative geometric border */}
        <div
          style={{
            position: 'absolute',
            inset: 30,
            border: '2px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 28,
          }}
        />

        {/* Brand Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '10px 24px',
            borderRadius: 9999,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#10b981',
            }}
          />
          <span style={{ fontSize: 24, fontWeight: 700, color: '#34d399' }}>
            تطبيق دُعَاء
          </span>
        </div>

        {/* Main Title */}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            textAlign: 'center',
            lineHeight: 1.3,
            color: '#f4f4f5',
            margin: '0 0 20px 0',
            maxWidth: 1000,
          }}
        >
          أذكار وتسبيح يومي فائق البساطة
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 26,
            color: '#a1a1aa',
            textAlign: 'center',
            margin: 0,
            maxWidth: 900,
            lineHeight: 1.5,
          }}
        >
          أذكار الصباح والمساء • بعد الصلاة • دليل الصلاة • أدعية السفر • يوم الجمعة • بر الوالدين
        </p>

        {/* Badges footer */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            marginTop: 40,
          }}
        >
          <div
            style={{
              backgroundColor: '#09090b',
              border: '1px solid #27272a',
              padding: '8px 18px',
              borderRadius: 12,
              fontSize: 18,
              color: '#10b981',
            }}
          >
            ⚡ سريع وخفيف
          </div>
          <div
            style={{
              backgroundColor: '#09090b',
              border: '1px solid #27272a',
              padding: '8px 18px',
              borderRadius: 12,
              fontSize: 18,
              color: '#10b981',
            }}
          >
            📱 متوافق مع الجوال والحاسوب
          </div>
          <div
            style={{
              backgroundColor: '#09090b',
              border: '1px solid #27272a',
              padding: '8px 18px',
              borderRadius: 12,
              fontSize: 18,
              color: '#10b981',
            }}
          >
            📴 يعمل دون إنترنت
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
