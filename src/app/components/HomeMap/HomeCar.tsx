"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from "react";
import { motion, useMotionValue, useTransform, animate, type MotionValue } from "framer-motion";
import { DndContext, useDraggable, type DragEndEvent } from "@dnd-kit/core";
import { HOME, ROUTES, type DestinationHref, type Point } from "./roadRoutes";

export type HomeCarHandle = {
  /** Animate the car to the building for this href, then navigate there. */
  driveTo: (href: string) => void;
};

const LEG_SECONDS = 0.35; // per road-path waypoint
const ARRIVE_SCALE = 0.3;
const DROP_RADIUS = 6; // percent — how close a drag-drop must land to a destination to count

function isDestinationHref(href: string): href is DestinationHref {
  return href in ROUTES;
}

function orientationFor(from: { x: number; y: number }, to: { x: number; y: number }) {
  return Math.abs(to.x - from.x) >= Math.abs(to.y - from.y) ? "horizontal" : "vertical";
}

const HomeCar = forwardRef<HomeCarHandle>(function HomeCar(_props, ref) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const drivingRef = useRef(false);

  const left = useMotionValue(HOME.x);
  const top = useMotionValue(HOME.y);
  const scale = useMotionValue(1);
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal");

  const driveLeg = useCallback(
    (to: Point) =>
      Promise.all([
        animate(left, to.x, { duration: LEG_SECONDS, ease: "easeInOut" }),
        animate(top, to.y, { duration: LEG_SECONDS, ease: "easeInOut" }),
      ]),
    [left, top],
  );

  /** Click-to-drive: walk the real road waypoints from HOME to the building. */
  const driveTo = useCallback(
    async (href: string) => {
      if (drivingRef.current) return;
      if (!isDestinationHref(href)) {
        router.push(href);
        return;
      }
      drivingRef.current = true;
      const route = ROUTES[href];
      for (let i = 1; i < route.length; i++) {
        setOrientation(orientationFor(route[i - 1], route[i]));
        await driveLeg(route[i]);
      }
      await animate(scale, ARRIVE_SCALE, { duration: 0.25, ease: "easeIn" });
      router.push(href);
    },
    [driveLeg, router, scale],
  );

  useImperativeHandle(ref, () => ({ driveTo }), [driveTo]);

  const driveHome = useCallback(async () => {
    drivingRef.current = true;
    setOrientation(orientationFor({ x: left.get(), y: top.get() }, HOME));
    await driveLeg(HOME);
    drivingRef.current = false;
  }, [driveLeg, left, top]);

  /** Drag-to-drive: the dropped car isn't on the road, so it drives straight to the building. */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect || drivingRef.current) return;

      const dropped: Point = {
        x: left.get() + (event.delta.x / rect.width) * 100,
        y: top.get() + (event.delta.y / rect.height) * 100,
      };
      left.set(dropped.x);
      top.set(dropped.y);

      const target = (Object.entries(ROUTES) as [DestinationHref, Point[]][]).find(([, route]) => {
        const anchor = route[route.length - 1];
        return Math.abs(anchor.x - dropped.x) < DROP_RADIUS && Math.abs(anchor.y - dropped.y) < DROP_RADIUS;
      });

      if (!target) {
        void driveHome();
        return;
      }
      const [href, route] = target;
      drivingRef.current = true;
      const anchor = route[route.length - 1];
      setOrientation(orientationFor(dropped, anchor));
      void (async () => {
        await driveLeg(anchor);
        await animate(scale, ARRIVE_SCALE, { duration: 0.25, ease: "easeIn" });
        router.push(href);
      })();
    },
    [driveHome, driveLeg, left, router, scale, top],
  );

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-none">
      <DndContext onDragEnd={handleDragEnd}>
        <CarSprite left={left} top={top} scale={scale} orientation={orientation} />
      </DndContext>
    </div>
  );
});

export default HomeCar;

function CarSprite({
  left,
  top,
  scale,
  orientation,
}: {
  left: MotionValue<number>;
  top: MotionValue<number>;
  scale: MotionValue<number>;
  orientation: "horizontal" | "vertical";
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: "home-map-car" });
  const leftPct = useTransform(left, (v) => `${v}%`);
  const topPct = useTransform(top, (v) => `${v}%`);

  return (
    <motion.div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="absolute cursor-grab active:cursor-grabbing touch-none pointer-events-auto"
      style={{
        left: leftPct,
        top: topPct,
        width: "5%",
        height: "5%",
        translateX: "-50%",
        translateY: "-50%",
        x: transform?.x ?? 0,
        y: transform?.y ?? 0,
        scale,
      }}
    >
      <Image
        src={orientation === "horizontal" ? "/home/car/piano-horizontal.svg" : "/home/car/piano-vertical.svg"}
        alt="Car"
        fill
        draggable={false}
        className="object-contain pointer-events-none select-none"
      />
    </motion.div>
  );
}
