import React from 'react';
import { cn } from '@/lib/utils';

type UserHeaderProps = {
  className: string;
};

const UserHeader = ({ className }: UserHeaderProps) => {
  return <div className={cn(className)}></div>;
};

export default UserHeader;
