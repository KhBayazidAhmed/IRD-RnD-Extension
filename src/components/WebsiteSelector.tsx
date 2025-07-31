import { getCategories, getWebsitesByCategory } from '../ai-scripts/config';
import WebsiteItem from './WebsiteItem';

interface WebsiteSelectorProps {
  selectedWebsites: string[];
  onWebsiteToggle: (websiteId: string) => void;
  onSelectAllInCategory: (category: string) => void;
  onClearSelection: () => void;
}

export default function WebsiteSelector({
  selectedWebsites,
  onWebsiteToggle,
  onSelectAllInCategory,
  onClearSelection,
}: WebsiteSelectorProps) {
  const categories = getCategories();

  return (
    <div className='mb-4'>
      <fieldset>
        <legend className='mb-2 block text-sm font-medium'>
          Select AI Websites:
        </legend>

        {/* Control buttons */}
        <div className='mb-3 flex gap-2'>
          <button
            type='button'
            className='btn btn-outline btn-xs'
            onClick={onClearSelection}
          >
            Clear All
          </button>
        </div>

        <div className='max-h-60 space-y-3 overflow-y-auto'>
          {categories.map((category) => {
            const websitesInCategory = getWebsitesByCategory(category);
            const selectedInCategory = websitesInCategory.filter((site) =>
              selectedWebsites.includes(site.id)
            ).length;
            const allSelected =
              selectedInCategory === websitesInCategory.length;

            return (
              <div
                key={category}
                className='rounded-lg border border-gray-200 p-2'
              >
                <div className='mb-2 flex items-center justify-between'>
                  <h3 className='text-sm font-semibold capitalize'>
                    {category}
                  </h3>
                  <button
                    type='button'
                    className={`btn btn-xs ${allSelected ? 'btn-primary' : 'btn-outline'}`}
                    onClick={() => onSelectAllInCategory(category)}
                  >
                    {allSelected ? 'Deselect All' : 'Select All'} (
                    {selectedInCategory}/{websitesInCategory.length})
                  </button>
                </div>

                <div className='space-y-1'>
                  {websitesInCategory.map((website) => (
                    <WebsiteItem
                      key={website.id}
                      website={website}
                      isSelected={selectedWebsites.includes(website.id)}
                      onToggle={onWebsiteToggle}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}
