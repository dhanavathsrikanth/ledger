import React from 'react';
import {
  Home,
  ShoppingCart,
  Utensils,
  Zap,
  Car,
  HeartPulse,
  Film,
  ShoppingBag,
  BookOpen,
  Tag,
  Briefcase,
  Laptop,
  TrendingUp,
  Building,
  Gift,
  Coins,
  DollarSign,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Home':
      return <Home {...props} />;
    case 'ShoppingCart':
      return <ShoppingCart {...props} />;
    case 'Utensils':
      return <Utensils {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Car':
      return <Car {...props} />;
    case 'HeartPulse':
      return <HeartPulse {...props} />;
    case 'Film':
      return <Film {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Briefcase':
      return <Briefcase {...props} />;
    case 'Laptop':
      return <Laptop {...props} />;
    case 'TrendingUp':
      return <TrendingUp {...props} />;
    case 'Building':
      return <Building {...props} />;
    case 'Gift':
      return <Gift {...props} />;
    case 'Coins':
      return <Coins {...props} />;
    case 'Tag':
    default:
      return <Tag {...props} />;
  }
};
