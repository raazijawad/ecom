import { ChevronDown } from 'lucide-react';
import heroBg from '@/assets/hero-bg.jpeg';
import sneakerImg from '@/assets/sneaker.png';

const HeroSection = () => {
    const scrollToContent = () => {
        const nextSection = document.querySelector('#content');
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative min-h-screen w-full overflow-hidden bg-black">
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${heroBg})` }} />

            {/* Dark Overlay / Vignette */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/70" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

            {/* Oversized Typography - Absolute Positioned */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* CREATE - Top Left */}
                <span
                    className="absolute font-extralight tracking-wider text-white/15 select-none"
                    style={{
                        fontSize: 'clamp(80px, 15vw, 200px)',
                        lineHeight: '0.85',
                        top: '8%',
                        left: '5%',
                    }}
                >
                    CREATE
                </span>

                {/* YOUR - Upper Right */}
                <span
                    className="absolute font-extralight tracking-wider text-white/10 select-none"
                    style={{
                        fontSize: 'clamp(60px, 12vw, 160px)',
                        lineHeight: '0.85',
                        top: '15%',
                        right: '8%',
                    }}
                >
                    YOUR
                </span>

                {/* OWN - Middle Left */}
                <span
                    className="absolute font-extralight tracking-wider text-white/12 select-none"
                    style={{
                        fontSize: 'clamp(70px, 14vw, 180px)',
                        lineHeight: '0.85',
                        top: '45%',
                        left: '3%',
                    }}
                >
                    OWN
                </span>

                {/* STYLE - Bottom Right */}
                <span
                    className="absolute font-extralight tracking-wider text-white/15 select-none"
                    style={{
                        fontSize: 'clamp(80px, 16vw, 220px)',
                        lineHeight: '0.85',
                        bottom: '10%',
                        right: '5%',
                    }}
                >
                    STYLE
                </span>
            </div>

            {/* Main Content Container */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
                {/* Product Image - Centered */}
                <div className="absolute top-1/2 left-1/2 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4">
                    <img
                        src={sneakerImg}
                        alt="Nike Sneaker"
                        className="h-auto w-full -rotate-12 transform object-contain drop-shadow-2xl transition-transform duration-700 hover:rotate-0"
                    />
                </div>

                {/* Description - Top Right */}
                <div className="absolute top-24 right-8 max-w-xs text-right md:right-16">
                    <p className="text-sm leading-relaxed text-white/75 md:text-base">
                        Step into premium comfort and style with our exclusive Nike collection. Elevate your game with cutting-edge design,
                        ultimate performance, and unbeatable quality.
                    </p>
                </div>

                {/* Scroll Button - Bottom Left */}
                <button onClick={scrollToContent} className="group absolute bottom-12 left-8 md:left-16">
                    <div className="flex flex-col items-center gap-4">
                        {/* Vertical Line Indicator */}
                        <div className="h-16 w-px bg-gradient-to-b from-white/0 via-white/40 to-white/40" />

                        {/* Circular Scroll Button */}
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/40 transition-colors duration-300 group-hover:border-white/70">
                            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/90">Scroll</span>
                            <ChevronDown className="absolute -bottom-1 h-3 w-3 animate-bounce text-white/60" />
                        </div>
                    </div>
                </button>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-white/20" />
            <div className="absolute top-1/3 right-1/3 h-1 w-1 rounded-full bg-white/30" />
            <div className="absolute bottom-1/3 left-1/4 h-1.5 w-1.5 rounded-full bg-white/20" />
        </section>
    );
};

export default HeroSection;
