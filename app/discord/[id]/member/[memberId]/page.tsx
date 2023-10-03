import React from 'react';
import { findServer } from '@/lib/prisma/server';
import { notFound } from 'next/navigation';

async function Member({ params }: { params: { id: string; memberId: string } }) {
  const server = await findServer(params.id);

  if (!server) {
    return notFound();
  }

  return <main className={'p-4 flex flex-col h-full w-full'}></main>;
}

export default Member;
