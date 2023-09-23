import React from 'react';
import { checkAuth } from '@/lib/utils';

async function Server({ params }: { params: { id: string } }) {
  await checkAuth();
  return <div className={'text-red-700'}>{params.id}</div>;
}

export default Server;
