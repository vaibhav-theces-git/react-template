module.exports = {
  prefix: "tw-",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  // add !important, so it applies to all elements
  // (including outside-of-root elements for e.g. menus)
  important: "#body",
  theme: {
    fontFamily: {
      fraktion: ["Fraktion Sans"],
    },
    extend: {
      fontSize: {
        sm: "0.8rem",
        xxs: [".625rem", ".9375rem"],
        "danger-13p": "0.813rem",
      },
      colors: {
        primary: "#040A17", // same as app background
        popover: "#121826", // bg of menu popovers
        secondary: "#111827", // bg of streaming market cards
        tertiary: "#1C2436",
        neutral: "#178FE6",
        divider: "#3C4257",
        activeProgress: "#64D9AC",
        success: "#17A35D",
        warning: "#E2B938",
        error: "#F05C52",
        info: "#e2b93b",
        paper: "#282a3d",
        tableHeader: "#171F2F",
        sell: "#DF6659",
        buy: "#4CA164",
        sellBtn: "#b81a1a",
        buyBtn: "#008027",
        input: "#1E2435",
        "input-label": "#2b3245",
        paleGold: "#FFD966",
        search: "#1F2739",
        violet: { 100: "#BFD0FF", 200: "#8CAAFF", 300: "#5077E5" },
        rose: { 100: "#F0BDBD", 200: "#FFC9C9" },
        green: { 100: "#9FE3C1", 200: "#9FE5C2" },
        blue: {
          100: "#90CAF9",
          200: "#1169A8",
          500: "#00355B",
        },
        slate: {
          25: "#141a2a",
          50: "#1E2435", // input field bg
          75: "#252A37",
          100: "#3C4257", // e.g. on app nav dividers
          200: "rgb(118 125 149)",
          300: "#A5ACB8", // on menu tabs e.g. on streaming cards
          400: "#1F2637",
          500: "#202739",
        },
        gray: {
          100: "#FAFDFF",
          200: "#E3E8EE",
          300: "#D9DCE1",
          400: "#C2C7CF",
          500: "#A3ACB9",
          600: "#697386",
          700: "#4F566B",
          800: "#3C4357",
          900: "#2A2E38",
        },
        gold: {
          100: "#C9B175",
        },
        card: {
          card1: "#DA5446",
          card2: "#A4A39C",
          card3: "#104D78",
          card4: "#517D7D",
        },
      },
      screens: {
        xs: "320px",
        "3xl": "1920px",
      },
      transitionProperty: {
        width: "width",
      },
    },
  },
  // plugins: [require("tailwind-scrollbar-hide")],
};
