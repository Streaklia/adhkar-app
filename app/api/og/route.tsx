import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get('title') || 'دُعَاء | أذكار وتسبيح يومي';
    const subtitle = searchParams.get('subtitle') || 'تطبيق إسلامي فائق البساطة وموجه للجوال والحاسوب';
    const category = searchParams.get('category') || 'أذكار وأدعية مأثورة';

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
            backgroundImage: 'radial-gradient(circle at 50% 35%, #064e3b 0%, #032119 45%, #000000 85%)',
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
            direction: 'rtl',
            padding: '60px 80px',
            position: 'relative',
          }}
        >
          {/* Subtle border */}
          <div
            style={{
              position: 'absolute',
              inset: 30,
              border: '2px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 28,
            }}
          />

          {/* Category Pill */}
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
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#10b981',
              }}
            />
            <span style={{ fontSize: 22, fontWeight: 700, color: '#34d399' }}>
              {category}
            </span>
          </div>

          {/* Main Title */}
          <h1
            style={{
              fontSize: 54,
              fontWeight: 800,
              textAlign: 'center',
              lineHeight: 1.3,
              color: '#f4f4f5',
              margin: '0 0 18px 0',
              maxWidth: 1000,
            }}
          >
            {title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 24,
              color: '#a1a1aa',
              textAlign: 'center',
              margin: 0,
              maxWidth: 900,
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>

          {/* Footer branding */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginTop: 44,
              color: '#71717a',
              fontSize: 20,
            }}
          >
            <span style={{ color: '#10b981', fontWeight: 700 }}>دُعَاء</span>
            <span>•</span>
            <span>adhkarr.vercel.app</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const error = e as Error;
    return new Response(`Failed to generate the image: ${error.message}`, {
      status: 500,
    });
  }
}
