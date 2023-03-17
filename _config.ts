import lume from 'lume/mod.ts';
import date from 'lume/plugins/date.ts';
import codeHighlight from 'lume/plugins/code_highlight.ts';
import markdownItAnchor from 'https://jspm.dev/markdown-it-anchor';
import cheerio from 'https://jspm.dev/cheerio';
import windi from "lume/plugins/windi_css.ts";
import sass from "lume/plugins/sass.ts";


 
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

site.use(windi({
  config: 'windi.config.ts',
  



}));
site.use(date());
site.use(codeHighlight());
site.use(sass());
site.copy('static', '');

site.filter('groups', items => items.reduce((grouped, item) => {
    const {group} = item.data;
    (grouped[group] = grouped[group] || []).push(item);
    return grouped;
  }, {})
);

site.filter('toc', content => {
  const $ = cheerio.load(content);
  const toc = [];
  $('h1[id],h2[id],h3[id]').each((_, el) => {
    const $el = $(el);
    toc.push({
      level: Number(el.name.substring(1)),
      anchor: $el.attr('id'),
      text: $el.text().replace(/^#/, ''),
    });
  });
  return toc;
});

// site.data('CWversion', () => {
//   return fetch('')
//     .then(r => r.json())
//     .then(r => r.name);
// });

// site.filter('await', promise => promise, true);


export default site;
