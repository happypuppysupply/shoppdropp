// Onboarding Wizard Types

export interface CategoryOption {
  id: string
  label: string
  icon: string
  color: string
  subcategories: SubcategoryOption[]
}

export interface SubcategoryOption {
  id: string
  label: string
  description: string
}

export interface NicheOption {
  id: string
  label: string
  icon: string
}

export interface AudienceOption {
  id: string
  label: string
  icon: string
  description: string
}

export interface SupplierOption {
  id: string
  label: string
  icon: string
  description: string
}

export interface OnboardingData {
  // Step 1: Category
  category: {
    primary: string
    subcategory: string
  }
  
  // Step 2: Niche & Audience
  nicheAngles: string[]
  targetAudience: string[]
  
  // Step 3: Brand Voice
  brandVoice: {
    playful: number
    professional: number
    luxury: number
  }
  visualStyle: string
  
  // Step 4: Product Strategy
  pricing: {
    min: number
    max: number
    targetMargin: number
  }
  productTypes: string[]
  
  // Step 5: Marketing
  monthlyBudget: number
  revenueGoal: number
  primaryChannel: string
  
  // Step 6: Platform
  shopifyConnected: boolean
  shopifyStoreUrl?: string
  suppliers: string[]
}

export type OnboardingStep = 
  | 'category' 
  | 'audience' 
  | 'brand' 
  | 'product' 
  | 'marketing' 
  | 'connect'

export const STEPS: OnboardingStep[] = [
  'category',
  'audience', 
  'brand',
  'product',
  'marketing',
  'connect'
]

export const STEP_LABELS: Record<OnboardingStep, string> = {
  category: 'Product Category',
  audience: 'Target Audience',
  brand: 'Brand Voice',
  product: 'Product Strategy',
  marketing: 'Marketing Budget',
  connect: 'Platform Setup'
}

// Data Constants
export const CATEGORIES: CategoryOption[] = [
  {
    id: 'pet_supplies',
    label: 'Pet Supplies',
    icon: '🐕',
    color: 'from-orange-500/20 to-amber-500/20',
    subcategories: [
      { id: 'dog_accessories', label: 'Dog Accessories', description: 'Collars, leashes, harnesses, bowls' },
      { id: 'dog_treats', label: 'Organic Treats', description: 'Natural, healthy snacks and chews' },
      { id: 'dog_grooming', label: 'Grooming Supplies', description: 'Shampoos, brushes, nail care' },
      { id: 'dog_toys', label: 'Toys & Enrichment', description: 'Interactive toys, puzzles, chew toys' },
      { id: 'dog_health', label: 'Health & Wellness', description: 'Supplements, vitamins, care products' },
      { id: 'dog_beds', label: 'Beds & Furniture', description: 'Orthopedic beds, crates, carriers' },
    ]
  },
  {
    id: 'fashion',
    label: 'Fashion & Apparel',
    icon: '👕',
    color: 'from-pink-500/20 to-rose-500/20',
    subcategories: [
      { id: 'womens', label: "Women's Clothing", description: 'Dresses, tops, activewear' },
      { id: 'mens', label: "Men's Clothing", description: 'Shirts, pants, outerwear' },
      { id: 'accessories', label: 'Accessories', description: 'Bags, jewelry, watches' },
      { id: 'shoes', label: 'Footwear', description: 'Sneakers, boots, sandals' },
    ]
  },
  {
    id: 'home_garden',
    label: 'Home & Garden',
    icon: '🏠',
    color: 'from-emerald-500/20 to-green-500/20',
    subcategories: [
      { id: 'decor', label: 'Home Decor', description: 'Wall art, lighting, textiles' },
      { id: 'kitchen', label: 'Kitchen & Dining', description: 'Cookware, utensils, storage' },
      { id: 'garden', label: 'Garden & Outdoor', description: 'Plants, tools, furniture' },
      { id: 'organization', label: 'Organization', description: 'Storage solutions, shelving' },
    ]
  },
  {
    id: 'beauty',
    label: 'Beauty & Personal Care',
    icon: '✨',
    color: 'from-purple-500/20 to-violet-500/20',
    subcategories: [
      { id: 'skincare', label: 'Skincare', description: 'Cleansers, moisturizers, serums' },
      { id: 'makeup', label: 'Makeup', description: 'Cosmetics, tools, palettes' },
      { id: 'haircare', label: 'Hair Care', description: 'Shampoo, styling, treatments' },
      { id: 'wellness', label: 'Wellness', description: 'Supplements, aromatherapy' },
    ]
  },
  {
    id: 'electronics',
    label: 'Electronics & Tech',
    icon: '📱',
    color: 'from-blue-500/20 to-cyan-500/20',
    subcategories: [
      { id: 'accessories', label: 'Accessories', description: 'Cases, chargers, cables' },
      { id: 'audio', label: 'Audio', description: 'Headphones, speakers, earbuds' },
      { id: 'smart_home', label: 'Smart Home', description: 'Devices, automation, security' },
      { id: 'gaming', label: 'Gaming', description: 'Accessories, peripherals' },
    ]
  },
  {
    id: 'sports',
    label: 'Sports & Fitness',
    icon: '⚽',
    color: 'from-red-500/20 to-orange-500/20',
    subcategories: [
      { id: 'fitness', label: 'Fitness Equipment', description: 'Weights, mats, resistance bands' },
      { id: 'outdoor', label: 'Outdoor Gear', description: 'Camping, hiking, cycling' },
      { id: 'apparel', label: 'Athletic Wear', description: 'Activewear, compression gear' },
      { id: 'recovery', label: 'Recovery & Wellness', description: 'Massage, foam rollers, supplements' },
    ]
  },
]

export const NICHE_ANGLES: NicheOption[] = [
  { id: 'eco_friendly', label: 'Eco-Friendly / Sustainable', icon: '🌿' },
  { id: 'premium', label: 'Premium / Luxury', icon: '💎' },
  { id: 'budget', label: 'Budget-Friendly', icon: '💰' },
  { id: 'artisan', label: 'Artisan / Handmade', icon: '🎨' },
  { id: 'innovative', label: 'Innovative / Tech-Forward', icon: '🚀' },
  { id: 'health_focused', label: 'Health & Wellness Focused', icon: '❤️' },
  { id: 'trendy', label: 'Trendy / Fashion-Forward', icon: '🔥' },
  { id: 'durable', label: 'Durable / Long-Lasting', icon: '🛡️' },
]

export const AUDIENCES: AudienceOption[] = [
  { id: 'millennial_pet_parents', label: 'Millennial Pet Parents', icon: '👫', description: 'Ages 28-43, treat pets like family' },
  { id: 'gen_z', label: 'Gen Z Shoppers', icon: '🧑‍🎤', description: 'Ages 18-27, values-driven, social media savvy' },
  { id: 'luxury_buyers', label: 'Luxury Buyers', icon: '👑', description: 'High income, quality over price' },
  { id: 'budget_conscious', label: 'Budget Conscious', icon: '🛒', description: 'Price-sensitive, deal seekers' },
  { id: 'health_enthusiasts', label: 'Health Enthusiasts', icon: '💪', description: 'Prioritize wellness, organic, natural' },
  { id: 'eco_conscious', label: 'Eco-Conscious', icon: '🌍', description: 'Sustainability is top priority' },
  { id: 'first_time_owners', label: 'First-Time Pet Owners', icon: '🐾', description: 'Need guidance, starter products' },
  { id: 'seniors', label: 'Senior Pet Owners', icon: '🧓', description: 'Ages 55+, comfort and ease matter' },
]

export const VISUAL_STYLES = [
  { id: 'minimal', label: 'Minimal & Clean', description: 'Whitespace, simple, modern' },
  { id: 'bold', label: 'Bold & Vibrant', description: 'Bright colors, high energy' },
  { id: 'rustic', label: 'Rustic & Natural', description: 'Earthy tones, organic feel' },
  { id: 'luxury', label: 'Luxury & Elegant', description: 'Black, gold, sophisticated' },
  { id: 'playful', label: 'Playful & Fun', description: 'Illustrations, bright, friendly' },
  { id: 'tech', label: 'Tech & Modern', description: 'Dark mode, gradients, sleek' },
]

export const PRODUCT_TYPES = [
  { id: 'physical', label: 'Physical Products', description: 'Shipped items, inventory needed' },
  { id: 'print_on_demand', label: 'Print on Demand', description: 'Custom designs, no inventory' },
  { id: 'dropshipping', label: 'Dropshipping', description: 'Third-party fulfillment' },
  { id: 'digital', label: 'Digital Products', description: 'Downloads, courses, templates' },
]

export const PRIMARY_CHANNELS = [
  { id: 'meta_ads', label: 'Meta Ads (Facebook/Instagram)', icon: '📘' },
  { id: 'google_ads', label: 'Google Ads', icon: '🔍' },
  { id: 'tiktok_ads', label: 'TikTok Ads', icon: '🎵' },
  { id: 'organic_social', label: 'Organic Social Media', icon: '📱' },
  { id: 'influencer', label: 'Influencer Marketing', icon: '⭐' },
  { id: 'email', label: 'Email Marketing', icon: '📧' },
  { id: 'seo', label: 'SEO / Content', icon: '📝' },
  { id: 'affiliate', label: 'Affiliate Marketing', icon: '🤝' },
]

export const SUPPLIERS: SupplierOption[] = [
  { id: 'syncee', label: 'Syncee', icon: '📦', description: 'US/EU suppliers, fast shipping' },
  { id: 'spocket', label: 'Spocket', icon: '🚀', description: 'High-quality US/EU products' },
  { id: 'dsers', label: 'DSers', icon: '⚡', description: 'AliExpress integration, bulk orders' },
  { id: 'cj_dropshipping', label: 'CJ Dropshipping', icon: '🌏', description: 'Global sourcing, warehousing' },
  { id: 'modalyst', label: 'Modalyst', icon: '✨', description: 'Premium suppliers, fast delivery' },
  { id: 'printful', label: 'Printful', icon: '🎨', description: 'Print on demand, global' },
  { id: 'printify', label: 'Printify', icon: '🖨️', description: 'Print on demand, wide catalog' },
  { id: 'manual', label: 'Manual / Other', icon: '📝', description: 'I\'ll handle sourcing myself' },
]

export const DEFAULT_ONBOARDING_DATA: OnboardingData = {
  category: { primary: '', subcategory: '' },
  nicheAngles: [],
  targetAudience: [],
  brandVoice: { playful: 5, professional: 5, luxury: 5 },
  visualStyle: '',
  pricing: { min: 25, max: 150, targetMargin: 40 },
  productTypes: [],
  monthlyBudget: 1000,
  revenueGoal: 10000,
  primaryChannel: '',
  shopifyConnected: false,
  suppliers: [],
}
