import React from 'react';
import { 
  Wand2, 
  ArrowLeft, 
  BookOpen, 
  Bookmark, 
  Trash2, 
  BookmarkX, 
  ChevronDown, 
  ChevronLeft, 
  Check, 
  X, 
  RotateCcw, 
  AlertCircle, 
  Star,
  User,
  LogOut
} from 'lucide-react';

type IconProps = {
  className?: string;
};

export const MagicWandIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <Wand2 className={className} />
);

export const ArrowLeftIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <ArrowLeft className={className} />
);

export const BookOpenIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <BookOpen className={className} />
);

export const BookmarkIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <Bookmark className={className} fill="currentColor" />
);

export const BookmarkOutlineIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <Bookmark className={className} />
);

export const TrashIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <Trash2 className={className} />
);

export const BookmarkXIcon: React.FC<IconProps> = ({ className = 'w-5 h-5' }) => (
  <BookmarkX className={className} />
);

export const ChevronDownIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <ChevronDown className={className} />
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <ChevronLeft className={className} />
);

export const CheckIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <Check className={className} strokeWidth={3} />
);

export const XIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <X className={className} strokeWidth={3} />
);

export const RefreshIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <RotateCcw className={className} />
);

export const ReviewMistakesIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <AlertCircle className={className} />
);

export const StarIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <Star className={className} fill="currentColor" />
);

export const UserIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <User className={className} />
);

export const LogOutIcon: React.FC<IconProps> = ({ className = 'w-6 h-6' }) => (
  <LogOut className={className} />
);
