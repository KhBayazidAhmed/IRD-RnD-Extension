interface SubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  selectedCount: number;
  promptEmpty: boolean;
}

export default function SubmitButton({
  onSubmit,
  isSubmitting,
  selectedCount,
  promptEmpty,
}: SubmitButtonProps) {
  const isDisabled = isSubmitting || promptEmpty || selectedCount === 0;

  const getButtonText = () => {
    if (isSubmitting) return 'Submitting...';
    if (selectedCount === 0) return 'Select AI websites';
    if (promptEmpty) return 'Enter a prompt';
    return `Submit to ${selectedCount} AI${selectedCount !== 1 ? 's' : ''}`;
  };

  return (
    <div>
      <button
        type='button'
        className='btn btn-primary w-full'
        onClick={onSubmit}
        disabled={isDisabled}
      >
        {getButtonText()}
      </button>

      {/* Selected count */}
      <div className='mt-2 text-center text-xs text-gray-500'>
        {selectedCount} website{selectedCount !== 1 ? 's' : ''} selected
      </div>
    </div>
  );
}
