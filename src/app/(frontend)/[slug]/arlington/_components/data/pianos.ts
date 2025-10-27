export interface Piano {
  name: string;
  model: string;
  category: string;
  price: string;
  originalPrice: string;
  savings: string;
  monthlyPayment: string;
  remaining: string;
  features: string[];
  badge: string;
  image: string;
  webpImage?: string;
  fallbackImage?: string;
}

export const pianos: Piano[] = [
  {
    name: "Kawai ES120 Digital Piano",
    model: "ES120",
    category: "Digital",
    price: "$949",
    originalPrice: "$1,099",
    savings: "$150",
    monthlyPayment: "$79",
    remaining: "3 more",
    features: ["88 Weighted Keys", "Premium Sound Engine", "Bluetooth Ready", "SHSU Approved"],
    badge: "STUDENT FAVORITE",
    image: "/images/optimized/pianos/es120.webp",
    webpImage: "/images/optimized/pianos/es120.webp",
    fallbackImage: "/images/optimized/pianos/es120.jpg"
  },
  {
    name: "Kawai ES520 Digital Piano",
    model: "ES520",
    category: "Digital Premium",
    price: "$999",
    originalPrice: "$1,399",
    savings: "$400",
    monthlyPayment: "$83",
    remaining: "5 more",
    features: ["88 Keys", "Bluetooth Ready", "App Compatible", "Faculty Choice"],
    badge: "BEST VALUE",
    image: "/images/optimized/pianos/ES520W_above_1200.webp",
    webpImage: "/images/optimized/pianos/ES520W_above_1200.webp",
    fallbackImage: "/images/optimized/pianos/ES520W_above_1200.jpg"
  },
  {
    name: "K200 Upright Acoustic Piano",
    model: "K200",
    category: "Upright",
    price: "$6,390",
    originalPrice: "$8,395",
    savings: "$2,005",
    monthlyPayment: "$532",
    remaining: "2 more",
    features: ["Perfect Home Size", "Rich Acoustic Tone", "SHSU Standard", "Free Setup"],
    badge: "FAMILY FAVORITE",
    image: "/images/optimized/pianos/K-200_EP_styling_1200.webp",
    webpImage: "/images/optimized/pianos/K-200_EP_styling_1200.webp",
    fallbackImage: "/images/optimized/pianos/K-200_EP_styling_1200.jpg"
  },
  {
    name: "GL10 Grand Piano",
    model: "GL10",
    category: "Grand",
    price: "$12,950",
    originalPrice: "$18,995",
    savings: "$6,045",
    monthlyPayment: "$1,079",
    remaining: "1 more",
    features: ["Performance Grade", "Concert Quality", "Faculty Approved", "White Glove Delivery"],
    badge: "PREMIUM SELECTION",
    image: "/images/optimized/pianos/GL10_1200.webp",
    webpImage: "/images/optimized/pianos/GL10_1200.webp",
    fallbackImage: "/images/optimized/pianos/GL10_1200.jpg"
  }
];