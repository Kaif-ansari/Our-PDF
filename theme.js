(() => {
  const saved = localStorage.getItem("cloudpdf.theme");
  const theme = saved === "dark" || saved === "light"
    ? saved
    : matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#10131a" : "#fffaf2");
})();
