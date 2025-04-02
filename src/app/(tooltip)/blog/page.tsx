import prisma from '@/utils/prisma';
import { FC, Suspense } from 'react';
import Blog from './Blog';
interface PageProps {
  // 这里是组件的属性
  params:Promise<{info:string[]}>;
}

const Page: FC<PageProps> =  (props) => {
  const notes = prisma.notes.findMany();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Blog notes={notes} />
    </Suspense>
  );
};

export default Page;