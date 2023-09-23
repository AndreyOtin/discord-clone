import React, { ReactNode } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipContentProps,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';

interface ActionTooltipProps {
  config: TooltipContentProps;
  children: ReactNode;
  text: string;
}

function ActionTooltip({ config, children, text }: ActionTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent {...config}>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default ActionTooltip;
