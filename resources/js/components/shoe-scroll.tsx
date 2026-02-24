import { useEffect, useMemo, useRef, useState } from 'react';

type StoryBlock = {
    align: 'left' | 'center' | 'right';
    body?: string;
    title: string;
    trigger: number;
};

const totalImages = 40;
const totalVirtualFrames = 120;

const storyBlocks: StoryBlock[] = [
    { trigger: 0, title: 'Nike Apex. Redefined Motion.', align: 'center' },
    { trigger: 0.3, title: 'Layered Precision.', body: 'Shoe components begin separating.', align: 'left' },
    {
        trigger: 0.6,
        title: 'Advanced Cushion Engineering.',
        body: 'Internal foam, mesh, outsole, gel units, and stitching layers revealed.',
        align: 'right',
    },
    { trigger: 0.9, title: 'Move Beyond.', body: 'Shoe reassembles for the next leap.', align: 'center' },
];

export default function ShoeScroll() {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const loadedFramesRef = useRef<HTMLImageElement[]>([]);
    const targetFrameRef = useRef(0);
    const currentFrameRef = useRef(0);
    const rafRef = useRef<number | null>(null);

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);

    const activeStoryIndex = useMemo(() => {
        if (scrollProgress >= 0.9) return 3;
        if (scrollProgress >= 0.6) return 2;
        if (scrollProgress >= 0.3) return 1;
        return 0;
    }, [scrollProgress]);

    const drawFrame = (frameIndex: number) => {
        const canvas = canvasRef.current;
        const image = loadedFramesRef.current[frameIndex];

        if (!canvas || !image) {
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        if (!width || !height) {
            return;
        }

        const nextWidth = Math.floor(width * dpr);
        const nextHeight = Math.floor(height * dpr);

        if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
            canvas.width = nextWidth;
            canvas.height = nextHeight;
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, width, height);
        context.fillStyle = '#050505';
        context.fillRect(0, 0, width, height);

        const scale = Math.min(width / image.naturalWidth, height / image.naturalHeight);
        const drawWidth = image.naturalWidth * scale;
        const drawHeight = image.naturalHeight * scale;
        const x = (width - drawWidth) / 2;
        const y = (height - drawHeight) / 2;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, x, y, drawWidth, drawHeight);
    };

    useEffect(() => {
        let canceled = false;
        let loadedCount = 0;

        const framePromises = Array.from({ length: totalImages }, (_, index) => {
            const frameNumber = String(index + 1).padStart(3, '0');

            return new Promise<HTMLImageElement>((resolve) => {
                const image = new Image();
                image.decoding = 'async';
                image.src = `/shoe-sequences/ezgif-frame-${frameNumber}.jpg`;

                image.onload = () => {
                    loadedCount += 1;
                    setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
                    resolve(image);
                };

                image.onerror = () => {
                    loadedCount += 1;
                    setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
                    resolve(image);
                };
            });
        });

        Promise.all(framePromises).then((frames) => {
            if (canceled) {
                return;
            }

            loadedFramesRef.current = frames;
            setIsLoaded(true);
            drawFrame(0);
        });

        return () => {
            canceled = true;
        };
    }, []);

    useEffect(() => {
        if (!isLoaded) {
            return;
        }

        const tick = () => {
            const delta = targetFrameRef.current - currentFrameRef.current;

            if (Math.abs(delta) > 0.01) {
                currentFrameRef.current += delta * 0.2;
            } else {
                currentFrameRef.current = targetFrameRef.current;
            }

            const safeFrameIndex = Math.max(0, Math.min(totalImages - 1, Math.round(currentFrameRef.current)));
            drawFrame(safeFrameIndex);
            rafRef.current = window.requestAnimationFrame(tick);
        };

        rafRef.current = window.requestAnimationFrame(tick);

        const handleResize = () => {
            drawFrame(Math.round(currentFrameRef.current));
        };

        window.addEventListener('resize', handleResize);

        return () => {
            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current);
            }
            window.removeEventListener('resize', handleResize);
        };
    }, [isLoaded]);

    useEffect(() => {
        const updateProgress = () => {
            const wrapper = wrapperRef.current;
            if (!wrapper) {
                return;
            }

            const rect = wrapper.getBoundingClientRect();
            const totalScrollable = wrapper.offsetHeight - window.innerHeight;
            const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(totalScrollable, 1));
            const value = scrolled / Math.max(totalScrollable, 1);

            setScrollProgress(value);

            const virtualFrame = value * (totalVirtualFrames - 1);
            const mappedFrame = Math.floor(virtualFrame / ((totalVirtualFrames - 1) / (totalImages - 1)));
            targetFrameRef.current = Math.max(0, Math.min(totalImages - 1, mappedFrame));
        };

        updateProgress();
        window.addEventListener('scroll', updateProgress, { passive: true });
        window.addEventListener('resize', updateProgress);

        return () => {
            window.removeEventListener('scroll', updateProgress);
            window.removeEventListener('resize', updateProgress);
        };
    }, []);

    return (
        <section className="relative mb-12 -mx-4 bg-[#050505] sm:-mx-6 lg:-mx-8">
            <div ref={wrapperRef} className="relative h-[400vh]">
                <canvas ref={canvasRef} className="sticky top-0 h-screen w-full" />

                {!isLoaded ? (
                    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3 text-white/60">
                            <span className="h-9 w-9 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
                            <span className="text-sm tracking-tight">Loading sequence... {loadingProgress}%</span>
                        </div>
                    </div>
                ) : null}

                <div className="pointer-events-none absolute inset-0 z-10">
                    {storyBlocks.map((block, index) => {
                        const isActive = index === activeStoryIndex;
                        const alignmentClass =
                            block.align === 'left'
                                ? 'items-start text-left'
                                : block.align === 'right'
                                  ? 'items-end text-right'
                                  : 'items-center text-center';

                        return (
                            <div
                                key={block.title}
                                className={`sticky top-0 flex h-screen px-6 sm:px-12 ${alignmentClass} justify-center transition-opacity duration-500 ${
                                    isActive ? 'opacity-100' : 'opacity-0'
                                }`}
                            >
                                <div className="max-w-xl space-y-3 tracking-tight">
                                    <h2 className="text-3xl font-semibold text-white/90 sm:text-5xl">{block.title}</h2>
                                    {block.body ? <p className="text-base text-white/60 sm:text-lg">{block.body}</p> : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
