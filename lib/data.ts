// VoltRide Mock Data - For demonstration purposes
import type { Product, Category, Review, ShippingZone } from './types'

export const categories: Category[] = [
  {
    id: 'cat-mountain',
    name: 'Mountain E-Bikes',
    slug: 'mountain-ebikes',
    description: 'Conquer any trail with powerful motors and rugged suspension',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8bd2adb8-e2f9-4cae-98eb-fed1e25550af-qgdzRMKpVPTWhsgNu7aa0r49TC2Rcu.jpg',
    sortOrder: 1,
    isActive: true,
  },
  {
    id: 'cat-city',
    name: 'City Commuters',
    slug: 'city-commuters',
    description: 'Sleek, efficient e-bikes for urban adventures',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c808f014-fe32-4edb-83bc-b2a20c105303-c4CtXdKyx94bjWlV9U8RI6hxbmuM2p.jpg',
    sortOrder: 2,
    isActive: true,
  },
  {
    id: 'cat-cargo',
    name: 'Cargo E-Bikes',
    slug: 'cargo-ebikes',
    description: 'Heavy-duty haulers for deliveries and families',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1fbdcf1e-80ee-4f68-b0c0-f634a6bdc6ab-I6Z2zOXUtqer2qhASgpFGiLKA8UJ0M.jpg',
    sortOrder: 3,
    isActive: true,
  },
  {
    id: 'cat-folding',
    name: 'Folding E-Bikes',
    slug: 'folding-ebikes',
    description: 'Compact, portable power for commuters on the go',
    imageUrl: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/79946a2f-c113-42d8-97cc-5ab620c1d621-Nfivxi3rtbMWtYf2JviOkLHRi1ESuC.jpg',
    sortOrder: 4,
    isActive: true,
  },
  {
    id: 'cat-parts',
    name: 'Parts',
    slug: 'parts-accessories',
    description: 'Parts & accessories to keep your ride running',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20233632.png',
    sortOrder: 5,
    isActive: true,
  },
  // Parts categories (used in the Parts dropdown + Parts sidebar filters)
  {
    id: 'cat-frame',
    name: 'Frame',
    slug: 'frame',
    description: 'Frames and frame parts',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20232734.png',
    parentId: 'cat-parts',
    sortOrder: 6,
    isActive: true,
  },
  {
    id: 'cat-wheel',
    name: 'Wheel',
    slug: 'wheel',
    description: 'Wheels and wheel components',
    imageUrl: '/equipamentos/original__4_-removebg.png',
    parentId: 'cat-parts',
    sortOrder: 7,
    isActive: true,
  },
  {
    id: 'cat-tires',
    name: 'Tires',
    slug: 'tires',
    description: 'Tires and inner tubes',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20235716.png',
    parentId: 'cat-parts',
    sortOrder: 8,
    isActive: true,
  },
  {
    id: 'cat-brakes',
    name: 'Brakes',
    slug: 'brakes',
    description: 'Brake pads and brake components',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20233417.png',
    parentId: 'cat-parts',
    sortOrder: 9,
    isActive: true,
  },
  {
    id: 'cat-suspention',
    name: 'Suspention',
    slug: 'suspention',
    description: 'Suspension and related parts',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20235416.png',
    parentId: 'cat-parts',
    sortOrder: 10,
    isActive: true,
  },
  {
    id: 'cat-mudguards',
    name: 'Mudguards',
    slug: 'mudguards',
    description: 'Mudguards and fenders',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20232734.png',
    parentId: 'cat-parts',
    sortOrder: 11,
    isActive: true,
  },
  {
    id: 'cat-keys',
    name: 'Keys',
    slug: 'keys',
    description: 'Locks and keys',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20234335.png',
    parentId: 'cat-parts',
    sortOrder: 12,
    isActive: true,
  },
  {
    id: 'cat-saddle',
    name: 'Saddle',
    slug: 'saddle',
    description: 'Seat and seatpost parts',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20235416.png',
    parentId: 'cat-parts',
    sortOrder: 13,
    isActive: true,
  },
  {
    id: 'cat-chain',
    name: 'Chain',
    slug: 'chain',
    description: 'Chains and chain parts',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20235716.png',
    parentId: 'cat-parts',
    sortOrder: 14,
    isActive: true,
  },
  {
    id: 'cat-freewheel',
    name: 'Freewheel',
    slug: 'freewheel',
    description: 'Freewheel and drivetrain components',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20235716.png',
    parentId: 'cat-parts',
    sortOrder: 15,
    isActive: true,
  },
  {
    id: 'cat-headset',
    name: 'Headset',
    slug: 'headset',
    description: 'Handlebar and fork headset parts',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20235416.png',
    parentId: 'cat-parts',
    sortOrder: 16,
    isActive: true,
  },
  {
    id: 'cat-eletric',
    name: 'Eletric',
    slug: 'eletric',
    description: 'Electrical components',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20234056.png',
    parentId: 'cat-parts',
    sortOrder: 17,
    isActive: true,
  },
  {
    id: 'cat-assessories',
    name: 'Assessories',
    slug: 'assessories',
    description: 'Accessories and add-ons',
    imageUrl: '/equipamentos/Screenshot%202025-12-27%20233632.png',
    parentId: 'cat-parts',
    sortOrder: 18,
    isActive: true,
  },
]

export const products: Product[] = [
  {
    id: 'prod-1',
    sku: 'VR-PRO-X1',
    name: 'Pro X1 Mountain 750W',
    slug: 'pro-x1-mountain-750w',
    description: `The Pro X1 Mountain is our flagship off-road e-bike, engineered for serious trail riders who demand peak performance. Featuring a powerful 750W brushless motor, full suspension with 150mm travel, and a high-capacity 48V 20Ah battery, this beast conquers hills with ease while delivering up to 80km of range on a single charge.

Built with a lightweight aluminum alloy frame and equipped with hydraulic disc brakes, the Pro X1 offers unmatched control and stopping power on technical descents. The 14" fat tires provide exceptional grip on loose terrain, mud, and even snow.

Whether you're hitting the trails or exploring rugged outback terrain, the Pro X1 Mountain is your ultimate adventure companion.`,
    shortDesc: 'High-performance mountain e-bike with 750W motor and full suspension',
    status: 'IN_STOCK',
    categoryId: 'cat-mountain',
    priceRetail: 3299,
    priceWholesale: 2499,
    compareAt: 3899,
    stock: 15,
    lowStockAlert: 5,
    trackInventory: true,
    weightKg: 32,
    isFeatured: true,
    sortOrder: 1,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-01'),
    category: categories[0],
    images: [
      { id: 'img-1-1', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/8bd2adb8-e2f9-4cae-98eb-fed1e25550af-qgdzRMKpVPTWhsgNu7aa0r49TC2Rcu.jpg', altText: 'Pro X1 Mountain side view', sortOrder: 1, isPrimary: true },
      { id: 'img-1-2', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c808f014-fe32-4edb-83bc-b2a20c105303-c4CtXdKyx94bjWlV9U8RI6hxbmuM2p.jpg', altText: 'Pro X1 Mountain front view', sortOrder: 2, isPrimary: false },
      { id: 'img-1-3', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/7e189b1a-bc60-481a-a0d1-a7a0054c467a-Kj1Mli1nD9rDqf2HoweHl2pSG3IxXX.jpg', altText: 'Pro X1 Mountain rear view', sortOrder: 3, isPrimary: false },
    ],
    specs: [
      { id: 'spec-1-1', label: 'Motor', value: '750', unit: 'W', sortOrder: 1 },
      { id: 'spec-1-2', label: 'Battery', value: '48V 20Ah', unit: '', sortOrder: 2 },
      { id: 'spec-1-3', label: 'Range', value: '60-80', unit: 'km', sortOrder: 3 },
      { id: 'spec-1-4', label: 'Top Speed', value: '45', unit: 'km/h', sortOrder: 4 },
      { id: 'spec-1-5', label: 'Weight', value: '32', unit: 'kg', sortOrder: 5 },
      { id: 'spec-1-6', label: 'Charge Time', value: '5-6', unit: 'hours', sortOrder: 6 },
    ],
  },
  {
    id: 'prod-2',
    sku: 'VR-CITY-500',
    name: 'City Glide 500W Commuter',
    slug: 'city-glide-500w-commuter',
    description: `The City Glide is the perfect urban companion for daily commuters who want to arrive fresh and on time. Its sleek step-through design makes mounting effortless, while the 500W rear hub motor provides smooth, silent acceleration.

Equipped with integrated LED lights, a rear cargo rack, and fenders, the City Glide is ready for any weather. The 48V 15Ah battery delivers up to 70km of range, more than enough for your daily round trip.

Features include a digital LCD display with speedometer, battery indicator, and ride mode selection. The comfortable upright riding position and suspension seatpost absorb city bumps for a smooth ride every time.`,
    shortDesc: 'Elegant city e-bike for effortless commuting',
    status: 'IN_STOCK',
    categoryId: 'cat-city',
    priceRetail: 2499,
    priceWholesale: 1899,
    compareAt: 2899,
    stock: 22,
    lowStockAlert: 5,
    trackInventory: true,
    weightKg: 26,
    isFeatured: true,
    sortOrder: 2,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-15'),
    category: categories[1],
    images: [
      { id: 'img-2-1', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/96bd9dea-8ef8-48a6-8cd8-413193e86a5a-Rbz2NURNnnuhomDJGramCYifE1tihA.jpg', altText: 'City Glide side view', sortOrder: 1, isPrimary: true },
      { id: 'img-2-2', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fecf2cc1-c6c3-4762-9181-f7b27bf1bf55-g0PKUCVMRh8gHugKknKe6KaKj6Vkmo.jpg', altText: 'City Glide with Uber Eats bag', sortOrder: 2, isPrimary: false },
    ],
    specs: [
      { id: 'spec-2-1', label: 'Motor', value: '500', unit: 'W', sortOrder: 1 },
      { id: 'spec-2-2', label: 'Battery', value: '48V 15Ah', unit: '', sortOrder: 2 },
      { id: 'spec-2-3', label: 'Range', value: '50-70', unit: 'km', sortOrder: 3 },
      { id: 'spec-2-4', label: 'Top Speed', value: '35', unit: 'km/h', sortOrder: 4 },
      { id: 'spec-2-5', label: 'Weight', value: '26', unit: 'kg', sortOrder: 5 },
      { id: 'spec-2-6', label: 'Charge Time', value: '4-5', unit: 'hours', sortOrder: 6 },
    ],
  },
  {
    id: 'prod-3',
    sku: 'VR-CARGO-750',
    name: 'Cargo Pro 750W Long-Tail',
    slug: 'cargo-pro-750w-long-tail',
    description: `The Cargo Pro is built for serious hauling. Whether you're running deliveries for your business or doing the weekly family shop, this long-tail cargo e-bike handles it all. The extended rear platform supports up to 80kg of cargo, with optional passenger seat and footpegs.

Powered by a torque-sensing 750W mid-drive motor, the Cargo Pro delivers smooth, powerful assistance even under heavy loads. The 48V 25Ah battery pack ensures you have the range to complete your routes without range anxiety.

Heavy-duty disc brakes provide confident stopping power, while the reinforced frame and double-wall wheels handle the extra weight with ease. Multiple accessory mounting points let you customize your cargo setup.`,
    shortDesc: 'Heavy-duty cargo e-bike for deliveries and families',
    status: 'PRE_ORDER',
    categoryId: 'cat-cargo',
    priceRetail: 4199,
    priceWholesale: 3299,
    compareAt: 4699,
    stock: 0,
    lowStockAlert: 5,
    trackInventory: true,
    weightKg: 38,
    isFeatured: true,
    sortOrder: 3,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-01'),
    category: categories[2],
    images: [
      { id: 'img-3-1', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1fbdcf1e-80ee-4f68-b0c0-f634a6bdc6ab-I6Z2zOXUtqer2qhASgpFGiLKA8UJ0M.jpg', altText: 'Cargo Pro with rack', sortOrder: 1, isPrimary: true },
      { id: 'img-3-2', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20bc5798-0e1c-4f53-aa54-971c35e320f4-FdUy0UHHYPmQtEnVllK8kv858dLkQ5.jpg', altText: 'Cargo Pro rear view', sortOrder: 2, isPrimary: false },
      { id: 'img-3-3', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/98d4dbea-3b03-488f-87fb-a546080050ca-VqDmQgwizJbdNeBggCw0HcuotDsYqR.jpg', altText: 'Cargo Pro rear angle', sortOrder: 3, isPrimary: false },
    ],
    specs: [
      { id: 'spec-3-1', label: 'Motor', value: '750', unit: 'W', sortOrder: 1 },
      { id: 'spec-3-2', label: 'Battery', value: '48V 25Ah', unit: '', sortOrder: 2 },
      { id: 'spec-3-3', label: 'Range', value: '50-70', unit: 'km', sortOrder: 3 },
      { id: 'spec-3-4', label: 'Cargo Capacity', value: '80', unit: 'kg', sortOrder: 4 },
      { id: 'spec-3-5', label: 'Weight', value: '38', unit: 'kg', sortOrder: 5 },
      { id: 'spec-3-6', label: 'Charge Time', value: '6-7', unit: 'hours', sortOrder: 6 },
    ],
  },
  {
    id: 'prod-4',
    sku: 'VR-APEX-1000',
    name: 'Apex Full-Sus 1000W',
    slug: 'apex-full-sus-1000w',
    description: `The Apex represents the pinnacle of VoltRide engineering. This full-suspension monster features a 1000W mid-drive motor that delivers incredible torque for the most demanding climbs. With 180mm of front and rear travel, it devours technical terrain while keeping you in control.

The carbon fiber frame keeps weight to a minimum while maximizing strength and stiffness. Premium Fox suspension components provide precise damping control, adjustable on-the-fly for varied terrain. The 52V 24Ah battery delivers extended range for epic all-day adventures.

Every detail has been optimized for performance: SRAM Eagle 12-speed drivetrain, 4-piston hydraulic brakes, tubeless-ready wheels, and an integrated dropper post. The Apex is for riders who accept no compromises.`,
    shortDesc: 'Ultimate full-suspension trail destroyer with 1000W motor',
    status: 'COMING_SOON',
    categoryId: 'cat-mountain',
    priceRetail: 5499,
    priceWholesale: 4299,
    compareAt: 6199,
    stock: 0,
    lowStockAlert: 5,
    trackInventory: true,
    weightKg: 28,
    isFeatured: true,
    sortOrder: 4,
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-01'),
    category: categories[0],
    images: [
      { id: 'img-4-1', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0abe3c71-300b-4185-84bc-36de14bebeb1-th2YWeJOYDeCZIR3zPA0YLgUsvuptt.jpg', altText: 'Apex Full-Sus side', sortOrder: 1, isPrimary: true },
      { id: 'img-4-2', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/79946a2f-c113-42d8-97cc-5ab620c1d621-Nfivxi3rtbMWtYf2JviOkLHRi1ESuC.jpg', altText: 'Apex wrapped new', sortOrder: 2, isPrimary: false },
    ],
    specs: [
      { id: 'spec-4-1', label: 'Motor', value: '1000', unit: 'W', sortOrder: 1 },
      { id: 'spec-4-2', label: 'Battery', value: '52V 24Ah', unit: '', sortOrder: 2 },
      { id: 'spec-4-3', label: 'Range', value: '70-100', unit: 'km', sortOrder: 3 },
      { id: 'spec-4-4', label: 'Top Speed', value: '50', unit: 'km/h', sortOrder: 4 },
      { id: 'spec-4-5', label: 'Weight', value: '28', unit: 'kg', sortOrder: 5 },
      { id: 'spec-4-6', label: 'Suspension Travel', value: '180', unit: 'mm', sortOrder: 6 },
    ],
  },
  {
    id: 'prod-5',
    sku: 'VR-FOLD-400',
    name: 'FoldX 400W Compact',
    slug: 'foldx-400w-compact',
    description: `The FoldX is the ultimate solution for commuters with limited storage space. This clever e-bike folds in seconds to a compact size that fits under your desk, in your car boot, or on public transport. Despite its small footprint, it doesn't compromise on performance.

The 400W hub motor provides peppy acceleration, while the 36V 12Ah battery delivers a respectable 40km range - perfect for urban journeys. 14" puncture-resistant tires handle city streets with confidence, and the front suspension fork absorbs bumps and potholes.

Features include integrated lights, a rear rack for panniers, and a comfortable adjustable saddle. The quick-release folding mechanism requires no tools and the magnetic latches keep it secure when folded.`,
    shortDesc: 'Ultra-compact folding e-bike for easy storage and transport',
    status: 'IN_STOCK',
    categoryId: 'cat-folding',
    priceRetail: 1899,
    priceWholesale: 1399,
    compareAt: 2199,
    stock: 30,
    lowStockAlert: 10,
    trackInventory: true,
    weightKg: 19,
    isFeatured: true,
    sortOrder: 5,
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-20'),
    category: categories[3],
    images: [
      { id: 'img-5-1', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/63f6de0c-90db-4c8c-af27-cf1a26a12796-f9BQGH1vdFNAxlckIFFFIwD33afBSM.jpg', altText: 'FoldX Compact side', sortOrder: 1, isPrimary: true },
      { id: 'img-5-2', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2443e699-1fa8-4f28-a1a8-c97e57208c37-NiO12bbxtfTetgjO91QYr3Jj5tJPoZ.jpg', altText: 'FoldX front angle', sortOrder: 2, isPrimary: false },
    ],
    specs: [
      { id: 'spec-5-1', label: 'Motor', value: '400', unit: 'W', sortOrder: 1 },
      { id: 'spec-5-2', label: 'Battery', value: '36V 12Ah', unit: '', sortOrder: 2 },
      { id: 'spec-5-3', label: 'Range', value: '30-40', unit: 'km', sortOrder: 3 },
      { id: 'spec-5-4', label: 'Top Speed', value: '30', unit: 'km/h', sortOrder: 4 },
      { id: 'spec-5-5', label: 'Weight', value: '19', unit: 'kg', sortOrder: 5 },
      { id: 'spec-5-6', label: 'Folded Size', value: '80x65x35', unit: 'cm', sortOrder: 6 },
    ],
  },
  {
    id: 'prod-6',
    sku: 'VR-DELIVERY-500',
    name: 'Delivery Pro 500W',
    slug: 'delivery-pro-500w',
    description: `Purpose-built for food delivery and last-mile logistics, the Delivery Pro is the workhorse of the VoltRide fleet. Its robust frame, extended rear rack, and front basket provide ample cargo space for deliveries of all sizes.

The 500W motor handles hills and heavy loads with ease, while the fat 14" tires provide stability and comfort over rough urban terrain. A swappable battery system means you never have to stop - just swap a fresh battery and keep riding.

Features optimized for delivery riders include phone mount integration, USB charging port, bright LED lights visible from all angles, and a loud horn for urban navigation. The low step-through frame makes frequent mounting and dismounting effortless.`,
    shortDesc: 'Delivery-optimized e-bike with swappable battery',
    status: 'IN_STOCK',
    categoryId: 'cat-cargo',
    priceRetail: 2299,
    priceWholesale: 1749,
    compareAt: 2699,
    stock: 45,
    lowStockAlert: 15,
    trackInventory: true,
    weightKg: 29,
    isFeatured: false,
    sortOrder: 6,
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-03-01'),
    category: categories[2],
    images: [
      { id: 'img-6-1', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/588400a8-d81b-419d-aecf-d60dce6ca8c5-V47eH9ckQDbdCbtvUYWgeYyMPfKRTi.jpg', altText: 'Delivery Pro front', sortOrder: 1, isPrimary: true },
      { id: 'img-6-2', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fc002bad-5527-4fc7-bd7d-25c34cddc8c0-8jxRiuoVcbKpFuZdQYWS2osH4uLERQ.jpg', altText: 'Delivery Pro detail', sortOrder: 2, isPrimary: false },
      { id: 'img-6-3', url: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f5fdb1e8-cdfa-43ae-8fbf-2a7eedb94e3f-NcTnAJDGpNdCqBmIzlHiVQn7NvDHuT.jpg', altText: 'Delivery Pro rear', sortOrder: 3, isPrimary: false },
    ],
    specs: [
      { id: 'spec-6-1', label: 'Motor', value: '500', unit: 'W', sortOrder: 1 },
      { id: 'spec-6-2', label: 'Battery', value: '48V 20Ah (Swappable)', unit: '', sortOrder: 2 },
      { id: 'spec-6-3', label: 'Range', value: '60-80', unit: 'km', sortOrder: 3 },
      { id: 'spec-6-4', label: 'Cargo Capacity', value: '50', unit: 'kg', sortOrder: 4 },
      { id: 'spec-6-5', label: 'Weight', value: '29', unit: 'kg', sortOrder: 5 },
      { id: 'spec-6-6', label: 'Charge Time', value: '4-5', unit: 'hours', sortOrder: 6 },
    ],
  },
]

export const reviews: Review[] = [
  {
    id: 'review-1',
    userId: 'user-1',
    productId: 'prod-1',
    rating: 5,
    title: 'Absolutely incredible on the trails',
    body: 'I\'ve been riding mountain bikes for 20 years and the Pro X1 is hands down the best e-MTB I\'ve ever ridden. The power delivery is smooth and the battery easily lasts my entire weekend rides. Worth every dollar.',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-02-20'),
    user: { firstName: 'Michael', lastName: 'Thompson' },
  },
  {
    id: 'review-2',
    userId: 'user-2',
    productId: 'prod-2',
    rating: 5,
    title: 'Perfect for my Sydney commute',
    body: 'I ride 15km each way to work and the City Glide makes it a breeze. I arrive fresh, not sweaty, and the battery still shows 60% when I get home. The integrated lights are super bright too.',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-02-25'),
    user: { firstName: 'Sarah', lastName: 'Chen' },
  },
  {
    id: 'review-3',
    userId: 'user-3',
    productId: 'prod-6',
    rating: 5,
    title: 'Best investment for my delivery business',
    body: 'We run a fleet of 12 Delivery Pros for our Uber Eats riders. The swappable batteries mean our riders never have downtime, and the build quality has been rock solid even with heavy daily use. VoltRide\'s B2B pricing made it affordable to scale up.',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-03-01'),
    user: { firstName: 'David', lastName: 'Martinez' },
  },
  {
    id: 'review-4',
    userId: 'user-4',
    productId: 'prod-2',
    rating: 5,
    title: 'Game changer for deliveries',
    body: 'We switched our local delivery fleet to VoltRide city bikes and our riders love them. Quiet, fast and super reliable even with daily use.',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-03-05'),
    user: { firstName: 'Emily', lastName: 'Rogers' },
  },
  {
    id: 'review-5',
    userId: 'user-5',
    productId: 'prod-1',
    rating: 4,
    title: 'Climbs like nothing else',
    body: 'I live in the Blue Mountains and this thing eats climbs for breakfast. I only wish I had upgraded sooner.',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-03-08'),
    user: { firstName: 'Josh', lastName: 'Nguyen' },
  },
  {
    id: 'review-6',
    userId: 'user-6',
    productId: 'prod-5',
    rating: 5,
    title: 'Perfect for apartment living',
    body: 'The FoldX fits in the lift and in my tiny storage cage. It still feels really solid on the road and I can take it on the train easily.',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-03-10'),
    user: { firstName: 'Olivia', lastName: 'Smith' },
  },
  {
    id: 'review-7',
    userId: 'user-7',
    productId: 'prod-6',
    rating: 5,
    title: 'Service team is brilliant',
    body: 'The mobile servicing is the best part. They came to our depot, tuned all our bikes and had us back on the road the same day.',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-03-12'),
    user: { firstName: 'Liam', lastName: 'Brown' },
  },
  {
    id: 'review-8',
    userId: 'user-8',
    productId: 'prod-2',
    rating: 5,
    title: 'Feels premium end to end',
    body: 'From the test ride to delivery the whole experience felt premium. The bike arrived well packed and the quality is spot on.',
    isVerified: true,
    isApproved: true,
    createdAt: new Date('2024-03-15'),
    user: { firstName: 'Chloe', lastName: 'Williams' },
  },
]

export const shippingZones: ShippingZone[] = [
  {
    id: 'zone-nsw',
    name: 'New South Wales',
    states: ['NSW'],
    isActive: true,
    rates: [
      { id: 'rate-nsw-1', zoneId: 'zone-nsw', name: 'Standard Shipping', carrier: 'Australia Post', price: 0, isFreeOver: 500, estimatedDays: '3-5 business days' },
      { id: 'rate-nsw-2', zoneId: 'zone-nsw', name: 'Express Shipping', carrier: 'StarTrack', price: 49, estimatedDays: '1-2 business days' },
    ],
  },
  {
    id: 'zone-vic',
    name: 'Victoria',
    states: ['VIC'],
    isActive: true,
    rates: [
      { id: 'rate-vic-1', zoneId: 'zone-vic', name: 'Standard Shipping', carrier: 'Australia Post', price: 0, isFreeOver: 500, estimatedDays: '3-5 business days' },
      { id: 'rate-vic-2', zoneId: 'zone-vic', name: 'Express Shipping', carrier: 'StarTrack', price: 59, estimatedDays: '1-2 business days' },
    ],
  },
  {
    id: 'zone-other',
    name: 'Other States & Territories',
    states: ['QLD', 'SA', 'WA', 'TAS', 'NT', 'ACT'],
    isActive: true,
    rates: [
      { id: 'rate-other-1', zoneId: 'zone-other', name: 'Standard Shipping', carrier: 'Australia Post', price: 29, isFreeOver: 500, estimatedDays: '5-7 business days' },
      { id: 'rate-other-2', zoneId: 'zone-other', name: 'Express Shipping', carrier: 'StarTrack', price: 79, estimatedDays: '2-4 business days' },
    ],
  },
]

// Helper functions
export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug)
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = categories.find(c => c.slug === categorySlug)
  if (!category) return []
  return products.filter(p => p.categoryId === category.id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured)
}

export function getProductReviews(productId: string): Review[] {
  return reviews.filter(r => r.productId === productId && r.isApproved)
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function calculateB2BPrice(retailPrice: number, wholesalePrice: number | undefined, discountRate: number): number {
  if (wholesalePrice) return wholesalePrice
  return Math.round(retailPrice * (1 - discountRate))
}
