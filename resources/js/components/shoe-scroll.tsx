import { useEffect, useRef, useState } from 'react';

const FRAME_COUNT = 120;
const JPG_FALLBACK_FRAME_COUNT = 40;
const CANVAS_BACKGROUND = '#050505';

type StoryMoment = {
    key: string;
    start: number;
    end: number;
    text: string;
    position: 'center' | 'left' | 'right';
};

const storyMoments: StoryMoment[] = [
    { key: 'intro', start: 0, end: 0.2, text: 'Nike Apex. Redefined Motion.', position: 'center' },
    { key: 'layered', start: 0.3, end: 0.5, text: 'Layered Precision.', position: 'left' },
    { key: 'engineering', start: 0.6, end: 0.8, text: 'Advanced Cushion Engineering.', position: 'right' },
    { key: 'cta', start: 0.9, end: 1, text: 'Move Beyond.', position: 'center' },
];

const buildFramePath = (index: number) => {
    const oneBased = index + 1;
    const jpgFallbackOneBased = (index % JPG_FALLBACK_FRAME_COUNT) + 1;

    return [
        `/shoe-sequences/frame_${oneBased}_delay-0.04s.webp`,
        `/shoe-sequences/images/frame_${oneBased}_delay-0.04s.webp`,
        `/shoe-sequences/ezgif-frame-${String(jpgFallbackOneBased).padStart(3, '0')}.jpg`,
    ];
};

export default function ShoeScroll() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageCacheRef = useRef<(HTMLImageElement | null)[]>(Array(FRAME_COUNT).fill(null));
    const [loadedFrames, setLoadedFrames] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [activeMoment, setActiveMoment] = useState<StoryMoment | null>(storyMoments[0]);

    useEffect(() => {
        let cancelled = false;

        const loadImageForFrame = (frameIndex: number, sourceIndex = 0): Promise<void> => {
            if (cancelled) {
                return Promise.resolve();
            }

            const sources = buildFramePath(frameIndex);

            return new Promise((resolve) => {
                const image = new Image();
                image.src = sources[sourceIndex];

                image.onload = () => {
                    if (!cancelled) {
                        imageCacheRef.current[frameIndex] = image;
                        setLoadedFrames((current) => current + 1);
                    }
                    resolve();
                };

                image.onerror = () => {
                    if (sourceIndex < sources.length - 1) {
                        void loadImageForFrame(frameIndex, sourceIndex + 1).then(resolve);
                        return;
                    }

                    if (!cancelled) {
                        setLoadedFrames((current) => current + 1);
                    }
                    resolve();
                };
            });
        };

        const loadFrames = async () => {
            await Promise.all(Array.from({ length: FRAME_COUNT }, (_, index) => loadImageForFrame(index)));
            if (!cancelled) {
                setIsLoaded(true);
            }
        };

        void loadFrames();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas || !isLoaded) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        let rafId = 0;
        let smoothedFrame = 0;

        const drawFrame = (frameValue: number) => {
            const clampedFrame = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(frameValue)));
            const image = imageCacheRef.current[clampedFrame];

            const devicePixelRatio = window.devicePixelRatio || 1;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            canvas.width = viewportWidth * devicePixelRatio;
            canvas.height = viewportHeight * devicePixelRatio;
            canvas.style.width = `${viewportWidth}px`;
            canvas.style.height = `${viewportHeight}px`;

            context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
            context.fillStyle = CANVAS_BACKGROUND;
            context.fillRect(0, 0, viewportWidth, viewportHeight);

            if (!image) {
                return;
            }

            const imageAspectRatio = image.width / image.height;
            const viewportAspectRatio = viewportWidth / viewportHeight;

            let drawWidth = viewportWidth;
            let drawHeight = viewportHeight;

            if (imageAspectRatio > viewportAspectRatio) {
                drawHeight = viewportWidth / imageAspectRatio;
            } else {
                drawWidth = viewportHeight * imageAspectRatio;
            }

            const x = (viewportWidth - drawWidth) / 2;
            const y = (viewportHeight - drawHeight) / 2;

            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.drawImage(image, x, y, drawWidth, drawHeight);
        };

        const getScrollProgress = () => {
            const rect = container.getBoundingClientRect();
            const totalScroll = container.offsetHeight - window.innerHeight;
            const progress = totalScroll > 0 ? Math.min(1, Math.max(0, -rect.top / totalScroll)) : 0;

            return progress;
        };

        const animate = () => {
            const progress = getScrollProgress();
            const targetFrame = progress * (FRAME_COUNT - 1);
            smoothedFrame += (targetFrame - smoothedFrame) * 0.16;

            drawFrame(smoothedFrame);

            const nextMoment = storyMoments.find((moment) => progress >= moment.start && progress <= moment.end) ?? null;
            setActiveMoment((previous) => (previous?.key === nextMoment?.key ? previous : nextMoment));

            rafId = window.requestAnimationFrame(animate);
        };

        rafId = window.requestAnimationFrame(animate);

        return () => {
            window.cancelAnimationFrame(rafId);
        };
    }, [isLoaded]);

    return (
        <section ref={containerRef} className="relative h-[400vh] bg-[#050505] text-white font-[Inter,San_Francisco,system-ui,sans-serif]">
            <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#050505]">
                <canvas ref={canvasRef} className="h-screen w-full bg-[#050505]" />

                {!isLoaded && (
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#050505]">
                        <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
                        <p className="text-sm tracking-tight text-white/60">Loading motion sequence… {Math.round((loadedFrames / FRAME_COUNT) * 100)}%</p>
                    </div>
                )}

                {activeMoment && isLoaded && (
                    <div
                        className={`pointer-events-none absolute inset-x-0 z-20 mx-auto w-full max-w-6xl px-6 sm:px-10 ${
                            activeMoment.position === 'left'
                                ? 'text-left'
                                : activeMoment.position === 'right'
                                  ? 'text-right'
                                  : 'text-center'
                        }`}
                    >
                        <h1 className="text-3xl leading-tight font-semibold tracking-tight text-white/90 sm:text-4xl md:text-5xl">{activeMoment.text}</h1>
                    </div>
                )}
            </div>
        </section>
    );
}
