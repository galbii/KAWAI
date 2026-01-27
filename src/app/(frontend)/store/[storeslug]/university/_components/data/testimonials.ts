export interface Review {
  name: string;
  location: string; 
  text: string;
  timeAgo: string;
}

export const reviews: Review[] = [
  {
    name: "Jennifer M.",
    location: "Katy", 
    text: "Outstanding service! The SHSU partnership really shows in the quality and expertise. Our daughter loves her new Kawai piano.",
    timeAgo: "1 week ago"
  },
  {
    name: "David L.",
    location: "Sugar Land",
    text: "Professional, knowledgeable, and patient. They helped us choose the perfect piano for our family. Highly recommended!",
    timeAgo: "2 weeks ago"
  },
  {
    name: "Maria R.",
    location: "Houston",
    text: "The consultation was invaluable. Their expertise and the SHSU connection gave us confidence in our investment.",
    timeAgo: "3 weeks ago"
  }
];

export interface LifestyleItem {
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
}

export const lifestyleItems: LifestyleItem[] = [
  { title: "Concert Halls", subtitle: "World-class venues", icon: "🎼", gradient: "from-purple-600 to-blue-600" },
  { title: "Master Craftsmen", subtitle: "90+ years expertise", icon: "🔨", gradient: "from-amber-600 to-orange-600" },
  { title: "Recording Studios", subtitle: "Professional sound", icon: "🎤", gradient: "from-green-600 to-emerald-600" },
  { title: "Family Homes", subtitle: "Cherished moments", icon: "🏠", gradient: "from-rose-600 to-pink-600" },
  { title: "Music Schools", subtitle: "Next generation", icon: "🎹", gradient: "from-blue-600 to-indigo-600" },
  { title: "Concert Artists", subtitle: "Global performers", icon: "⭐", gradient: "from-yellow-600 to-amber-600" }
];