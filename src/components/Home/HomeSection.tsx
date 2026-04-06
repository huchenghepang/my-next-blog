import { FC, ReactNode } from "react";

interface HomeSectionProps {
  children: ReactNode;
}

const HomeSection: FC<HomeSectionProps> = ({ children }) => {
  return (
    <section className="relative max-w-5xl mx-auto py-12 px-4 text-center">
      {children}
    </section>
  );
};

export default HomeSection;
