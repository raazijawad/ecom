import AppLink from '@/components/app-link';

type HeroBannerData = {
    title?: string | null;
    badge_text?: string | null;
    headline?: string | null;
    description?: string | null;
    cta_text?: string | null;
    image_path?: string | null;
    product_id?: number | null;
};

type Props = {
    banner?: HeroBannerData | null;
};

const FALLBACK_HEADLINE = ['CREATE', 'YOUR', 'OWN', 'STYLE'];

const resolveStorageUrl = (path: string | null | undefined): string | null => {
    if (!path) {
        return null;
    }

    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
        return path;
    }

    return `/storage/${path}`;
};

export default function HeroBanner({ banner }: Props) {
    const headlineParts = (banner?.headline ?? '')
        .split(/\s+/)
        .map((part) => part.trim())
        .filter(Boolean);

    const headlineLines = (headlineParts.length > 0 ? headlineParts : FALLBACK_HEADLINE).slice(0, 4);
    const lineOne = headlineLines[0] ?? FALLBACK_HEADLINE[0];
    const lineTwo = headlineLines[1] ?? FALLBACK_HEADLINE[1];
    const lineThree = headlineLines[2] ?? FALLBACK_HEADLINE[2];
    const lineFour = headlineLines[3] ?? FALLBACK_HEADLINE[3];
    const ctaHref = banner?.product_id ? `/products/${banner.product_id}` : '/shoes';
    const description =
        banner?.description ??
        'Step into premium comfort and style with our exclusive Nike collection. Elevate your game with cutting-edge design, ultimate performance, and unbeatable quality.';
    const bannerImage = resolveStorageUrl(banner?.image_path) ?? '/images/hero/hero-shoe.png';

    return (
        <section className="relative w-full overflow-hidden bg-[#1a2e1a]" style={{ minHeight: '85vh' }}>
            {/* Background tropical leaves */}
            <div className="absolute inset-0">
                <img
                    src="/images/hero/tropical-leaves-bg.jpg"
                    alt=""
                    className="h-full w-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f0d]/90 via-[#1a2e1a]/80 to-[#0d1f0d]/95" />
            </div>

            {/* Main content container */}
            <div className="relative z-10 mx-auto flex h-full min-h-[85vh] max-w-[1400px] flex-col justify-between px-6 py-10 lg:px-12 lg:py-14">
                {/* Top row: CREATE + description */}
                <div className="flex items-start justify-between">
                    <h1
                        className="hero-heading select-none text-[clamp(60px,10vw,140px)] leading-[0.85] font-extrabold tracking-tighter text-white uppercase"
                        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                    >
                        {lineOne}
                    </h1>

                    <p className="mt-4 hidden max-w-[260px] text-[13px] leading-relaxed text-gray-300/90 md:block lg:mr-8">
                        {description}
                    </p>
                </div>

                {/* Middle row: YOUR text (right-aligned) */}
                <div className="flex justify-end">
                    <span
                        className="hero-heading select-none text-[clamp(60px,10vw,140px)] leading-[0.85] font-extrabold tracking-tighter text-white uppercase"
                        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                    >
                        {lineTwo}
                    </span>
                </div>

                {/* Bottom row: OWN (outlined) + STYLE */}
                <div className="flex items-end justify-between">
                    <span
                        className="hero-heading select-none text-[clamp(60px,10vw,140px)] leading-[0.85] font-extrabold tracking-tighter uppercase"
                        style={{
                            fontFamily: "'Instrument Sans', sans-serif",
                            WebkitTextStroke: '2px rgba(255,255,255,0.5)',
                            color: 'transparent',
                        }}
                    >
                        {lineThree}
                    </span>

                    <span
                        className="hero-heading select-none text-[clamp(60px,10vw,140px)] leading-[0.85] font-extrabold tracking-tighter text-white uppercase"
                        style={{ fontFamily: "'Instrument Sans', sans-serif" }}
                    >
                        {lineFour}
                    </span>
                </div>
            </div>

            {/* Shoe image - centered overlay */}
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                <img
                    src={bannerImage}
                    alt={banner?.title ?? 'Premium sneaker on rock'}
                    className="h-auto w-[55%] max-w-[650px] min-w-[280px] object-contain drop-shadow-2xl"
                />
            </div>

            {banner?.cta_text ? (
                <div className="absolute right-6 bottom-8 z-30 lg:right-12 lg:bottom-12">
                    <AppLink
                        href={ctaHref}
                        className="inline-flex rounded-full border border-white/30 px-5 py-3 text-xs font-semibold tracking-[0.15em] text-white uppercase transition-all hover:border-white/60"
                    >
                        {banner.cta_text}
                    </AppLink>
                </div>
            ) : null}

            {/* SCROLL button - bottom left */}
            <div className="absolute bottom-8 left-6 z-30 lg:bottom-12 lg:left-12">
                <button
                    type="button"
                    onClick={() => {
                        window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                    }}
                    className="flex h-[70px] w-[70px] items-center justify-center rounded-full border border-white/30 text-[10px] font-semibold tracking-[0.2em] text-white/80 uppercase transition-all hover:border-white/60 hover:text-white"
                >
                    SCROLL
                </button>
            </div>

            {/* Mobile description - visible on small screens */}
            <div className="absolute right-6 bottom-24 z-30 md:hidden">
                <p className="max-w-[200px] text-[11px] leading-relaxed text-gray-300/80">
                    {description}
                </p>
            </div>
        </section>
    );
}
