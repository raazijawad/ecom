import { useEffect, useMemo, useRef, useState } from 'react';

const FRAME_COUNT = 120;
const FALLBACK_FRAME = '/shoe-banner/ezgif-frame-001.jpg';

const framePath = (index: number) => `/shoe-banner/ezgif-frame-${String(index + 1).padStart(3, '0')}.jpg`;

export default function ShoeScroll() {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const framesRef = useRef<HTMLImageElement[]>([]);
    const rafRef = useRef<number | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [progress, setProgress] = useState(0);

    const messages = useMemo(
        () => [
            { text: 'Nike Apex. Redefined Motion.', at: 0, align: 'center' as const },
            { text: 'Layered Precision.', at: 0.3, align: 'left' as const },
            { text: 'Advanced Cushion Engineering.', at: 0.6, align: 'right' as const },
            { text: 'Move Beyond.', at: 0.9, align: 'center' as const },
        ],
        [],
    );

    const drawFrame = (index: number) => {
        const canvas = canvasRef.current;
        const frame = framesRef.current[index];

        if (!canvas || !frame || !frame.complete) {
            return;
        }

        const context = canvas.getContext('2d');
        if (!context) {
            return;
        }

        const { width, height } = canvas;
        const imageRatio = frame.width / frame.height;
        const canvasRatio = width / height;

        let drawWidth = width;
        let drawHeight = height;

        if (imageRatio > canvasRatio) {
            drawWidth = width;
            drawHeight = width / imageRatio;
        } else {
            drawHeight = height;
            drawWidth = height * imageRatio;
        }

        const x = (width - drawWidth) / 2;
        const y = (height - drawHeight) / 2;

        context.clearRect(0, 0, width, height);
        context.drawImage(frame, x, y, drawWidth, drawHeight);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            canvas.width = Math.floor(window.innerWidth * dpr);
            canvas.height = Math.floor(window.innerHeight * dpr);
            const context = canvas.getContext('2d');
            context?.setTransform(dpr, 0, 0, dpr, 0, 0);
            drawFrame(Math.round(progress * (FRAME_COUNT - 1)));
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        return () => window.removeEventListener('resize', updateCanvasSize);
    }, [progress]);

    useEffect(() => {
        let loadedFrames = 0;

        const handleLoaded = () => {
            loadedFrames += 1;
            if (loadedFrames === FRAME_COUNT) {
                setIsLoaded(true);
                drawFrame(0);
            }
        };

        framesRef.current = Array.from({ length: FRAME_COUNT }, (_, index) => {
            const image = new Image();
            image.onload = handleLoaded;
            image.onerror = () => {
                image.onerror = null;
                image.src = FALLBACK_FRAME;
            };
            image.src = framePath(index);
            return image;
        });
    }, []);

    useEffect(() => {
        const updateProgress = () => {
            const container = containerRef.current;
            if (!container) {
                return;
            }

            const bounds = container.getBoundingClientRect();
            const maxScroll = bounds.height - window.innerHeight;
            const nextProgress = maxScroll <= 0 ? 0 : Math.min(1, Math.max(0, -bounds.top / maxScroll));

            setProgress(nextProgress);

            if (isLoaded) {
                const nextFrame = Math.round(nextProgress * (FRAME_COUNT - 1));
                drawFrame(nextFrame);
            }
        };

        const onScroll = () => {
            if (rafRef.current !== null) {
                return;
            }

            rafRef.current = window.requestAnimationFrame(() => {
                rafRef.current = null;
                updateProgress();
            });
        };

        updateProgress();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current);
            }
        };
    }, [isLoaded]);

    const activeMessage = messages.reduce((current, message) => (progress >= message.at ? message : current), messages[0]);

    return (
        <section ref={containerRef} className="relative mb-10 h-[400vh] bg-[#050505] text-white [font-family:Inter,'San_Francisco',system-ui,sans-serif]">
            <div className="sticky top-0 flex h-screen w-full items-center justify-center">
                {!isLoaded && (
                    <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#050505]">
                        <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white/90" />
                    </div>
                )}

                <canvas ref={canvasRef} className="h-screen w-full" />

                <div className="pointer-events-none absolute inset-0 z-20 mx-auto flex h-full w-full max-w-6xl px-6">
                    <p
                        className={`my-auto max-w-xl text-3xl leading-tight font-semibold tracking-tight text-white/90 md:text-5xl ${
                            activeMessage.align === 'left'
                                ? 'mr-auto text-left'
                                : activeMessage.align === 'right'
                                  ? 'ml-auto text-right'
                                  : 'mx-auto text-center'
                        }`}
                    >
                        {activeMessage.text}
                    </p>
                </div>
            </div>
        </section>
    );
}
