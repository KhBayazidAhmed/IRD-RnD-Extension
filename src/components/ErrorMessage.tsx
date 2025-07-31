interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className='alert alert-error mb-4'>
      <span className='text-sm'>{message}</span>
    </div>
  );
}
