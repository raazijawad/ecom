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
        const entries = (product.color_image_urls ?? [])
            .filter((entry) => Boolean(entry.color) && Boolean(entry.product_image))
            .map((entry) => [entry.color.toLowerCase().trim(), entry.product_image as string]);

        return Object.fromEntries(entries);
    }, [product.color_image_urls]);

    const productImageUrl = selectedColor ? colorImageUrls[selectedColor.toLowerCase().trim()] ?? product.image_url ?? '' : product.image_url ?? '';

    const selectedColorGallery = useMemo(() => {
        if (!selectedColor) {
            return [] as string[];
        }

        const selectedEntry = (product.color_image_urls ?? []).find(
            (entry) => entry.color?.toLowerCase().trim() === selectedColor.toLowerCase().trim(),
        );

        if (!selectedEntry) {
            return [] as string[];
        }

        const gallery = Array.isArray(selectedEntry.image_gallery) ? selectedEntry.image_gallery : [];

        return gallery.filter((url): url is string => Boolean(url));
    }, [product.color_image_urls, selectedColor]);

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
                    <img src={productImageUrl} alt={selectedColor ? `${product.name} in ${selectedColor}` : product.name} className="w-full rounded-xl object-cover" />

                    {selectedColorGallery.length > 0 && (
                        <div className="mt-4">
                            <p className="mb-2 text-sm font-semibold text-slate-700">Image gallery</p>
                            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                                {selectedColorGallery.map((imageUrl) => (
                                    <img
                                        key={imageUrl}
                                        src={imageUrl}
                                        alt={`${product.name} gallery image`}
                                        className="h-24 w-full rounded-lg border border-slate-200 object-cover"
                                    />
                                ))}
                            </div>
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
