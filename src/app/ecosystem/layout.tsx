import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jaime C. J. | Enterprise Architecture Showcase",
  description: "A demonstration of High-Scale DevOps, Event-Driven Architecture, and Zero-Trust Security.",
};

export default function EcosystemLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}