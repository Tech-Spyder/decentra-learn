"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useState } from "react";
import { Step } from "@/modules/types";



type CourseStepCarouselProps = {
  steps: Step[];
};

export function CourseStepCarousel({ steps }: CourseStepCarouselProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [stepSliderRef, stepSlider] = useKeenSlider({
    slideChanged(s) {
      setStepIndex(s.track.details.rel);
    },
    loop: false,
  });

  return (
    <div className="w-full flex flex-col gap-6 border">
      <div ref={stepSliderRef} className="keen-slider">
        {steps.map((step, index) => (
          <div className="keen-slider__slide" key={step.id}>
            <div className="w-full">
              <h2 className="text-2xl font-semibold mb-4">{step.title}</h2>
              <StepSlider step={step} />
            </div>
          </div>
        ))}
      </div>

      {/* Step Navigation */}
      <div className="flex justify-between mt-4">
        <button
          disabled={stepIndex === 0}
          onClick={() => stepSlider.current?.prev()}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous Step
        </button>
        <button
          disabled={stepIndex === steps.length - 1}
          onClick={() => stepSlider.current?.next()}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          Next Step
        </button>
      </div>
    </div>
  );
}

function StepSlider({ step }: { step: Step }) {
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: false,
    slides: { perView: 1 },
  });

  return (
    <div className="keen-slider max-w-full bg-zinc-900 rounded-xl p-6 min-h-[200px]">
      {step.sliders.map((slide) => (
        <div
          key={slide.id}
          className="keen-slider__slide p-4 flex items-center justify-center text-white"
        >
          {slide.type === "text" ? (
            <p className="text-lg">{slide.content}</p>
          ) : (
            <img src={slide.content} alt="Slide Image" className="rounded-md" />
          )}
        </div>
      ))}
      <div ref={sliderRef} className="keen-slider" />
    </div>
  );
}
