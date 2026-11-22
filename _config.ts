import { join } from "node:path";
import { cwd } from "node:process";
import lume from "@lumeland/lume";
import date from "@lumeland/plugin-date";
import codeHighlight from "@lumeland/plugin-code-highlight";
import anchor from "markdown-it-anchor";
import { load } from "cheerio";
import tailwindcss from "@lumeland/plugin-tailwindcss";
import nunjucks from "@lumeland/plugin-nunjucks";
import { writeChangeLog } from './utils/github.ts';
import { download } from './utils/misc.ts';
import robots from "@lumeland/plugin-robots";
import sitemap from "@lumeland/plugin-sitemap";
import compress from "@lumeland/plugin-compress";

const site = lume({
  location: new URL('https://clear-wallet.flashsoft.eu'),
  server: {
    port: 3535,
  },
}, {
  markdown: {
    plugins: [
      [anchor as any, {
        permalink: true,
        permalinkBefore: true,
        permalinkSymbol: '#',
        permalinkSpace: false,
      }],
    ],
  },
});

site.use(nunjucks(/* Options */));

site.use(date());
site.use(codeHighlight());
site.copy('static', '');

// site.use(sass());
site.use(tailwindcss({
  minify: true,
}));
site.add('styles/tailwind.css');
site.add('styles/code-theme.css');
site.add('styles/home.css');
site.add('styles/main.css');
site.add('js/menu.js');

// site.use(postcss());
site.use(robots({
  filename: "robots.txt",
}));
site.use(sitemap({
  filename: "sitemap.xml",
}));

site.use(compress({
  format: "brotli"
}));

site.filter('groups', items => items.reduce((grouped: any, item: any) => {
  const { group } = item;
  (grouped[group] = grouped[group] || []).push(item);
  grouped[group].sort((a: any, b: any) => a.pageOrder - b.pageOrder);
  return grouped;
}, {}));

site.filter('toc', content => {
  const $ = load(content, { decodeEntities: false });
  const toc = [] as Record<string, object | number | string>[];
  $('h1[id],h2[id],h3[id]').each((_: any, el: any) => {
    const $el = $(el);
    toc.push({
      level: Number(el.name.substring(1)),
      anchor: $el.attr('id') as string,
      text: $el.text().replace(/^#/, ''),
    });
  });
  return toc;
});

site.addEventListener("beforeBuild", async () => {
  await writeChangeLog();
});

site.addEventListener("afterBuild", async () => {
  const rootDir = cwd();
  await Promise.all([
    download('https://cdn.jsdelivr.net/npm/@docsearch/css@3', join(rootDir, '_site/css/vendor/docsearch.css')),
    download('https://cdn.jsdelivr.net/npm/@docsearch/js@3', join(rootDir, '_site/js/vendor/docsearch.js')),
    download('https://kit.fontawesome.com/c2cd8133ae.js', join(rootDir, '_site/js/vendor/FA-kit.js')),
    download('https://cdn.jsdelivr.net/npm/@lottiefiles/lottie-player@2.0.3/dist/lottie-player.min.js', join(rootDir, '_site/js/vendor/lottie-player.min.js')),
    download('https://static.alchemyapi.io/scripts/badge/alchemy-badge.js', join(rootDir, '_site/js/vendor/alchemy-badge.js')),
    download('https://static.alchemyapi.io/images/marketing/badge.png', join(rootDir, '_site/images/vendor/badge.png')),
    download('https://static.cloudflareinsights.com/beacon.min.js', join(rootDir, '_site/js/vendor/beacon.min.js')),
  ]);
});


 
// site.data('CWversion', () => {
//   return fetch('')
//     .then(r => r.json())
//     .then(r => r.name);
// });

// site.filter('await', promise => promise, true);




export default site;
