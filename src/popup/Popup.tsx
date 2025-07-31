import { JSX } from 'react';

import ErrorMessage from '../components/ErrorMessage';
import PromptInput from '../components/PromptInput';
import SubmitButton from '../components/SubmitButton';
import WebsiteSelector from '../components/WebsiteSelector';
import usePopupState from '../hooks/usePopupState';

export default function Popup(): JSX.Element {
  const {
    selectedWebsites,
    prompt,
    isSubmitting,
    error,
    handleWebsiteToggle,
    setPrompt,
    handleSubmit,
    selectAllInCategory,
    clearSelection,
  } = usePopupState();

  return (
    <div
      id='my-ext'
      className='box-border w-80 min-w-80 max-w-sm p-4'
      data-theme='light'
      style={{ width: '320px', minWidth: '320px' }}
    >
      <h2 className='mb-4 text-lg font-bold'>AI Multi-Submit</h2>

      <ErrorMessage message={error} />

      <WebsiteSelector
        selectedWebsites={selectedWebsites}
        onWebsiteToggle={handleWebsiteToggle}
        onSelectAllInCategory={selectAllInCategory}
        onClearSelection={clearSelection}
      />

      <PromptInput
        value={prompt}
        onChange={setPrompt}
        disabled={isSubmitting}
      />

      <SubmitButton
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        selectedCount={selectedWebsites.length}
        promptEmpty={!prompt.trim()}
      />
    </div>
  );
}
