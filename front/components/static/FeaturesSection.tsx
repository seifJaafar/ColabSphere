import React from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/BentoGrid";
import data from "@/data/NavList";
const FeaturesSection = () => {
  const { features } = data;
  return (
    <section id="services" className="max-h-[100vh] mb-3">
      <BentoGrid>
        {features.map((feature) => (
          <BentoGridItem
            key={feature.key}
            title={feature.title}
            description={feature.description}
            id={feature.key}
            img={feature.img}
            imgClassName={feature.imageClassName}
            className={
              feature.key === 1
                ? "md:col-span-2"
                : feature.key === 2
                ? "md:col-span-1 md:row-span-2"
                : ""
            }
          />
        ))}
      </BentoGrid>
    </section>
  );
};

export default FeaturesSection;
