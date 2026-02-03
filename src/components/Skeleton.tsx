import { motion } from 'framer-motion';

export const Skeleton = ({ className }: { className?: string }) => (
    <motion.div
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className={`bg-white/5 rounded-xl ${className}`}
    />
);

export const DashboardSkeleton = () => (
    <div className="space-y-8 animate-pulse">
        <div className="flex justify-between items-end">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
            ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[450px] w-full" />
            <Skeleton className="h-[450px] w-full" />
        </div>
    </div>
);

export const PropertyListSkeleton = () => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-16 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-80 w-full" />
            ))}
        </div>
    </div>
);
