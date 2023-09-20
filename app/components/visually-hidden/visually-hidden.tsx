import React, { ReactElement } from 'react';
import { cn } from '@/lib/utils';

function VisuallyHidden({ children }: { children: ReactElement | ReactElement[] }) {
  return (
    <>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          className: cn(
            child.props.className,
            'absolute overflow-hidden h-0 p-0 m-[-1px] border-0 clip opacity-0'
          )
        })
      )}
    </>
  );
}

export default VisuallyHidden;
