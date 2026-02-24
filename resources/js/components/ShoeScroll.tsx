import { useEffect, useMemo, useRef, useState } from 'react';

type Storybeat = {
    threshold: number;
    align: 'left' | 'center' | 'right';
    title: string;
    description?: string;
};

const FRAME_COUNT = 120;
const FRAME_PATH = (index: number) => `/shoe-sequences/frame_${index}_delay-0.04s.webp`;

const storybeats: Storybeat[] = [
    { threshold: 0, align: 'center', title: 'Nike Apex. Redefined Motion.' },
    { threshold: 0.3, align: 'left', title: 'Layered Precision.', description: 'Components separate with exacting control.' },
    {
        threshold: 0.6,
        align: 'right',
        title: 'Advanced Cushion Engineering.',
        description: 'Internal foam, mesh, outsole, gel units, and stitching revealed.',
    },
    { threshold: 0.9, align: 'center', title: 'Move Beyond.', description: 'Reassembled for the next stride.' },
];

const getStorybeatIndex = (progress: number) => {
    for (let index = storybeats.length - 1; index >= 0; index -= 1) {
        if (progress >= storybeats[index].threshold) {
            return index;
        }
    }

    return 0;
};

export default function ShoeScroll() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const rafRef = useRef<number | null>(null);
    const targetFrameRef = useRef(0);
    const renderedFrameRef = useRef(0);
    const lastDrawnFrameRef = useRef(-1);
    const [loadedFrames, setLoadedFrames] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [progress, setProgress] = useState(0);

    const activeStorybeat = useMemo(() => storybeats[getStorybeatIndex(progress)], [progress]);

    useEffect(() => {
        let cancelled = false;

        const preloadFrames = async () => {
            const images = Array.from({ length: FRAME_COUNT }, (_, index) => {
                const image = new Image();
                image.src = FRAME_PATH(index);
                image.decoding = 'async';
                return image;
            });

            imagesRef.current = images;

            await Promise.all(
                images.map(
                    (image) =>
                        new Promise<void>((resolve) => {
                            const finalize = () => {
                                setLoadedFrames((count) => count + 1);
                                resolve();
                            };

                            image.addEventListener('load', finalize, { once: true });
                            image.addEventListener('error', finalize, { once: true });
                        }),
                ),
            );

            if (!cancelled) {
                setIsReady(true);
            }
        };

        preloadFrames();

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!isReady) {
            return;
        }

        const drawFrame = (frame: number) => {
            const canvas = canvasRef.current;
            const image = imagesRef.current[frame];
            if (!canvas || !image) {
                return;
            }

            const context = canvas.getContext('2d');
            if (!context) {
                return;
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const pixelRatio = window.devicePixelRatio || 1;
            const nextWidth = Math.floor(viewportWidth * pixelRatio);
            const nextHeight = Math.floor(viewportHeight * pixelRatio);

            if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
                canvas.width = nextWidth;
                canvas.height = nextHeight;
                canvas.style.width = `${viewportWidth}px`;
                canvas.style.height = `${viewportHeight}px`;
            }

            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
            context.clearRect(0, 0, viewportWidth, viewportHeight);

            const scale = Math.min(viewportWidth / image.width, viewportHeight / image.height);
            const drawWidth = image.width * scale;
            const drawHeight = image.height * scale;
            const drawX = (viewportWidth - drawWidth) / 2;
            const drawY = (viewportHeight - drawHeight) / 2;

            context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
        };

        const animate = () => {
            renderedFrameRef.current += (targetFrameRef.current - renderedFrameRef.current) * 0.18;
            const nextFrame = Math.round(renderedFrameRef.current);

            if (nextFrame !== lastDrawnFrameRef.current) {
                lastDrawnFrameRef.current = nextFrame;
                drawFrame(Math.max(0, Math.min(FRAME_COUNT - 1, nextFrame)));
            }

            rafRef.current = window.requestAnimationFrame(animate);
        };

        const updateProgress = () => {
            const container = containerRef.current;
            if (!container) {
                return;
            }

            const rect = container.getBoundingClientRect();
            const scrollable = Math.max(container.offsetHeight - window.innerHeight, 1);
            const nextProgress = Math.min(Math.max(-rect.top / scrollable, 0), 1);
            targetFrameRef.current = nextProgress * (FRAME_COUNT - 1);
            setProgress(nextProgress);
        };

        updateProgress();
        drawFrame(0);
        rafRef.current = window.requestAnimationFrame(animate);
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);

        return () => {
            if (rafRef.current) {
                window.cancelAnimationFrame(rafRef.current);
            }
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, [isReady]);

    const textAlignmentClass =
        activeStorybeat.align === 'left'
            ? 'items-start text-left'
            : activeStorybeat.align === 'right'
              ? 'items-end text-right'
              : 'items-center text-center';

    return (
        <section className="relative left-1/2 mb-12 w-screen -translate-x-1/2 bg-[#050505] text-white">
            <div ref={containerRef} className="relative h-[400vh]">
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    {!isReady ? (
                        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-[#050505]">
                            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
                            <p className="text-sm tracking-tight text-white/60">Loading sequence {loadedFrames}/{FRAME_COUNT}</p>
                        </div>
                    ) : null}

                    <canvas ref={canvasRef} className="h-screen w-full" aria-label="Nike anti-gravity shoe sequence" />

                    <div className={`pointer-events-none absolute inset-0 z-20 flex px-6 md:px-16 ${textAlignmentClass}`}>
                        <div className="mt-[16vh] max-w-2xl space-y-3 tracking-tight transition-all duration-500">
                            <h1 className="text-3xl font-semibold text-white/90 md:text-5xl">{activeStorybeat.title}</h1>
                            {activeStorybeat.description ? <p className="text-base text-white/60 md:text-lg">{activeStorybeat.description}</p> : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
