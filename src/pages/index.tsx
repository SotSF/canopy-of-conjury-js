import { useState } from "react";
import Head from "next/head";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import Box from "@mui/material/Box";
import { ThemeProvider } from "@mui/material/styles";

import { Canopy, CanopyThree } from "@/canopy";
import Menu from "@/menu";
import theme from "@/theme";

const MENU_WIDTH = 280;

export default function Home() {
  const [canopy, setCanopy] = useState(new Canopy());
  return (
    <>
      <Head>
        <title>Canopy of Conjury</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <ThemeProvider theme={theme}>
          <Menu canopy={canopy} width={MENU_WIDTH} />
          <Box
            component="div"
            sx={{
              position: "absolute",
              left: MENU_WIDTH,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          >
            <Canvas camera={{ position: [0, 0, 11] }} orthographic={false}>
              <pointLight position={[0, 0, 11]} />
              <OrbitControls />
              <CanopyThree canopy={canopy} />
            </Canvas>
          </Box>
        </ThemeProvider>
      </main>
    </>
  );
}
