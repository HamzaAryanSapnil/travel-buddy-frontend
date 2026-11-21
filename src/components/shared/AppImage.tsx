import NextImage, { type ImageProps as NextImageProps } from "next/image";

type SharedProps = Pick<
  NextImageProps,
  "src" | "alt" | "className" | "priority" | "fetchPriority" | "loading" | "onError"
>;

type FillAppImageProps = SharedProps & {
  fill: true;
  sizes: string;
  width?: never;
  height?: never;
};

type DimensionAppImageProps = SharedProps & {
  fill?: false;
  width: number;
  height: number;
  sizes?: string;
};

export type AppImageProps = FillAppImageProps | DimensionAppImageProps;

function isImgBB(src: AppImageProps["src"]) {
  if (typeof src !== "string") return false;
  try {
    return new URL(src).hostname === "i.ibb.co";
  } catch {
    return src.includes("i.ibb.co");
  }
}

export default function AppImage({
  priority,
  src,
  ...rest
}: AppImageProps) {
  return (
    <NextImage
      {...rest}
      src={src}
      unoptimized={isImgBB(src)}
      {...(priority !== undefined ? { priority } : {})}
    />
  );
}