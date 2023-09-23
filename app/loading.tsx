export default function Loading() {
  return (
    <div className={'fixed inset-0 z-20 flex bg-background'}>
      <div className="container flex items-center justify-center">
        <div
          className={
            'grid h-[35px] w-[35px] animate-spin-slow grid-cols-2 gap-x-[10px] gap-y-[15px] dark:gap-y-[15px]'
          }
        >
          <div className={'h-[10px] w-[10px] rounded-full bg-foreground'}></div>
          <div className={'h-[10px] w-[10px] rounded-full bg-foreground'}></div>
          <div className={'h-[10px] w-[10px] rounded-full bg-foreground'}></div>
          <div className={'h-[10px] w-[10px] rounded-full bg-foreground'}></div>
        </div>
      </div>
    </div>
  );
}
