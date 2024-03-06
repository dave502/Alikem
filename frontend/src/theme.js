// https://chakra-ui.com/docs/styled-system/customize-theme
import { extendTheme } from '@chakra-ui/react';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}


const theme = extendTheme({
  config
  // fonts: {
  //   heading: `'Merriweather', serif`,
  //   body: `'Merriweather', serif;`,
  // },
  // colors: {
  //   transparent: "transparent",
  //   black: "#000",
  //   white: "#fff",
  //   gray: {
  //     50: "#f7fafc",
  //     // ...
  //     900: "#171923",
  //   },
  //   green: {
  //     50:  "#f7fafc",
  //     100: "#C6F6D5",
  //     200: "#9AE6B4",
  //     300: "#68D391",
  //     400: "#48BB78",
  //     500: "#38A169",
  //     600: "#2F855A",
  //     700: "#276749",
  //     800: "#22543D",
  //     900: "#1C4532",
  //   },
  // },
  // ring: {
  //   color: "#000",
  // },
});

export default theme;
