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

export default function AppImage({
  priority,
  ...rest
}: AppImageProps) {
  return (
    <NextImage
      {...rest}
      {...(priority !== undefined ? { priority } : {})}
    />
  );
}