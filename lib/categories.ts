// Facebook Ads Aligned Category Taxonomy for ShoppDropp
// These categories map directly to Facebook's ad targeting options

export interface CategoryOption {
  id: string
  label: string
  icon: string
  facebookCategoryId?: string
  description: string
  subcategories: SubcategoryOption[]
  targeting: {
    interests: string[]
    behaviors: string[]
    demographics: string[]
  }
}

export interface SubcategoryOption {
  id: string
  label: string
  description: string
  facebookInterests: string[]
  audienceSize?: string
  competitionLevel: 'low' | 'medium' | 'high'
  avgCpm: number
}

export const CATEGORIES: CategoryOption[] = [
  {
    id: 'womens_clothing',
    label: "Women's Clothing",
    icon: '👗',
    facebookCategoryId: '6003139266582',
    description: 'Dresses, tops, activewear, accessories',
    targeting: {
      interests: ["Women's clothing", 'Fashion', 'Online shopping'],
      behaviors: ['Engaged shoppers', 'Online buyers'],
      demographics: ['Women', '18-65+']
    },
    subcategories: [
      { id: 'casual_wear', label: 'Casual Wear', description: 'Everyday comfortable clothing', facebookInterests: ['Casual wear', 'Comfortable clothing'], competitionLevel: 'high', avgCpm: 12.50 },
      { id: 'activewear', label: 'Activewear', description: 'Yoga pants, sports bras', facebookInterests: ['Athleisure', 'Activewear', 'Yoga apparel'], competitionLevel: 'high', avgCpm: 15.20 },
      { id: 'dresses', label: 'Dresses', description: 'Formal and casual dresses', facebookInterests: ['Dresses', 'Evening wear'], competitionLevel: 'medium', avgCpm: 11.80 },
    ]
  },
  {
    id: 'mens_clothing',
    label: "Men's Clothing",
    icon: '👔',
    facebookCategoryId: '6003139266583',
    description: 'Shirts, pants, suits, casual wear',
    targeting: {
      interests: ["Men's clothing", 'Fashion'],
      behaviors: ['Engaged shoppers'],
      demographics: ['Men', '18-65+']
    },
    subcategories: [
      { id: 'mens_casual', label: 'Casual Wear', description: 'T-shirts, jeans', facebookInterests: ['Casual wear', 'T-shirts'], competitionLevel: 'high', avgCpm: 11.20 },
      { id: 'mens_formal', label: 'Formal Wear', description: 'Suits, dress shirts', facebookInterests: ['Suits', 'Business attire'], competitionLevel: 'medium', avgCpm: 14.50 },
      { id: 'streetwear', label: 'Streetwear', description: 'Street fashion', facebookInterests: ['Streetwear', 'Urban fashion'], competitionLevel: 'high', avgCpm: 16.40 },
    ]
  },
  {
    id: 'accessories',
    label: 'Accessories',
    icon: '💍',
    facebookCategoryId: '6003139266584',
    description: 'Bags, watches, jewelry',
    targeting: {
      interests: ['Jewelry', 'Watches', 'Accessories'],
      behaviors: ['Engaged shoppers'],
      demographics: ['All genders', '18-65+']
    },
    subcategories: [
      { id: 'jewelry', label: 'Jewelry', description: 'Rings, necklaces', facebookInterests: ['Jewelry', 'Fine jewelry'], competitionLevel: 'high', avgCpm: 15.60 },
      { id: 'watches', label: 'Watches', description: 'Smart and analog watches', facebookInterests: ['Watches', 'Luxury watches'], competitionLevel: 'high', avgCpm: 18.20 },
      { id: 'handbags', label: 'Handbags', description: 'Designer bags', facebookInterests: ['Handbags', 'Designer bags'], competitionLevel: 'high', avgCpm: 16.80 },
    ]
  },
  {
    id: 'footwear',
    label: 'Footwear',
    icon: '👟',
    facebookCategoryId: '6003139266585',
    description: 'Shoes, sneakers, boots',
    targeting: {
      interests: ['Shoes', 'Sneakers', 'Footwear'],
      behaviors: ['Engaged shoppers'],
      demographics: ['All genders', '18-65+']
    },
    subcategories: [
      { id: 'sneakers', label: 'Sneakers', description: 'Athletic and lifestyle', facebookInterests: ['Sneakers', 'Athletic shoes'], competitionLevel: 'high', avgCpm: 17.40 },
      { id: 'boots', label: 'Boots', description: 'Work and fashion boots', facebookInterests: ['Boots', 'Work boots'], competitionLevel: 'medium', avgCpm: 13.20 },
      { id: 'sandals', label: 'Sandals', description: 'Summer footwear', facebookInterests: ['Sandals', 'Summer shoes'], competitionLevel: 'medium', avgCpm: 9.80 },
    ]
  },
  {
    id: 'pet_supplies',
    label: 'Pet Supplies',
    icon: '🐕',
    facebookCategoryId: '6003139266586',
    description: 'Food, toys, accessories for pets',
    targeting: {
      interests: ['Pets', 'Pet supplies', 'Dog owners'],
      behaviors: ['Pet owners'],
      demographics: ['All genders', '25-65+']
    },
    subcategories: [
      { id: 'dog_food', label: 'Dog Food', description: 'Kibble and treats', facebookInterests: ['Dog food', 'Organic dog treats'], competitionLevel: 'high', avgCpm: 14.80 },
      { id: 'pet_toys', label: 'Pet Toys', description: 'Chew and interactive toys', facebookInterests: ['Dog toys', 'Cat toys'], competitionLevel: 'high', avgCpm: 12.40 },
      { id: 'pet_beds', label: 'Pet Beds', description: 'Beds and furniture', facebookInterests: ['Dog beds', 'Pet furniture'], competitionLevel: 'medium', avgCpm: 13.40 },
    ]
  },
  {
    id: 'home_decor',
    label: 'Home Decor',
    icon: '🏠',
    facebookCategoryId: '6003139266587',
    description: 'Furniture, decor, lighting',
    targeting: {
      interests: ['Home decor', 'Interior design'],
      behaviors: ['Homeowners'],
      demographics: ['All genders', '25-65+']
    },
    subcategories: [
      { id: 'wall_art', label: 'Wall Art', description: 'Paintings and prints', facebookInterests: ['Wall art', 'Home decor'], competitionLevel: 'high', avgCpm: 12.80 },
      { id: 'lighting', label: 'Lighting', description: 'Lamps and fixtures', facebookInterests: ['Home lighting', 'Lamps'], competitionLevel: 'medium', avgCpm: 13.40 },
      { id: 'rugs', label: 'Rugs', description: 'Area rugs', facebookInterests: ['Area rugs', 'Home rugs'], competitionLevel: 'medium', avgCpm: 14.60 },
    ]
  },
  {
    id: 'skincare',
    label: 'Skincare',
    icon: '✨',
    facebookCategoryId: '6003139266588',
    description: 'Cleansers, moisturizers, serums',
    targeting: {
      interests: ['Skincare', 'Beauty'],
      behaviors: ['Engaged shoppers'],
      demographics: ['Women', '18-65+']
    },
    subcategories: [
      { id: 'cleansers', label: 'Cleansers', description: 'Face wash', facebookInterests: ['Face cleanser', 'Facial cleansing'], competitionLevel: 'high', avgCpm: 14.80 },
      { id: 'moisturizers', label: 'Moisturizers', description: 'Day and night creams', facebookInterests: ['Face moisturizer', 'Day cream'], competitionLevel: 'high', avgCpm: 15.20 },
      { id: 'serums', label: 'Serums', description: 'Vitamin C, retinol', facebookInterests: ['Face serums', 'Vitamin C serum'], competitionLevel: 'high', avgCpm: 18.60 },
    ]
  },
  {
    id: 'makeup',
    label: 'Makeup',
    icon: '💄',
    facebookCategoryId: '6003139266589',
    description: 'Face makeup, eye makeup, lips',
    targeting: {
      interests: ['Makeup', 'Cosmetics'],
      behaviors: ['Engaged shoppers'],
      demographics: ['Women', '18-45']
    },
    subcategories: [
      { id: 'foundation', label: 'Foundation', description: 'Liquid and powder', facebookInterests: ['Foundation makeup', 'Concealer'], competitionLevel: 'high', avgCpm: 16.80 },
      { id: 'eye_makeup', label: 'Eye Makeup', description: 'Shadow, mascara, liner', facebookInterests: ['Eyeshadow', 'Mascara'], competitionLevel: 'high', avgCpm: 15.40 },
      { id: 'lip_products', label: 'Lip Products', description: 'Lipstick and gloss', facebookInterests: ['Lipstick', 'Lip gloss'], competitionLevel: 'high', avgCpm: 14.60 },
    ]
  },
]

export function getCategoryById(id: string): CategoryOption | undefined {
  return CATEGORIES.find(c => c.id === id)
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): SubcategoryOption | undefined {
  const category = getCategoryById(categoryId)
  return category?.subcategories.find(s => s.id === subcategoryId)
}

export function getAllSubcategories(): { category: CategoryOption; subcategory: SubcategoryOption }[] {
  const result: { category: CategoryOption; subcategory: SubcategoryOption }[] = []
  CATEGORIES.forEach(category => {
    category.subcategories.forEach(subcategory => {
      result.push({ category, subcategory })
    })
  })
  return result
}
