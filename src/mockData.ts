import { Product } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'iPhone 17 Pro',
    description: 'The future of mobile technology with revolutionary A-series chip and aerospace-grade titanium design.',
    imageUrl: 'https://images.unsplash.com/photo-1764746218363-6cb017fcd926?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Electronics',
    rating: 4.8,
    reviewCount: 1250,
    offers: [
      { id: 'o1', storeName: 'Local Electronics', price: 1199, currency: 'USD', link: '#', isLocal: true, isInternational: false, location: 'Street 01, Gulshan-1, Dhaka-1212, BD', updatedAt: '2024-03-20' },
      { id: 'o2', storeName: 'Big Box Retailer', price: 1249, currency: 'USD', link: '#', isLocal: true, isInternational: false, location: 'City Mall, Level 4, Dhaka, BD', updatedAt: '2024-03-20' },
      { id: 'o3', storeName: 'Apple Official Store', price: 1199, currency: 'USD', link: 'https://www.apple.com/shop/buy-iphone/iphone-17-pro', isLocal: false, isInternational: true, location: 'International Shipping Depot', updatedAt: '2024-03-20' },
    ],
    history: [
      { date: '2024-03-01', price: 1099 },
      { date: '2024-03-05', price: 1049 },
      { date: '2024-03-10', price: 1049 },
      { date: '2024-03-15', price: 999 },
      { date: '2024-03-20', price: 950 },
    ]
  },
  {
    id: '2',
    name: 'Samsung S26 Ultra',
    description: 'The future of mobile technology with revolutionary A-series chip and pro-grade camera system.',
    imageUrl: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=400',
    category: 'Electronics',
    rating: 4.9,
    reviewCount: 420,
    offers: [
      { id: 'o4', storeName: 'Apple Store', price: 1199, currency: 'USD', link: 'https://www.apple.com/shop/buy-iphone/iphone-17-pro', isLocal: false, isInternational: true, location: 'Official Store', updatedAt: '2024-03-20' },
      { id: 'o5', storeName: 'Tech Hub Premium', price: 1249, currency: 'USD', link: '#', isLocal: true, isInternational: false, location: 'Gadget Street, Sector-7, Uttara, BD', updatedAt: '2024-03-20' },
      { id: 'o6', storeName: 'Express Import', price: 1150, currency: 'USD', link: '#', isLocal: false, isInternational: true, location: 'Hong Kong Logistics Center', updatedAt: '2024-03-20' },
    ],
    history: [
      { date: '2024-03-01', price: 1299 },
      { date: '2024-03-05', price: 1249 },
      { date: '2024-03-10', price: 1249 },
      { date: '2024-03-15', price: 1199 },
      { date: '2024-03-20', price: 1150 },
    ]
  },
  {
    id: '3',
    name: 'Nike Air Max 270',
    description: 'Comfort and style with the large Air unit.',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=300',
    category: 'Footwear',
    rating: 4.5,
    reviewCount: 2300,
    offers: [
      { id: 'o7', storeName: 'Sports Direct', price: 150, currency: 'USD', link: '#', isLocal: true, isInternational: false, location: 'Stadium Road, Mirpur, Dhaka, BD', updatedAt: '2024-03-20' },
      { id: 'o8', storeName: 'Sole Mates', price: 160, currency: 'USD', link: '#', isLocal: true, isInternational: false, location: 'Fashion Hub, Level 2, Banani, BD', updatedAt: '2024-03-20' },
    ],
    history: [
      { date: '2024-03-01', price: 170 },
      { date: '2024-03-10', price: 160 },
      { date: '2024-03-20', price: 150 },
    ]
  },
  {
    id: '4',
    name: 'MacBook Pro M3 Max',
    description: 'Most advanced laptop with unprecedented performance for creators.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400',
    category: 'Computers',
    rating: 4.9,
    reviewCount: 850,
    offers: [
      { id: 'o9', storeName: 'Apple Store', price: 3499, currency: 'USD', link: '#', isLocal: false, isInternational: true, location: 'Official Store', updatedAt: '2024-03-20' },
      { id: 'o10', storeName: 'Computer World Pro', price: 3600, currency: 'USD', link: '#', isLocal: true, isInternational: false, location: 'IDB Bhaban, Level 3, Dhaka, BD', updatedAt: '2024-03-20' },
    ],
    history: [
      { date: '2024-03-01', price: 3499 },
      { date: '2024-03-15', price: 3499 },
    ]
  },
  {
    id: '5',
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling headphones with exceptional sound.',
    imageUrl: 'https://images.unsplash.com/photo-1618366712214-8c075189d0ad?auto=format&fit=crop&q=80&w=400',
    category: 'Audio',
    rating: 4.8,
    reviewCount: 3100,
    offers: [
      { id: 'o11', storeName: 'Amazon', price: 398, currency: 'USD', link: '#', isLocal: false, isInternational: true, location: 'Global Logistics', updatedAt: '2024-03-20' },
      { id: 'o12', storeName: 'Headphone Zone BD', price: 415, currency: 'USD', link: '#', isLocal: true, isInternational: false, location: 'Jamuna Future Park, Dhaka, BD', updatedAt: '2024-03-20' },
    ],
    history: [
      { date: '2024-03-01', price: 420 },
      { date: '2024-03-10', price: 400 },
      { date: '2024-03-20', price: 398 },
    ]
  },
  {
    id: '6',
    name: 'Nespresso Vertuo Pop',
    description: 'Compact and colorful coffee machine for the perfect crema.',
    imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&q=80&w=400',
    category: 'Appliances',
    rating: 4.4,
    reviewCount: 6400,
    offers: [
      { id: 'o13', storeName: 'Kitchen & Co', price: 129, currency: 'USD', link: '#', isLocal: true, isInternational: false, location: 'Baridhara DOHS, Dhaka, BD', updatedAt: '2024-03-20' },
      { id: 'o14', storeName: 'Import Kings', price: 145, currency: 'USD', link: '#', isLocal: true, isInternational: false, location: 'Bashundhara R/A, Dhaka, BD', updatedAt: '2024-03-20' },
    ],
    history: [
      { date: '2024-03-01', price: 149 },
      { date: '2024-03-15', price: 129 },
    ]
  }
];
