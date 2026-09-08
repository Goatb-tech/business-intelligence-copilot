import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import gsap from "gsap";

export interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: "linear" | "elastic";
  children: ReactNode;
}

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div
    ref={ref}
    {...rest}
    className={`absolute left-1/2 top-1/2 overflow-hidden rounded-[2rem] border border-white/12 bg-[#120709]/90 shadow-[0_25px_60px_rgba(0,0,0,0.45)] [backface-visibility:hidden] [transform-style:preserve-3d] [will-change:transform] ${customClass ?? ""} ${rest.className ?? ""}`.trim()}
  />
));

Card.displayName = "Card";

type CardRef = RefObject<HTMLDivElement | null>;

type Slot = {
  x: number;
  y: number;
  z: number;
  zIndex: number;
};

function makeSlot(index: number, distX: number, distY: number, total: number): Slot {
  return {
    x: index * distX,
    y: -index * distY,
    z: -index * distX * 1.35,
    zIndex: total - index,
  };
}

function placeNow(element: HTMLElement, slot: Slot, skew: number) {
  gsap.set(element, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: "center center",
    zIndex: slot.zIndex,
    force3D: true,
  });
}

export function CardSwap({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = "elastic",
  children,
}: CardSwapProps) {
  const config =
    easing === "elastic"
      ? {
          ease: "elastic.out(0.6,0.9)",
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05,
        }
      : {
          ease: "power1.inOut",
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2,
        };

  const childArray = useMemo(() => Children.toArray(children) as ReactElement<CardProps>[], [children]);
  const refs = useMemo<CardRef[]>(() => childArray.map(() => React.createRef<HTMLDivElement>()), [childArray.length]);
  const order = useRef<number[]>(Array.from({ length: childArray.length }, (_, index) => index));
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const total = refs.length;

    refs.forEach((ref, index) => {
      if (ref.current) {
        placeNow(ref.current, makeSlot(index, cardDistance, verticalDistance, total), skewAmount);
      }
    });

    function swap() {
      if (order.current.length < 2) {
        return;
      }

      const [front, ...rest] = order.current;
      const frontElement = refs[front].current;
      if (!frontElement) {
        return;
      }

      const timeline = gsap.timeline();
      timelineRef.current = timeline;

      timeline.to(frontElement, {
        y: "+=500",
        duration: config.durDrop,
        ease: config.ease,
      });

      timeline.addLabel("promote", `-=${config.durDrop * config.promoteOverlap}`);

      rest.forEach((idx, index) => {
        const element = refs[idx].current;
        if (!element) {
          return;
        }

        const slot = makeSlot(index, cardDistance, verticalDistance, refs.length);
        timeline.set(element, { zIndex: slot.zIndex }, "promote");
        timeline.to(
          element,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease,
          },
          `promote+=${index * 0.15}`,
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      timeline.addLabel("return", `promote+=${config.durMove * config.returnDelay}`);
      timeline.call(() => {
        gsap.set(frontElement, { zIndex: backSlot.zIndex });
      }, undefined, "return");

      timeline.to(
        frontElement,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease,
        },
        "return",
      );

      timeline.call(() => {
        order.current = [...rest, front];
      });
    }

    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover && containerRef.current) {
      const node = containerRef.current;

      const pause = () => {
        timelineRef.current?.pause();
        clearInterval(intervalRef.current);
      };

      const resume = () => {
        timelineRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };

      node.addEventListener("mouseenter", pause);
      node.addEventListener("mouseleave", resume);

      return () => {
        node.removeEventListener("mouseenter", pause);
        node.removeEventListener("mouseleave", resume);
        clearInterval(intervalRef.current);
      };
    }

    return () => {
      clearInterval(intervalRef.current);
    };
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing, refs]);

  const renderedChildren = childArray.map((child, index) =>
    isValidElement<CardProps>(child)
      ? cloneElement(child, {
          key: index,
          ref: refs[index],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (event: React.MouseEvent<HTMLDivElement>) => {
            child.props.onClick?.(event);
            onCardClick?.(index);
          },
        } as CardProps & React.RefAttributes<HTMLDivElement>)
      : child,
  );

  return (
    <div ref={containerRef} className="relative transform-gpu perspective-[1400px]" style={{ width, height }}>
      <div className="absolute inset-0 [transform-style:preserve-3d]">{renderedChildren}</div>
    </div>
  );
}

export default CardSwap;
