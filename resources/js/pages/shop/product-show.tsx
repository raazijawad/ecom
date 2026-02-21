import { router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import AddToCartToast from '@/components/add-to-cart-toast';
import AppLink from '@/components/app-link';
import ShopLayout from '@/components/shop-layout';
import type { CartSummary, Product } from '@/types/shop';

type Props = {
    product: Product;
    discount: {
        off_percentage: number;
        discount_price: number;
    } | null;
    relatedProducts: Product[];
    cartSummary: CartSummary;
};

export default function ProductShow({ product, discount, relatedProducts, cartSummary }: Props) {
    const sizeOptions = product.sizes ?? [];
    const colorOptions = product.colors ?? [];

    const [selectedSize, setSelectedSize] = useState<string | null>(sizeOptions[0] ?? null);
    const [selectedColor, setSelectedColor] = useState<string | null>(colorOptions[0] ?? null);
    const [showCartMessage, setShowCartMessage] = useState(false);

    const colorImageUrls = useMemo(() => {
        const entries = Object.entries(product.color_image_urls ?? {}).filter(([, imageUrl]) => Boolean(imageUrl));

        return Object.fromEntries(entries.map(([color, imageUrl]) => [color.toLowerCase().trim(), imageUrl]));
    }, [product.color_image_urls]);

    const baseProductImageUrl = selectedColor ? colorImageUrls[selectedColor.toLowerCase().trim()] ?? product.image_url ?? '' : product.image_url ?? '';

    const galleryImages = useMemo(() => {
        const normalizedColor = selectedColor?.toLowerCase().trim() ?? null;
        const colorSpecificGallery = normalizedColor ? product.color_gallery_image_urls?.[normalizedColor] ?? [] : [];
        const fallbackGallery = product.gallery_image_urls ?? [];

        const uniqueUrls = new Set<string>([baseProductImageUrl, ...(colorSpecificGallery.length > 0 ? colorSpecificGallery : fallbackGallery)].filter(Boolean));

        return Array.from(uniqueUrls);
    }, [baseProductImageUrl, product.color_gallery_image_urls, product.gallery_image_urls, selectedColor]);

    const [selectedImageUrl, setSelectedImageUrl] = useState(baseProductImageUrl);

    useEffect(() => {
        if (galleryImages.length === 0) {
            setSelectedImageUrl('');

            return;
        }

        setSelectedImageUrl((currentImageUrl) => (currentImageUrl && galleryImages.includes(currentImageUrl) ? currentImageUrl : galleryImages[0]));
    }, [galleryImages]);

    useEffect(() => {
        if (!showCartMessage) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setShowCartMessage(false);
        }, 3000);

        return () => window.clearTimeout(timeout);
    }, [showCartMessage]);

    return (
        <ShopLayout title={product.name} cartSummary={cartSummary}>
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <img
                        src={selectedImageUrl}
                        alt={selectedColor ? `${product.name} in ${selectedColor}` : product.name}
                        className="h-[420px] w-[700px] max-w-full rounded-xl object-cover"
                    />
                    {galleryImages.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                            {galleryImages.map((imageUrl, index) => (
                                <button
                                    key={`${imageUrl}-${index}`}
                                    type="button"
                                    onClick={() => setSelectedImageUrl(imageUrl)}
                                    className={`h-16 w-16 overflow-hidden rounded-md border-2 transition ${
                                        selectedImageUrl === imageUrl ? 'border-blue-600' : 'border-slate-200 hover:border-slate-400'
                                    }`}
                                >
                                    <img src={imageUrl} alt={`${product.name} gallery ${index + 1}`} className="h-full w-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <p className="text-sm text-slate-500">{product.category?.name}</p>
                    <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
                    <p className="mt-4 text-slate-700">{product.description}</p>
                    <div className="mt-5 flex flex-wrap items-end gap-3">
                        {discount ? (
                            <>
                                <p className="text-2xl font-bold text-slate-950">${Number(discount.discount_price).toFixed(2)}</p>
                                <p className="text-base font-semibold text-slate-400 line-through">${Number(product.price).toFixed(2)}</p>
                                <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold tracking-wide text-red-600 uppercase">
                                    {discount.off_percentage}% OFF
                                </span>
                            </>
                        ) : (
                            <p className="text-2xl font-bold">${Number(product.price).toFixed(2)}</p>
                        )}
                    </div>

                    {sizeOptions.length > 0 && (
                        <div className="mt-6">
                            <p className="mb-2 text-sm font-semibold text-slate-700">Select size</p>
                            <div className="flex flex-wrap gap-2">
                                {sizeOptions.map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => setSelectedSize(size)}
                                        className={`rounded border px-4 py-2 text-sm font-medium transition ${
                                            selectedSize === size
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-slate-300 text-slate-700 hover:border-slate-400'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {colorOptions.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-semibold text-slate-700">Select color</p>
                            <div className="flex flex-wrap gap-2">
                                {colorOptions.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setSelectedColor(color)}
                                        className={`rounded border px-4 py-2 text-sm font-medium transition ${
                                            selectedColor === color
                                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                : 'border-slate-300 text-slate-700 hover:border-slate-400'
                                        }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() =>
                            router.post(
                                '/cart',
                                {
                                    product_id: product.id,
                                    quantity: 1,
                                    size: selectedSize,
                                    color: selectedColor,
                                },
                                {
                                    onSuccess: () => {
                                        setShowCartMessage(true);
                                    },
                                },
                            )
                        }
                        className="mt-6 cursor-pointer rounded bg-blue-600 px-4 py-3 font-semibold text-white"
                    >
                        Add to shoe bag
                    </button>
                </div>
            </div>

            <AddToCartToast productName={product.name} isVisible={showCartMessage} />

            <section className="mt-10">
                <h2 className="mb-4 text-xl font-semibold">More shoes you may like</h2>
                <div className="grid gap-4 md:grid-cols-4">
                    {relatedProducts.map((item) => (
                        <AppLink key={item.id} href={`/products/${item.id}`} className="rounded border border-slate-200 bg-white p-3 shadow-sm">
                            <img src={item.image_url ?? ''} alt={item.name} className="mb-2 h-28 w-full rounded object-cover" />
                            <p className="font-medium">{item.name}</p>
                        </AppLink>
                    ))}
                </div>
            </section>
        </ShopLayout>
    );
}
