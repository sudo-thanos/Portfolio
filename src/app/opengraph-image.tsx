import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} — ${siteConfig.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generated at request time so the social card never drifts from site copy. */
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    background: "#0F0D2A",
                    padding: "80px",
                    fontFamily: "sans-serif",
                }}
            >
                <div
                    style={{
                        color: "#E8B84B",
                        fontSize: 28,
                        letterSpacing: 8,
                        textTransform: "uppercase",
                    }}
                >
                    {siteConfig.jobTitle}
                </div>
                <div
                    style={{
                        color: "white",
                        fontSize: 86,
                        fontWeight: 700,
                        marginTop: 24,
                        lineHeight: 1.1,
                    }}
                >
                    {siteConfig.name}
                </div>
                <div
                    style={{
                        width: 160,
                        height: 6,
                        background: "#E8B84B",
                        marginTop: 32,
                    }}
                />
                <div
                    style={{
                        color: "rgba(255,255,255,0.6)",
                        fontSize: 32,
                        marginTop: 32,
                        maxWidth: 900,
                        lineHeight: 1.4,
                    }}
                >
                    {siteConfig.shortDescription}
                </div>
                <div
                    style={{
                        color: "rgba(255,255,255,0.35)",
                        fontSize: 24,
                        marginTop: "auto",
                    }}
                >
                    {siteConfig.url.replace(/^https?:\/\//, "")}
                </div>
            </div>
        ),
        size,
    );
}
