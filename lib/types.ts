// VoltRide Type Definitions

export type UserRole = 'CUSTOMER' | 'WHOLESALE' | 'ADMIN'
export type AccountStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED'
export type ProductStatus = 'IN_STOCK' | 'OUT_OF_STOCK' | 'PRE_ORDER' | 'COMING_SOON' | 'ARCHIVED'
export type OrderStatus = 'PENDING' | 'PAYMENT_FAILED' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED'
export type PaymentStatus = 'PENDING' | 'PROCESSING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'DISPUTED'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  status: AccountStatus
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date
  b2bAccount?: B2BAccount
}

export interface B2BAccount {
  id: string
  userId: string
  businessName: string
  abn: string
  businessEmail: string
  annualVolume: string
  discountRate: number
  creditLimit: number
  paymentTerms: number
  approvedAt?: Date
  approvedBy?: string
  notes?: string
}

export interface Address {
  id: string
  userId: string
  label?: string
  firstName: string
  lastName: string
  line1: string
  line2?: string
  city: string
  state: string
  postcode: string
  country: string
  isDefault: boolean
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  parentId?: string
  sortOrder: number
  isActive: boolean
}

export interface ProductImage {
  id: string
  url: string
  altText?: string
  sortOrder: number
  isPrimary: boolean
}

export interface ProductSpec {
  id: string
  label: string
  value: string
  unit?: string
  sortOrder: number
}

export interface Product {
  id: string
  sku: string
  name: string
  slug: string
  description: string
  shortDesc?: string
  status: ProductStatus
  categoryId?: string
  priceRetail: number
  priceWholesale?: number
  compareAt?: number
  stock: number
  lowStockAlert: number
  trackInventory: boolean
  weightKg?: number
  isFeatured: boolean
  sortOrder: number
  metaTitle?: string
  metaDesc?: string
  createdAt: Date
  updatedAt: Date
  category?: Category
  images: ProductImage[]
  specs: ProductSpec[]
}

export interface ProductWithPrice extends Product {
  price: number
  isWholesalePrice: boolean
}

export interface CartItem {
  id: string
  cartId: string
  productId: string
  quantity: number
  priceSnap: number
  product: Product
}

export interface Cart {
  id: string
  userId?: string
  sessionId?: string
  items: CartItem[]
  subtotal: number
  gst: number
  shippingCost: number
  total: number
  itemCount: number
  qualifiesForFreeShipping: boolean
}

export interface OrderItem {
  id: string
  orderId: string
  productId?: string
  productName: string
  productSku: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export interface Order {
  id: string
  orderNumber: string
  userId?: string
  status: OrderStatus
  paymentStatus: PaymentStatus
  subtotal: number
  shippingCost: number
  gstAmount: number
  totalAmount: number
  isWholesale: boolean
  trackingNumber?: string
  shippingCarrier?: string
  estimatedDelivery?: Date
  shippedAt?: Date
  deliveredAt?: Date
  customerEmail: string
  customerName: string
  shippingAddress: Address
  items: OrderItem[]
  createdAt: Date
  updatedAt: Date
}

export interface ShippingZone {
  id: string
  name: string
  states: string[]
  isActive: boolean
  rates: ShippingRate[]
}

export interface ShippingRate {
  id: string
  zoneId: string
  name: string
  carrier?: string
  price: number
  isFreeOver?: number
  estimatedDays?: string
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string
  body: string
  isVerified: boolean
  isApproved: boolean
  createdAt: Date
  user?: { firstName: string; lastName: string }
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Status badge configuration
export const statusConfig: Record<ProductStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  IN_STOCK: { label: 'In Stock', variant: 'default' },
  OUT_OF_STOCK: { label: 'Out of Stock', variant: 'destructive' },
  PRE_ORDER: { label: 'Pre-Order', variant: 'secondary' },
  COMING_SOON: { label: 'Coming Soon', variant: 'outline' },
  ARCHIVED: { label: 'Archived', variant: 'secondary' },
}

export const orderStatusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: 'Pending', color: 'text-volt-muted' },
  PAYMENT_FAILED: { label: 'Payment Failed', color: 'text-volt-orange' },
  CONFIRMED: { label: 'Confirmed', color: 'text-volt' },
  PROCESSING: { label: 'Processing', color: 'text-volt-teal' },
  SHIPPED: { label: 'Shipped', color: 'text-volt-teal' },
  DELIVERED: { label: 'Delivered', color: 'text-volt' },
  CANCELLED: { label: 'Cancelled', color: 'text-volt-muted' },
  REFUNDED: { label: 'Refunded', color: 'text-volt-orange' },
}
