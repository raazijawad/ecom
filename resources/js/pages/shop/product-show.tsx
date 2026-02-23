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
    const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
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

    const productImageThumbnails = useMemo(() => {
        const allImages = [productImageUrl, ...selectedColorGallery].filter((url): url is string => Boolean(url));

        return [...new Set(allImages)];
    }, [productImageUrl, selectedColorGallery]);

    useEffect(() => {
        setSelectedGalleryImage(null);
    }, [selectedColor]);

    const displayedImageUrl = selectedGalleryImage ?? productImageUrl;

    useEffect(() => {
        if (!showCartMessage) {
            return;
        }

        const timeout = window.setTimeout(() => {
            setShowCartMessage(false);
        }, 3000);

        return () => window.clearTimeout(timeout);
    }, [showCartMessage]);

    const resolveCardImage = (item: Product) => item.image_url ?? '';

    const viewProductDetails = (productId: number) => {
        router.visit(`/products/${productId}`);
    };

    return (
        <ShopLayout title={product.name} cartSummary={cartSummary}>
            <div className="grid gap-8 md:grid-cols-2">
                <div>
                    <img src={displayedImageUrl} alt={selectedColor ? `${product.name} in ${selectedColor}` : product.name} className="w-full rounded-xl object-cover" />

                    {productImageThumbnails.length > 1 && (
                        <div className="mt-4">

                            <div className="flex flex-wrap gap-2">
                                {productImageThumbnails.map((imageUrl) => {
                                    const isActive = imageUrl === displayedImageUrl;

                                    return (
                                        <button
                                            key={imageUrl}
                                            type="button"
                                            onClick={() => setSelectedGalleryImage(imageUrl)}
                                            className={`h-16 w-16 overflow-hidden rounded-md border transition ${
                                                isActive
                                                    ? 'border-blue-600 ring-2 ring-blue-200'
                                                    : 'border-slate-200 hover:border-slate-400'
                                            }`}
                                        >
                                            <img src={imageUrl} alt={`${product.name} gallery image`} className="h-full w-full object-cover" />
                                        </button>
                                    );
                                })}
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
                        <article key={item.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                            <AppLink href={`/products/${item.id}`} className="block">
                                <div className="flex h-44 items-center justify-center rounded-xl bg-slate-50 p-3">
                                    <img src={resolveCardImage(item)} alt={item.name} className="h-full w-full object-contain" />
                                </div>
                            </AppLink>
                            <h4 className="mt-4 text-base font-bold text-black">{item.name}</h4>
                            <p className="mt-1 text-sm text-slate-400">{item.category?.name ?? 'Shoes'}</p>
                            <div className="mt-3 flex items-center justify-between">
                                <span className="text-lg font-bold text-black">${Number(item.price).toFixed(2)}</span>
                                <button
                                    type="button"
                                    onClick={() => viewProductDetails(item.id)}
                                    className="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                                >
                                    Buy now
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <footer className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-6 md:grid-cols-4">
                    <div>
                        <h3 className="font-semibold text-slate-900">Quick Links</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>
                                <AppLink href="/shoes" className="hover:text-slate-900 hover:underline">
                                    All Shoes
                                </AppLink>
                            </li>
                            <li>Featured Kicks</li>
                            <li>Best Sellers</li>
                            <li>New Arrivals</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Contact Info</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>support@solestyle.com</li>
                            <li>+1 (800) 555-0199</li>
                            <li>Mon–Fri, 9AM–6PM</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Community</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>Instagram</li>
                            <li>Run Club</li>
                            <li>Sneaker News</li>
                            <li>YouTube</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900">Policies & FAQ</h3>
                        <ul className="mt-2 space-y-1 text-sm text-slate-600">
                            <li>Shipping Policy</li>
                            <li>Returns & Exchanges</li>
                            <li>Size Guide</li>
                            <li>FAQ</li>
                        </ul>
                    </div>
                </div>
            </footer>
        </ShopLayout>
    );
}
