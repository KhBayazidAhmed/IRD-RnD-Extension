interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function PromptInput({
  value,
  onChange,
  disabled,
}: PromptInputProps) {
  return (
    <div className='mb-4'>
      <label htmlFor='prompt-input' className='mb-2 block text-sm font-medium'>
        Your Prompt:
        <textarea
          id='prompt-input'
          className='textarea-bordered textarea mt-2 h-24 w-full text-sm'
          placeholder='Enter your prompt here...'
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
        />
      </label>
    </div>
  );
}

PromptInput.defaultProps = {
  disabled: false,
};
