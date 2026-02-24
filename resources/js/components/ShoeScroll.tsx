import { useEffect, useMemo, useRef, useState } from 'react';

type OverlayCopy = {
    label: string;
    align: 'left' | 'center' | 'right';
    at: number;
};

const FRAME_COUNT = 120;
const overlays: OverlayCopy[] = [
    { label: 'Nike Apex. Redefined Motion.', align: 'center', at: 0 },
    { label: 'Layered Precision.', align: 'left', at: 0.3 },
    { label: 'Advanced Cushion Engineering.', align: 'right', at: 0.6 },
    { label: 'Move Beyond.', align: 'center', at: 0.9 },
];

export default function ShoeScroll() {
    const stickySectionRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [loadedCount, setLoadedCount] = useState(0);
    const [progress, setProgress] = useState(0);

    const imagePaths = useMemo(
        () => Array.from({ length: FRAME_COUNT }, (_, index) => `/shoe-sequences/images/frame_${index}_delay-0.04s.webp`),
        [],
    );

    const imageFramesRef = useRef<HTMLImageElement[]>([]);
    const targetFrameRef = useRef(0);
    const renderedFrameRef = useRef(0);
    const animationRef = useRef<number | null>(null);

    useEffect(() => {
        const frames = imagePaths.map((path) => {
            const frame = new Image();
            frame.src = path;
            frame.onload = () => setLoadedCount((prev) => prev + 1);
            frame.onerror = () => setLoadedCount((prev) => prev + 1);
            return frame;
        });

        imageFramesRef.current = frames;

        return () => {
            frames.forEach((frame) => {
                frame.onload = null;
                frame.onerror = null;
            });
        };
    }, [imagePaths]);

    const drawFrame = (frameIndex: number) => {
        const canvas = canvasRef.current;
        const image = imageFramesRef.current[frameIndex];

        if (!canvas || !image) {
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        const dpr = window.devicePixelRatio || 1;
        const cssWidth = canvas.clientWidth;
        const cssHeight = canvas.clientHeight;
        const canvasWidth = Math.floor(cssWidth * dpr);
        const canvasHeight = Math.floor(cssHeight * dpr);

        if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0);
        context.clearRect(0, 0, cssWidth, cssHeight);

        if (!image.naturalWidth || !image.naturalHeight) {
            return;
        }

        const ratio = Math.min(cssWidth / image.naturalWidth, cssHeight / image.naturalHeight);
        const drawWidth = image.naturalWidth * ratio;
        const drawHeight = image.naturalHeight * ratio;
        const drawX = (cssWidth - drawWidth) / 2;
        const drawY = (cssHeight - drawHeight) / 2;

        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = 'high';
        context.drawImage(image, drawX, drawY, drawWidth, drawHeight);
    };

    useEffect(() => {
        if (loadedCount < FRAME_COUNT) {
            return;
        }

        drawFrame(0);

        const handleResize = () => drawFrame(Math.round(renderedFrameRef.current));
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [loadedCount]);

    useEffect(() => {
        let ticking = false;

        const updateProgress = () => {
            const container = stickySectionRef.current;

            if (!container) {
                ticking = false;
                return;
            }

            const rect = container.getBoundingClientRect();
            const maxTravel = Math.max(rect.height - window.innerHeight, 1);
            const normalized = Math.min(Math.max(-rect.top / maxTravel, 0), 1);

            setProgress(normalized);
            targetFrameRef.current = normalized * (FRAME_COUNT - 1);

            if (animationRef.current === null) {
                const loop = () => {
                    const delta = targetFrameRef.current - renderedFrameRef.current;
                    renderedFrameRef.current += delta * 0.22;
                    const nextFrame = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(renderedFrameRef.current)));
                    drawFrame(nextFrame);

                    if (Math.abs(delta) > 0.015) {
                        animationRef.current = window.requestAnimationFrame(loop);
                    } else {
                        renderedFrameRef.current = targetFrameRef.current;
                        drawFrame(Math.round(renderedFrameRef.current));
                        animationRef.current = null;
                    }
                };

                animationRef.current = window.requestAnimationFrame(loop);
            }

            ticking = false;
        };

        const handleScroll = () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(updateProgress);
            }
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
        };
    }, []);

    useEffect(() => {
        return () => {
            if (animationRef.current !== null) {
                window.cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    return (
        <section className="relative left-1/2 w-screen -translate-x-1/2 bg-[#050505] text-white">
            <div ref={stickySectionRef} className="relative h-[400vh]">
                <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden bg-[#050505]">
                    <canvas ref={canvasRef} className="h-screen w-full" aria-label="Animated Nike shoe technical sequence" />

                    {loadedCount < FRAME_COUNT ? (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050505]">
                            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
                        </div>
                    ) : null}

                    <div className="pointer-events-none absolute inset-0 z-20">
                        {overlays.map((overlay, index) => {
                            const fadeStart = overlay.at - 0.1;
                            const fadeInEnd = overlay.at;
                            const fadeOutStart = overlay.at + 0.12;
                            const fadeOutEnd = overlay.at + 0.24;

                            let opacity = 0;

                            if (progress >= fadeStart && progress <= fadeInEnd) {
                                opacity = (progress - fadeStart) / (fadeInEnd - fadeStart);
                            } else if (progress > fadeInEnd && progress <= fadeOutStart) {
                                opacity = 1;
                            } else if (progress > fadeOutStart && progress <= fadeOutEnd) {
                                opacity = 1 - (progress - fadeOutStart) / (fadeOutEnd - fadeOutStart);
                            }

                            const alignmentClass =
                                overlay.align === 'left'
                                    ? 'items-center justify-start text-left'
                                    : overlay.align === 'right'
                                      ? 'items-center justify-end text-right'
                                      : 'items-center justify-center text-center';

                            return (
                                <div
                                    key={`${overlay.label}-${index}`}
                                    className={`absolute inset-0 flex px-6 md:px-16 ${alignmentClass}`}
                                    style={{ opacity: Math.max(0, Math.min(1, opacity)) }}
                                >
                                    <div>
                                        <p className="font-['Inter',-'SF_Pro_Display',system-ui,sans-serif] text-3xl leading-tight font-semibold tracking-tight text-white/90 md:text-5xl">
                                            {overlay.label}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <div className="mx-auto -mt-24 max-w-3xl px-6 pb-20 text-center text-sm leading-relaxed text-white/60 md:text-base">
                <p>
                    Scroll through an anti-gravity technical deconstruction of the Nike Apex platform and discover each performance layer in
                    motion.
                </p>
            </div>
        </section>
    );
}
