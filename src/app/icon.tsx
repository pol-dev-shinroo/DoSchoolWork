import { ImageResponse } from "next/og";

// THE FIX: Tells Next.js to bake this image into a static file at build time for Cloudflare
export const dynamic = "force-static";

// Next.js config for the icon size and type
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        background: "#FFFFFF",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          background: "#355872",
          width: 28,
          height: 28,
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* H Text */}
        <div
          style={{
            color: "#F7F8F0",
            fontWeight: 900,
            fontSize: 20,
            marginTop: 2,
          }}
        >
          H
        </div>

        {/* Fold Corner Effect (Satori-safe) */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 10,
            height: 10,
            backgroundColor: "#7AAACE",
            borderTopLeftRadius: 4,
            borderBottomRightRadius: 6,
          }}
        />
      </div>
    </div>,
    { ...size },
  );
}
