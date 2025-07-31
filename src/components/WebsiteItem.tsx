import { AIWebsite } from '../types';

interface WebsiteItemProps {
  website: AIWebsite;
  isSelected: boolean;
  onToggle: (websiteId: string) => void;
}

export default function WebsiteItem({
  website,
  isSelected,
  onToggle,
}: WebsiteItemProps) {
  return (
    <label
      htmlFor={`website-${website.id}`}
      className='flex cursor-pointer items-center space-x-2 rounded p-1 hover:bg-gray-50'
    >
      <input
        type='checkbox'
        id={`website-${website.id}`}
        className='checkbox checkbox-primary checkbox-sm'
        checked={isSelected}
        onChange={() => onToggle(website.id)}
      />
      <div className='flex-1'>
        <span className='text-sm font-medium'>{website.name}</span>
        {website.description && (
          <div className='text-xs text-gray-500'>{website.description}</div>
        )}
      </div>
      {website.category && (
        <span className='rounded-full bg-gray-100 px-2 py-1 text-xs'>
          {website.category}
        </span>
      )}
    </label>
  );
}
