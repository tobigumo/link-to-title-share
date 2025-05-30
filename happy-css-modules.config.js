module.exports = {
  include: ["src/**/*.module.css"],
  exclude: ["node_modules/**/*"],
  output: "src/types/css-modules.d.ts",
  watch: true,
  pattern: "*.module.css",
  customTemplate: ({ classes }) => {
    const classesString = classes
      .map((className) => `  readonly ${className}: string;`)
      .join("\n");

    return `declare const classes: {
${classesString}
};
export default classes;`;
  },
};
