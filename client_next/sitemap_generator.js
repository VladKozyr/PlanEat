const sitemap = require("nextjs-sitemap-generator");
const fs = require("fs");

const BUILD_ID = fs.readFileSync(".next/BUILD_ID").toString();

sitemap({
    baseUrl: "https://planeat.co.ua",
    pagesDirectory: __dirname + "/.next/server/pages",
    targetDirectory: "public/",
    ignoredExtensions: ["js", "map"],
    ignoredPaths: ["[fallback]"],
});