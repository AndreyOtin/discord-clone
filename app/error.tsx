'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className={'grid justify-items-center gap-2 p-4'}>
        <h2>Something went wrong!</h2>
        {process.env.NODE_ENV === 'development' && <p>{error.message}</p>}
        <button
          className={`active:ring-none rounded border-none bg-primary p-1 text-primary-foreground  
          outline-none hover:bg-primary/90 hover:ring-offset-amber-200 focus-visible:ring-4
          `}
          onClick={() => reset()}
        >
          Try again
        </button>
      </div>
    </div>
  );
}
