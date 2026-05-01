import { courseNotFound } from "@/assets/images";
import { isValidUrl } from "@/lib/utils";
import Image from "next/image";

export default function CustomImage({ src, alt, width, height, ...props }) {
    return <Image src={isValidUrl(src) ? src : courseNotFound} alt={alt} width={width} height={height} {...props}
    />;
}

