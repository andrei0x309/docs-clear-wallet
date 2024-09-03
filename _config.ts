import lume from 'lume/mod.ts';
import date from 'lume/plugins/date.ts';
import codeHighlight from 'lume/plugins/code_highlight.ts';
import markdownItAnchor from 'npm:markdown-it-anchor';
import { load } from 'npm:cheerio';
import sass from "lume/plugins/sass.ts";
import postcss from "lume/plugins/postcss.ts";
import tailwindcss from "lume/plugins/tailwindcss.ts";
import nunjucks from "lume/plugins/nunjucks.ts";
import { tWindConfig } from "./tailwind.ts";
import { writeChangeLog } from './utils/github.ts';
import { download } from './utils/misc.ts';


const site = lume({
  location: new URL('http://localhost:3535'),
  server: {
    port: 3535,
  }
}, {
  markdown: {
    plugins: [
      [markdownItAnchor, {
        permalink: true,
        permalinkBefore: true,
        permalinkSymbol: '#',
        permalinkSpace: false,
      }],
    ],
  },
},
);

site.use(nunjucks(/* Options */));

site.use(date());
site.use(codeHighlight());
site.copy('static', '');

site.use(sass());
site.use(tailwindcss({
  extensions: ['.html'],
  options: tWindConfig as any,
}));
site.use(postcss());


site.filter('groups', items => items.reduce((grouped: any, item: any) => {
    const {group} = item;
    (grouped[group] = grouped[group] || []).push(item)
    grouped[group].sort((a: any, b: any) => a.pageOrder - b.pageOrder);
    return grouped;
  }, {})
);

site.filter('toc', content => {
  const $ =  load(content, { decodeEntities: false });
  const toc = [] as Record<string, object | number | string>[];
  $('h1[id],h2[id],h3[id]').each((_:any, el: any) => {
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
})

site.addEventListener("afterBuild", async () => {
  await Promise.all([
    download('https://cdn.jsdelivr.net/npm/@docsearch/css@3', Deno.cwd() + '/_site/css/vendor/docsearch.css'),
    download('https://cdn.jsdelivr.net/npm/@docsearch/js@3', Deno.cwd() + '/_site/js/vendor/docsearch.js'),
    download('https://kit.fontawesome.com/c2cd8133ae.js', Deno.cwd() + '/_site/js/vendor/FA-kit.js'),
    download('https://cdn.jsdelivr.net/npm/@lottiefiles/lottie-player@2.0.3/dist/lottie-player.min.js', Deno.cwd() + '/_site/js/vendor/lottie-player.min.js'),
    download('https://static.alchemyapi.io/scripts/badge/alchemy-badge.js', Deno.cwd() + '/_site/js/vendor/alchemy-badge.js'),
    download('https://static.alchemyapi.io/images/marketing/badge.png', Deno.cwd() + '/_site/images/vendor/badge.png'),
    download('https://static.cloudflareinsights.com/beacon.min.js', Deno.cwd() + '/_site/js/vendor/beacon.min.js'),
  ]);
});

 
// site.data('CWversion', () => {
//   return fetch('')
//     .then(r => r.json())
//     .then(r => r.name);
// });

// site.filter('await', promise => promise, true);




export default site;
