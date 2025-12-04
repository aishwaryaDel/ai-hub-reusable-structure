import { UseCase } from '../types';
import { DEFAULT_IMAGES, STATUS_COLORS, Department, UseCaseStatus } from '../constants/constants';

interface UseCaseCardProps {
  useCase: UseCase;
  onClick: () => void;
}

/**
 * Card component displaying use case summary
 * Shows department image, status badge, title, and short description
 * Includes hover effects and keyboard accessibility
 */
export default function UseCaseCard({ useCase, onClick }: UseCaseCardProps) {
  const departmentImage = DEFAULT_IMAGES[useCase.department as Department];
  const statusColor = STATUS_COLORS[useCase.status as UseCaseStatus] || 'bg-gray-500';
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-[1.03]"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative h-[180px] w-full overflow-hidden">
        <img
          src={departmentImage}
          alt={useCase.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        <div className="absolute top-4 left-4">
          <span
            className={`${statusColor} text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm bg-opacity-90`}
          >
            {useCase.status}
          </span>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white text-lg font-bold tracking-wide">
            {useCase.department}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-xl text-gray-900 mb-2 line-clamp-2">
          {useCase.title}
        </h3>
        <p className="text-gray-600 text-base mb-3 line-clamp-3">
          {useCase.short_description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {useCase.tags?.slice(0, 3).map((tag: string, index: number) => (
            <span
              key={index}
              className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
        <p className="text-sm text-gray-400">
          By {useCase.owner_name || 'Unknown'} – {useCase.department}
        </p>
      </div>
    </div>
  );
}
