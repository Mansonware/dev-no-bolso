import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Esconde o indicador "N" do modo dev (atrapalha em live/gravação).
  devIndicators: false,
};

export default nextConfig;
