const plugins = [
    '@babel/plugin-transform-runtime',
    /*"@babel/plugin-transform-modules-amd"*/
];

const presets = ['@babel/preset-env'];


/*if (process.env["ENV"] === "prod") {
    plugins.push(...);
}*/

module.exports = {presets, plugins};