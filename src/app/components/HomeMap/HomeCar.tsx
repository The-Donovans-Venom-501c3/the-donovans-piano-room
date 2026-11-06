"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import { motion, useMotionValue, useTransform, animate, type MotionValue } from "framer-motion";
import { DndContext, useDraggable, type DragEndEvent } from "@dnd-kit/core";
import { HOME, ROUTES, type DestinationHref, type Point } from "./roadRoutes";

export type HomeCarHandle = {
  /** Animate the car to the building for this href, then navigate there. */
  driveTo: (href: string) => void;
};

const LEG_SECONDS = 0.35; // time budget per road-path waypoint, used to size total duration
const CURVE_STEPS = 5; // sub-points used to trace the curved roundabout exit
const CURVE_SECONDS = 0.6; // time budget for the whole roundabout-exit curve
const DROP_RADIUS = 6; // percent — how close a drag-drop must land to a destination to count

// 0 = car's natural drawn orientation (upright/"vertical"), 90 = rotated to lie "horizontal".
const ROTATION_DEG = { horizontal: 90, vertical: 0 } as const;

function isDestinationHref(href: string): href is DestinationHref {
  return href in ROUTES;
}

function orientationFor(from: Point, to: Point): "horizontal" | "vertical" {
  return Math.abs(to.x - from.x) >= Math.abs(to.y - from.y) ? "horizontal" : "vertical";
}

function quadraticBezier(p0: Point, control: Point, p2: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * p0.x + 2 * mt * t * control.x + t * t * p2.x,
    y: mt * mt * p0.y + 2 * mt * t * control.y + t * t * p2.y,
  };
}

/** Curved path from the roundabout center out to an entry point, bulging to one side
 * instead of cutting a straight radial line, so leaving the roundabout reads as a turn. */
function roundaboutExitCurve(entry: Point): Point[] {
  const dx = entry.x - HOME.x;
  const dy = entry.y - HOME.y;
  const dist = Math.hypot(dx, dy) || 1;
  const perp = { x: -dy / dist, y: dx / dist };
  const bulge = dist * 0.35;
  const control: Point = {
    x: (HOME.x + entry.x) / 2 + perp.x * bulge,
    y: (HOME.y + entry.y) / 2 + perp.y * bulge,
  };
  const points: Point[] = [];
  for (let i = 1; i <= CURVE_STEPS; i++) {
    points.push(quadraticBezier(HOME, control, entry, i / CURVE_STEPS));
  }
  return points;
}

const HomeCar = forwardRef<HomeCarHandle>(function HomeCar(_props, ref) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const drivingRef = useRef(false);

  const left = useMotionValue(HOME.x);
  const top = useMotionValue(HOME.y);
  const rotate = useMotionValue<number>(ROTATION_DEG.vertical);

  /** Single hop: current position to one point. */
  const driveLeg = useCallback(
    (to: Point, deg: number, duration: number) =>
      Promise.all([
        animate(left, to.x, { duration, ease: "easeInOut" }),
        animate(top, to.y, { duration, ease: "easeInOut" }),
        animate(rotate, deg, { duration, ease: "easeInOut" }),
      ]),
    [left, rotate, top],
  );

  /** Drives through every point as one continuous animation instead of chaining
   * separate ones — chaining caused a stutter at each waypoint since every short
   * animation decelerated to zero before the next one re-accelerated from rest. */
  const driveAlong = useCallback(
    (points: Point[], degs: number[], duration: number) => {
      const dist = [0];
      for (let i = 1; i < points.length; i++) {
        dist.push(dist[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
      }
      const total = dist[dist.length - 1] || 1;
      const times = dist.map((d) => d / total);
      return Promise.all([
        animate(left, points.map((p) => p.x), { duration, times, ease: "linear" }),
        animate(top, points.map((p) => p.y), { duration, times, ease: "linear" }),
        animate(rotate, degs, { duration, times, ease: "linear" }),
      ]);
    },
    [left, rotate, top],
  );

  /** Click-to-drive: one continuous animation — curve out of the roundabout, rotating
   * to the first road's direction, then walk the remaining road waypoints. */
  const driveTo = useCallback(
    async (href: string) => {
      if (drivingRef.current) return;
      if (!isDestinationHref(href)) {
        router.push(href);
        return;
      }
      drivingRef.current = true;
      const route = ROUTES[href];
      const startDeg = rotate.get();
      const exitDeg = ROTATION_DEG[orientationFor(HOME, route[1])];
      const curve = roundaboutExitCurve(route[1]);

      const points: Point[] = [HOME, ...curve, ...route.slice(2)];
      const degs: number[] = [startDeg, ...curve.map((_, i) => startDeg + (exitDeg - startDeg) * ((i + 1) / curve.length))];
      for (let i = 2; i < route.length; i++) {
        degs.push(ROTATION_DEG[orientationFor(route[i - 1], route[i])]);
      }

      const duration = CURVE_SECONDS + (route.length - 2) * LEG_SECONDS;
      await driveAlong(points, degs, duration);
      router.push(href);
    },
    [driveAlong, rotate, router],
  );

  useImperativeHandle(ref, () => ({ driveTo }), [driveTo]);

  const driveHome = useCallback(async () => {
    drivingRef.current = true;
    const deg = ROTATION_DEG[orientationFor({ x: left.get(), y: top.get() }, HOME)];
    await driveLeg(HOME, deg, LEG_SECONDS);
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
      const deg = ROTATION_DEG[orientationFor(dropped, anchor)];
      void (async () => {
        await driveLeg(anchor, deg, LEG_SECONDS);
        router.push(href);
      })();
    },
    [driveHome, driveLeg, left, router, top],
  );

  return (
    <div ref={containerRef} className="absolute inset-0 z-20 pointer-events-none">
      <DndContext onDragEnd={handleDragEnd}>
        <CarSprite left={left} top={top} rotate={rotate} />
      </DndContext>
    </div>
  );
});

export default HomeCar;

// Native car-motion.svg is 70x120 (portrait character art, not a top-down rectangle).
const CAR_HEIGHT_PERCENT = 12;
const CAR_WIDTH_PERCENT = CAR_HEIGHT_PERCENT * (70 / 120);

function CarSprite({
  left,
  top,
  rotate,
}: {
  left: MotionValue<number>;
  top: MotionValue<number>;
  rotate: MotionValue<number>;
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
        width: `${CAR_WIDTH_PERCENT}%`,
        height: `${CAR_HEIGHT_PERCENT}%`,
        translateX: "-50%",
        translateY: "-50%",
        x: transform?.x ?? 0,
        y: transform?.y ?? 0,
        rotate,
      }}
    >
      <Image
        src="/home/car/car-motion.svg"
        alt="Car"
        fill
        draggable={false}
        className="object-contain pointer-events-none select-none"
      />
    </motion.div>
  );
}
