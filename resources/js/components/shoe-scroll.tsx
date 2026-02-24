import { useEffect, useMemo, useRef, useState } from 'react';

type StoryMoment = {
    align: 'left' | 'center' | 'right';
    end: number;
    start: number;
    text: string;
};

const FRAME_COUNT = 120;

const storyMoments: StoryMoment[] = [
    { text: 'Nike Apex. Redefined Motion.', start: 0, end: 0.22, align: 'center' },
    { text: 'Layered Precision.', start: 0.3, end: 0.5, align: 'left' },
    { text: 'Advanced Cushion Engineering.', start: 0.6, end: 0.82, align: 'right' },
    { text: 'Move Beyond.', start: 0.9, end: 1, align: 'center' },
];

export default function ShoeScroll() {
    const sectionRef = useRef<HTMLElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [loadedFrames, setLoadedFrames] = useState<HTMLImageElement[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [scrollProgress, setScrollProgress] = useState(0);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    const framePaths = useMemo(
        () => Array.from({ length: FRAME_COUNT }, (_, index) => `/shoe-sequences/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`),
        [],
    );

    const drawFrame = (frame: number) => {
        const canvas = canvasRef.current;
        const image = loadedFrames[frame];

        if (!canvas || !image) {
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;

        if (canvas.width !== viewportWidth * dpr || canvas.height !== viewportHeight * dpr) {
            canvas.width = viewportWidth * dpr;
            canvas.height = viewportHeight * dpr;
            canvas.style.width = `${viewportWidth}px`;
            canvas.style.height = `${viewportHeight}px`;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        context.clearRect(0, 0, viewportWidth, viewportHeight);

        const scale = Math.min(viewportWidth / image.width, viewportHeight / image.height);
        const drawWidth = image.width * scale;
        const drawHeight = image.height * scale;
        const drawX = (viewportWidth - drawWidth) / 2;
        const drawY = (viewportHeight - drawHeight) / 2;

        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    };

    useEffect(() => {
        let cancelled = false;

        const preloadFrames = async () => {
            const loaded = await Promise.all(
                framePaths.map(
                    (source) =>
                        new Promise<HTMLImageElement>((resolve) => {
                            const image = new Image();
                            image.src = source;
                            image.onload = () => resolve(image);
                            image.onerror = () => resolve(image);
                        }),
                ),
            );

            if (!cancelled) {
                setLoadedFrames(loaded);
                setIsLoading(false);
            }
        };

        preloadFrames();

        return () => {
            cancelled = true;
        };
    }, [framePaths]);

    useEffect(() => {
        if (isLoading || loadedFrames.length === 0) {
            return;
        }

        drawFrame(currentFrameRef.current);

        const onResize = () => drawFrame(currentFrameRef.current);
        window.addEventListener('resize', onResize);

        return () => {
            window.removeEventListener('resize', onResize);
        };
    }, [isLoading, loadedFrames]);

    useEffect(() => {
        const handleScroll = () => {
            const section = sectionRef.current;

            if (!section || isLoading || loadedFrames.length === 0) {
                return;
            }

            const rect = section.getBoundingClientRect();
            const totalScrollable = section.offsetHeight - window.innerHeight;
            const scrolledWithinSection = Math.min(totalScrollable, Math.max(0, -rect.top));
            const progress = totalScrollable > 0 ? scrolledWithinSection / totalScrollable : 0;
            const maxFrameIndex = FRAME_COUNT - 1;
            const nextFrame = Math.min(maxFrameIndex, Math.max(0, Math.round(progress * maxFrameIndex)));

            setScrollProgress(progress);

            if (nextFrame === currentFrameRef.current) {
                return;
            }

            currentFrameRef.current = nextFrame;

            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }

            rafRef.current = requestAnimationFrame(() => {
                drawFrame(nextFrame);
            });
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [isLoading, loadedFrames]);

    useEffect(
        () => () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        },
        [],
    );

    return (
        <section ref={sectionRef} className="relative mb-10 h-[400vh] bg-black font-['Inter','SF_Pro_Display','San_Francisco',system-ui,sans-serif]">
            <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-black">
                <canvas ref={canvasRef} className="h-screen w-full" />

                {isLoading ? (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-slate-700" />
                    </div>
                ) : null}

                <div className="pointer-events-none absolute inset-0 z-20">
                    {storyMoments.map((moment) => {
                        const alignClass =
                            moment.align === 'left'
                                ? 'items-start text-left pl-[8vw]'
                                : moment.align === 'right'
                                  ? 'items-end text-right pr-[8vw]'
                                  : 'items-center text-center';

                        const opacity = scrollProgress >= moment.start && scrollProgress <= moment.end ? 1 : 0;

                        return (
                            <div
                                key={moment.text}
                                className={`absolute inset-0 flex transition-opacity duration-500 ${alignClass}`}
                                style={{ opacity }}
                            >
                                <div className="mt-[14vh] max-w-2xl px-6 tracking-tight">
                                    <h2 className="text-3xl font-semibold text-white/90 md:text-5xl">{moment.text}</h2>
                                    <p className="mt-3 text-sm text-white/60 md:text-base">
                                        {moment.text === 'Move Beyond.' ? 'Discover the next chapter in performance design.' : ''}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
