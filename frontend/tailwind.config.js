/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#615EF0",
        secondary: "#50E3C2",
        danger: "#F76C6C",
        success: "#2ECC71",
        warning: "#F5AC33",
        line: "#EBEBEB",
        chat: "#F1F1F1",
        text: {
          1: "#333333",
          2: "#4F4F4F",
          3: "#828282",
        },
      },
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: true,
    darkTheme: false,
    base: true,
    utils: true,
    styled: true,
    themeRoot: ":root",
    logs: true,
    prefix: "",
  },
};
