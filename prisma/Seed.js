const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// 20 High Quality Products with Linked Colors & Images
const productsToInsert = [
  // --- ELECTRONICS ---
  {
    name: "MacBook Pro 16-inch M3 Max",
    description: "The ultimate pro laptop. Mind-blowing performance for demanding workflows.",
    price: 3499.00,
    originalPrice: 3699.00,
    category: "Electronics",
    brand: "Apple",
    stock: 25,
    rating: 4.9,
    reviewCount: 342,
    badge: "Top Seller",
    image: "/macbook-spaceblack-1.jpg", 
    images: [],
    colors: [
      {
        name: "Space Black",
        colorCode: "#2e2e2e",
        images: ["/macbook-spaceblack-1.jpg", "/macbook-spaceblack-2.jpg"]
      },
      {
        name: "Silver",
        colorCode: "#e3e4e5",
        images: ["/macbook-silver-1.jpg", "/macbook-silver-2.jpg"]
      }
    ],
    sizes: ["1TB SSD", "2TB SSD", "4TB SSD"],
    features: ["Apple M3 Max chip", "Up to 128GB unified memory", "Liquid Retina XDR display"],
    isFeatured: true
  },
  {
    name: "Sony WH-1000XM5 Wireless Noise Canceling",
    description: "Industry leading noise cancellation with Auto NC Optimizer.",
    price: 398.00,
    originalPrice: null,
    category: "Electronics",
    brand: "Sony",
    stock: 50,
    rating: 4.7,
    reviewCount: 1250,
    badge: "",
    image: "/sony-xm5-black-1.jpg",
    images: ["/sony-xm5-box.jpg"], // Unboxing image
    colors: [
      {
        name: "Black",
        colorCode: "#000000",
        images: ["/sony-xm5-black-1.jpg", "/sony-xm5-black-2.jpg", "/sony-xm5-black-3.jpg"]
      },
      {
        name: "Platinum Silver",
        colorCode: "#d9d9d9",
        images: ["/sony-xm5-silver-1.jpg", "/sony-xm5-silver-2.jpg"]
      },
      {
        name: "Midnight Blue",
        colorCode: "#191970",
        images: ["/sony-xm5-blue-1.jpg", "/sony-xm5-blue-2.jpg"]
      }
    ],
    sizes: [],
    features: ["Multi Noise Sensor Tech", "Up to 30-hour battery life", "Multipoint connection"],
    isFeatured: true
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "Welcome to the era of mobile AI. The most advanced Galaxy smartphone yet.",
    price: 1299.99,
    originalPrice: 1499.99,
    category: "Electronics",
    brand: "Samsung",
    stock: 120,
    rating: 4.8,
    reviewCount: 890,
    badge: "New Arrival",
    image: "/s24-titanium-black-1.jpg",
    images: [],
    colors: [
      {
        name: "Titanium Black",
        colorCode: "#222222",
        images: ["/s24-titanium-black-1.jpg", "/s24-titanium-black-2.jpg"]
      },
      {
        name: "Titanium Yellow",
        colorCode: "#e6d595",
        images: ["/s24-titanium-yellow-1.jpg", "/s24-titanium-yellow-2.jpg"]
      }
    ],
    sizes: ["256GB", "512GB", "1TB"],
    features: ["Titanium exterior", "200MP Wide-angle Camera", "Galaxy AI built-in"],
    isFeatured: true
  },
  {
    name: "Apple Watch Series 9",
    description: "Smarter. Brighter. Mightier. The most powerful chip in Apple Watch ever.",
    price: 399.00,
    originalPrice: 429.00,
    category: "Electronics",
    brand: "Apple",
    stock: 45,
    rating: 4.7,
    reviewCount: 512,
    badge: "Sale",
    image: "/apple-watch-midnight-1.jpg",
    images: [],
    colors: [
      {
        name: "Midnight",
        colorCode: "#1a1c29",
        images: ["/apple-watch-midnight-1.jpg", "/apple-watch-midnight-2.jpg"]
      },
      {
        name: "Starlight",
        colorCode: "#f0e6d2",
        images: ["/apple-watch-starlight-1.jpg", "/apple-watch-starlight-2.jpg"]
      },
      {
        name: "Product RED",
        colorCode: "#d92323",
        images: ["/apple-watch-red-1.jpg", "/apple-watch-red-2.jpg"]
      }
    ],
    sizes: ["41mm", "45mm"],
    features: ["Double tap gesture", "Blood oxygen app", "Crack resistant"],
    isFeatured: false
  },
  {
    name: "Logitech MX Master 3S Mouse",
    description: "The master series mouse designed for creatives and engineered for coders.",
    price: 99.99,
    originalPrice: null,
    category: "Electronics",
    brand: "Logitech",
    stock: 200,
    rating: 4.8,
    reviewCount: 3200,
    badge: "",
    image: "/mx-master-graphite-1.jpg",
    images: [],
    colors: [
      {
        name: "Graphite",
        colorCode: "#2a2a2a",
        images: ["/mx-master-graphite-1.jpg", "/mx-master-graphite-2.jpg"]
      },
      {
        name: "Pale Grey",
        colorCode: "#dcdcdc",
        images: ["/mx-master-grey-1.jpg", "/mx-master-grey-2.jpg"]
      }
    ],
    sizes: [],
    features: ["MagSpeed scrolling", "8K DPI track-on-glass", "Quiet Clicks"],
    isFeatured: false
  },

  // --- FASHION ---
  {
    name: "Classic Leather Biker Jacket",
    description: "Premium full-grain leather jacket with asymmetrical zip closure.",
    price: 299.00,
    originalPrice: 350.00,
    category: "Fashion",
    brand: "AllSaints",
    stock: 15,
    rating: 4.6,
    reviewCount: 88,
    badge: "Premium",
    image: "/leather-jacket-black-1.jpg",
    images: [],
    colors: [
      {
        name: "Black",
        colorCode: "#000000",
        images: ["/leather-jacket-black-1.jpg", "/leather-jacket-black-2.jpg"]
      },
      {
        name: "Brown",
        colorCode: "#8b4513",
        images: ["/leather-jacket-brown-1.jpg", "/leather-jacket-brown-2.jpg"]
      }
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    features: ["100% Lamb Leather", "Fully lined", "Zip cuffs"],
    isFeatured: true
  },
  {
    name: "Essential Heavyweight T-Shirt",
    description: "The perfect everyday tee. Cut from heavyweight 100% organic cotton.",
    price: 35.00,
    originalPrice: null,
    category: "Fashion",
    brand: "Everlane",
    stock: 500,
    rating: 4.8,
    reviewCount: 2100,
    badge: "Best Value",
    image: "/tshirt-white-1.jpg",
    images: [],
    colors: [
      {
        name: "White",
        colorCode: "#ffffff",
        images: ["/tshirt-white-1.jpg", "/tshirt-white-2.jpg"]
      },
      {
        name: "Black",
        colorCode: "#000000",
        images: ["/tshirt-black-1.jpg", "/tshirt-black-2.jpg"]
      },
      {
        name: "Navy",
        colorCode: "#000080",
        images: ["/tshirt-navy-1.jpg", "/tshirt-navy-2.jpg"]
      },
      {
        name: "Olive",
        colorCode: "#556b2f",
        images: ["/tshirt-olive-1.jpg", "/tshirt-olive-2.jpg"]
      }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    features: ["220 gsm organic cotton", "Relaxed fit", "Pre-shrunk"],
    isFeatured: false
  },
  {
    name: "Slim Fit Chino Pants",
    description: "Versatile chinos that look sharp at the office and relaxed on the weekend.",
    price: 68.00,
    originalPrice: null,
    category: "Fashion",
    brand: "Uniqlo",
    stock: 120,
    rating: 4.5,
    reviewCount: 430,
    badge: "",
    image: "/chino-khaki-1.jpg",
    images: [],
    colors: [
      {
        name: "Khaki",
        colorCode: "#c3b091",
        images: ["/chino-khaki-1.jpg", "/chino-khaki-2.jpg"]
      },
      {
        name: "Navy",
        colorCode: "#000080",
        images: ["/chino-navy-1.jpg", "/chino-navy-2.jpg"]
      }
    ],
    sizes: ["30x30", "32x30", "32x32", "34x32", "36x32"],
    features: ["Stretch cotton blend", "Wrinkle resistant", "Hidden zip pocket"],
    isFeatured: false
  },
  {
    name: "Water-Repellent Puffer Coat",
    description: "Stay warm and dry with this insulated puffer coat featuring a durable water-repellent finish.",
    price: 129.99,
    originalPrice: 169.99,
    category: "Fashion",
    brand: "North Face",
    stock: 40,
    rating: 4.7,
    reviewCount: 156,
    badge: "Winter Ready",
    image: "/puffer-black-1.jpg",
    images: [],
    colors: [
      {
        name: "Black",
        colorCode: "#000000",
        images: ["/puffer-black-1.jpg", "/puffer-black-2.jpg"]
      },
      {
        name: "Forest Green",
        colorCode: "#228b22",
        images: ["/puffer-green-1.jpg", "/puffer-green-2.jpg"]
      }
    ],
    sizes: ["S", "M", "L", "XL"],
    features: ["Recycled insulation", "DWR finish", "Removable hood"],
    isFeatured: false
  },
  {
    name: "Silk Blend Midi Slip Dress",
    description: "Elegant midi dress crafted from a luxurious silk blend with a flattering bias cut.",
    price: 148.00,
    originalPrice: null,
    category: "Fashion",
    brand: "Reformation",
    stock: 65,
    rating: 4.8,
    reviewCount: 92,
    badge: "",
    image: "/dress-champagne-1.jpg",
    images: [],
    colors: [
      {
        name: "Champagne",
        colorCode: "#f7e7ce",
        images: ["/dress-champagne-1.jpg", "/dress-champagne-2.jpg"]
      },
      {
        name: "Emerald",
        colorCode: "#50c878",
        images: ["/dress-emerald-1.jpg", "/dress-emerald-2.jpg"]
      }
    ],
    sizes: ["0", "2", "4", "6", "8", "10", "12"],
    features: ["Adjustable straps", "Side slit", "Unlined"],
    isFeatured: false
  },
  {
    name: "Nike Air Force 1 '07",
    description: "The radiance lives on in the Nike Air Force 1 '07, the b-ball icon that puts a fresh spin on what you know best.",
    price: 110.00,
    originalPrice: null,
    category: "Footwear",
    brand: "Nike",
    stock: 300,
    rating: 4.9,
    reviewCount: 12500,
    badge: "Icon",
    image: "/af1-white-1.jpg",
    images: [],
    colors: [
      {
        name: "White",
        colorCode: "#ffffff",
        images: ["/af1-white-1.jpg", "/af1-white-2.jpg", "/af1-white-3.jpg"]
      },
      {
        name: "Black",
        colorCode: "#000000",
        images: ["/af1-black-1.jpg", "/af1-black-2.jpg", "/af1-black-3.jpg"]
      }
    ],
    sizes: ["7", "8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    features: ["Nike Air cushioning", "Padded collar", "Perforations on toe"],
    isFeatured: true
  },
  {
    name: "Adidas Ultraboost Light",
    description: "Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever.",
    price: 190.00,
    originalPrice: null,
    category: "Footwear",
    brand: "Adidas",
    stock: 150,
    rating: 4.6,
    reviewCount: 840,
    badge: "New",
    image: "/ultraboost-white-1.jpg",
    images: [],
    colors: [
      {
        name: "Cloud White",
        colorCode: "#f8f9fa",
        images: ["/ultraboost-white-1.jpg", "/ultraboost-white-2.jpg", "/ultraboost-white-3.jpg"]
      },
      {
        name: "Core Black",
        colorCode: "#111111",
        images: ["/ultraboost-black-1.jpg", "/ultraboost-black-2.jpg", "/ultraboost-black-3.jpg"]
      },
      {
        name: "Solar Red",
        colorCode: "#ff2a2a",
        images: ["/ultraboost-red-1.jpg", "/ultraboost-red-2.jpg"]
      }
    ],
    sizes: ["8", "8.5", "9", "9.5", "10", "10.5", "11", "12"],
    features: ["Light BOOST midsole", "Continental Rubber outsole", "PRIMEKNIT+ forged upper"],
    isFeatured: true
  },
  {
    name: "New Balance 574 Core",
    description: "The 574 was built to be a reliable shoe that could do a lot of different things well rather than as a platform for revolutionary technology.",
    price: 89.99,
    originalPrice: null,
    category: "Footwear",
    brand: "New Balance",
    stock: 210,
    rating: 4.7,
    reviewCount: 3150,
    badge: "",
    image: "/nb574-grey-1.jpg",
    images: [],
    colors: [
      {
        name: "Grey with White",
        colorCode: "#808080",
        images: ["/nb574-grey-1.jpg", "/nb574-grey-2.jpg"]
      },
      {
        name: "Navy with Silver",
        colorCode: "#000080",
        images: ["/nb574-navy-1.jpg", "/nb574-navy-2.jpg"]
      },
      {
        name: "Burgundy",
        colorCode: "#800020",
        images: ["/nb574-burgundy-1.jpg", "/nb574-burgundy-2.jpg"]
      }
    ],
    sizes: ["7", "8", "9", "10", "11", "12", "13"],
    features: ["ENCAP midsole cushioning", "Suede/mesh upper", "Durable rubber outsole"],
    isFeatured: false
  },
  {
    name: "Dr. Martens 1460 Smooth Leather Lace Up Boots",
    description: "The original Dr. Martens 8-eye boot. Built to last with durable Smooth leather.",
    price: 170.00,
    originalPrice: null,
    category: "Footwear",
    brand: "Dr. Martens",
    stock: 85,
    rating: 4.8,
    reviewCount: 5200,
    badge: "Classic",
    image: "/doc-black-1.jpg",
    images: [],
    colors: [
      {
        name: "Black",
        colorCode: "#000000",
        images: ["/doc-black-1.jpg", "/doc-black-2.jpg", "/doc-black-3.jpg"]
      },
      {
        name: "Cherry Red",
        colorCode: "#7b1113",
        images: ["/doc-cherry-1.jpg", "/doc-cherry-2.jpg"]
      },
      {
        name: "White",
        colorCode: "#ffffff",
        images: ["/doc-white-1.jpg", "/doc-white-2.jpg"]
      }
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    features: ["Goodyear-welted lines", "AirWair sole", "8-eye lace fastening"],
    isFeatured: false
  },
  {
    name: "Converse Chuck Taylor All Star Classic",
    description: "The unmistakable silhouette that started it all. Canvas upper, diamond pattern outsole, and iconic ankle patch.",
    price: 65.00,
    originalPrice: null,
    category: "Footwear",
    brand: "Converse",
    stock: 450,
    rating: 4.6,
    reviewCount: 18400,
    badge: "",
    image: "/chuck-optical-white-1.jpg",
    images: [],
    colors: [
      {
        name: "Optical White",
        colorCode: "#f8f9fa",
        images: ["/chuck-optical-white-1.jpg", "/chuck-optical-white-2.jpg"]
      },
      {
        name: "Black",
        colorCode: "#000000",
        images: ["/chuck-black-1.jpg", "/chuck-black-2.jpg"]
      },
      {
        name: "Navy",
        colorCode: "#000080",
        images: ["/chuck-navy-1.jpg", "/chuck-navy-2.jpg"]
      },
      {
        name: "Red",
        colorCode: "#ff0000",
        images: ["/chuck-red-1.jpg", "/chuck-red-2.jpg"]
      }
    ],
    sizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"],
    features: ["Canvas upper", "OrthoLite insole", "Medial eyelets for airflow"],
    isFeatured: false
  },

  // --- ACCESSORIES ---
  {
    name: "Ray-Ban Aviator Classic",
    description: "Currently one of the most iconic sunglass models in the world, Ray-Ban Aviator Classic sunglasses were originally designed for U.S. aviators in 1937.",
    price: 163.00,
    originalPrice: null,
    category: "Accessories",
    brand: "Ray-Ban",
    stock: 120,
    rating: 4.8,
    reviewCount: 3450,
    badge: "Timeless",
    image: "/rayban-gold-green-1.jpg",
    images: [],
    colors: [
      {
        name: "Gold / Green Classic G-15",
        colorCode: "#d4af37",
        images: ["/rayban-gold-green-1.jpg", "/rayban-gold-green-2.jpg"]
      },
      {
        name: "Black / Green Classic G-15",
        colorCode: "#000000",
        images: ["/rayban-black-green-1.jpg", "/rayban-black-green-2.jpg"]
      },
      {
        name: "Silver / Grey Gradient",
        colorCode: "#c0c0c0",
        images: ["/rayban-silver-grey-1.jpg", "/rayban-silver-grey-2.jpg"]
      }
    ],
    sizes: ["Standard", "Large"],
    features: ["100% UV Protection", "Metal frame", "Adjustable nose pads"],
    isFeatured: true
  },
  {
    name: "Fossil Minimalist Leather Watch",
    description: "A clean, simple dial with a slim case makes this watch the perfect everyday accessory.",
    price: 125.00,
    originalPrice: 150.00,
    category: "Accessories",
    brand: "Fossil",
    stock: 65,
    rating: 4.5,
    reviewCount: 420,
    badge: "Sale",
    image: "/fossil-brown-1.jpg",
    images: [],
    colors: [
      {
        name: "Brown Leather / Silver Case",
        colorCode: "#8b4513",
        images: ["/fossil-brown-1.jpg", "/fossil-brown-2.jpg"]
      },
      {
        name: "Black Leather / Black Case",
        colorCode: "#000000",
        images: ["/fossil-black-1.jpg", "/fossil-black-2.jpg"]
      }
    ],
    sizes: ["One Size"],
    features: ["Genuine leather band", "Water resistant 5 ATM", "Quartz movement"],
    isFeatured: false
  },
  {
    name: "Bellroy Slim Leather Wallet",
    description: "A super slim wallet designed to carry just the essentials without adding bulk to your pocket.",
    price: 79.00,
    originalPrice: null,
    category: "Accessories",
    brand: "Bellroy",
    stock: 180,
    rating: 4.9,
    reviewCount: 1100,
    badge: "",
    image: "/bellroy-caramel-1.jpg",
    images: [],
    colors: [
      {
        name: "Caramel",
        colorCode: "#c68e17",
        images: ["/bellroy-caramel-1.jpg", "/bellroy-caramel-2.jpg", "/bellroy-caramel-3.jpg"]
      },
      {
        name: "Black",
        colorCode: "#000000",
        images: ["/bellroy-black-1.jpg", "/bellroy-black-2.jpg"]
      },
      {
        name: "Navy",
        colorCode: "#000080",
        images: ["/bellroy-navy-1.jpg", "/bellroy-navy-2.jpg"]
      }
    ],
    sizes: ["One Size"],
    features: ["Holds 4-11+ cards", "Premium eco-tanned leather", "RFID protection available"],
    isFeatured: false
  },
  {
    name: "Herschel Classic Backpack",
    description: "Featuring a timeless silhouette inspired by classic mountaineering style, the Herschel Classic™ backpack is built for everyday adventures.",
    price: 55.00,
    originalPrice: null,
    category: "Accessories",
    brand: "Herschel",
    stock: 90,
    rating: 4.6,
    reviewCount: 890,
    badge: "Popular",
    image: "/herschel-black-1.jpg",
    images: [],
    colors: [
      {
        name: "Black",
        colorCode: "#000000",
        images: ["/herschel-black-1.jpg", "/herschel-black-2.jpg"]
      },
      {
        name: "Navy",
        colorCode: "#000080",
        images: ["/herschel-navy-1.jpg", "/herschel-navy-2.jpg"]
      },
      {
        name: "Ash Rose",
        colorCode: "#d3a6a1",
        images: ["/herschel-rose-1.jpg", "/herschel-rose-2.jpg"]
      }
    ],
    sizes: ["24L"],
    features: ["Signature striped liner", "15\" laptop sleeve", "Front storage pocket with key clip"],
    isFeatured: false
  },
  {
    name: "Cashmere Sleep Mask",
    description: "Block out light and get a restful night's sleep with this incredibly soft cashmere sleep mask.",
    price: 45.00,
    originalPrice: 60.00,
    category: "Accessories",
    brand: "SleepWell",
    stock: 45,
    rating: 4.8,
    reviewCount: 230,
    badge: "Sale",
    image: "/sleepmask-grey-1.jpg",
    images: [],
    colors: [
      {
        name: "Heather Grey",
        colorCode: "#a9a9a9",
        images: ["/sleepmask-grey-1.jpg", "/sleepmask-grey-2.jpg"]
      },
      {
        name: "Charcoal",
        colorCode: "#36454f",
        images: ["/sleepmask-charcoal-1.jpg", "/sleepmask-charcoal-2.jpg"]
      }
    ],
    sizes: ["One Size"],
    features: ["100% Cashmere", "Adjustable elastic strap", "Includes travel pouch"],
    isFeatured: false
  }
];

async function main() {
  console.log('Clearing old data first (in correct order)...');

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  console.log('Generating 20 structured products...');

  let idCounter = 1;

  for (const productData of productsToInsert) {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + `-${idCounter}`;
    
    await prisma.product.create({
      data: {
        ...productData,
        slug: slug,
        // Ensure decimal conversion
        price: Number(productData.price),
        originalPrice: productData.originalPrice ? Number(productData.originalPrice) : null,
        rating: Number(productData.rating),
      }
    });
    idCounter++;
  }

  console.log(`✅ Successfully seeded 20 linked products!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });