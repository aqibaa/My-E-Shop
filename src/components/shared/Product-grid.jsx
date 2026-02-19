import ProductCard from "./Product-card"
const products = [
  {
    id: "wireless-headphones",
    title: "Premium Wireless Headphones",
    price: 249.99,
    originalPrice: 349.99,
    image: "/wireless-headphones.jpg",
    rating: 4.5,
    reviewCount: 128,
    badge: "Best Seller",
  },
  {
    id: "leather-bag",
    title: "Italian Leather Crossbody Bag",
    price: 189.00,
    image: "/leather-bag.jpg",
    rating: 4.8,
    reviewCount: 64,
    badge: "New",
  },
  {
    id: "smart-watch",
    title: "Smart Watch Series X",
    price: 399.00,
    originalPrice: 449.00,
    image: "/smart-watch.jpg",
    rating: 4.6,
    reviewCount: 256,
  },
  {
    id: "running-shoes",
    title: "Ultralight Running Shoes",
    price: 129.99,
    image: "/running-shoes.jpg",
    rating: 4.3,
    reviewCount: 89,
    badge: "New",
  },
  {
    id: "sunglasses",
    title: "Classic Aviator Sunglasses",
    price: 159.00,
    originalPrice: 199.00,
    image: "/sunglasses.jpg",
    rating: 4.7,
    reviewCount: 142,
  },
  {
    id: "cotton-tshirt",
    title: "Premium Cotton Essential Tee",
    price: 49.99,
    image: "/cotton-tshirt.jpg",
    rating: 4.4,
    reviewCount: 312,
  },
  {
    id: "ceramic-mug",
    title: "Handcrafted Ceramic Mug",
    price: 34.99,
    image: "/ceramic-mug.jpg",
    rating: 4.9,
    reviewCount: 47,
  },
  {
    id: "backpack",
    title: "Minimalist Laptop Backpack",
    price: 119.00,
    originalPrice: 159.00,
    image: "/backpack.jpg",
    rating: 4.5,
    reviewCount: 93,
    badge: "Sale",
  },
]

export function ProductsGrid({ title, subtitle }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-6 lg:py-20">
      <div className="mb-10 flex flex-col items-center gap-2 text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </section>
  )
}
