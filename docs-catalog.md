# Adding Categories and Products

This store currently has no admin panel for catalog management. You can add categories and products in two practical ways:

## 1) Seed them in `DatabaseSeeder`

Edit `database/seeders/DatabaseSeeder.php` and update the `$catalog` array.

Then run:

```bash
php artisan migrate:fresh --seed
```

Use this for local/dev bootstrap data.

## 2) Insert records from Laravel Tinker

Open tinker:

```bash
php artisan tinker
```

Create a category:

```php
use App\Models\Category;
use App\Models\Product;

$category = Category::create([
    'name' => 'Books',
    'slug' => 'books',
    'description' => 'Printed and digital books',
]);
```

Create products in that category:

```php
Product::create([
    'category_id' => $category->id,
    'name' => 'Clean Architecture',
    'slug' => 'clean-architecture',
    'description' => 'A practical software architecture guide.',
    'price' => 39.99,
    'stock' => 20,
    'image_url' => 'https://picsum.photos/seed/clean-architecture/640/420',
    'is_featured' => true,
]);
```

## Required fields and constraints

- Category: `name`, `slug` (unique), optional `description`
- Product: `category_id`, `name`, `slug` (unique), `description`, `price`, optional `stock`, optional `image_url`, optional `is_featured`

If you add many products, keep slugs unique across all products.
