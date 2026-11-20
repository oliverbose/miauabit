# Miauabit / Meowabit

A static, bilingual travelogue for Jacques and Xena. The illustrated map and photo gallery run in the browser. Both editions are generated from the same story and photo catalog.

## Build and preview

Run `node scripts/build.mjs` from the repository root. Any current Node.js LTS release can build the site without installing dependencies.

To preview both editions and test switching between them, run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist` and open [German](http://127.0.0.1:4173/preview/de/) or [English](http://127.0.0.1:4173/preview/en/). The preview editions link to each other locally.

## Deploy to Strato

The footer links to a brief Impressum and hosting privacy information in each language. The notices reflect the site's exclusively personal and family use. Review the privacy information if the audience or hosting setup changes. The GDPR household exception depends on who can access the site. [Guidance from the Lower Saxony data protection authority](https://www.lfd.niedersachsen.de/faq/website_betreiber/faq-webseiten-datenschutzkonform-betreiben-166238.html)

The production folders include `index.html` and all of the assets that edition uses. Upload those folders to Strato webspace over SFTP. Under **Domains verwalten → Umleitung einrichten**, assign each domain to its corresponding folder using an internal destination.

| Domain | Language | Local build output | Internal destination |
| --- | --- | --- | --- |
| `miauabit.de` | German | `dist/miauabit/` | `/miauabit/` |
| `meowabit.de` | English | `dist/meowabit/` | `/meowabit/` |

After setting up both domains, open each HTTPS homepage and switch languages from a selected stop. The chapter ID in the URL should survive the change. [Strato guide to using several domains with one webspace](https://www.strato.de/faq/hosting/wie-kann-ich-mehrere-domains-in-meinem-paket-nutzen/)

## Update the journey

Edit the German and English stories in [scripts/content.mjs](scripts/content.mjs). The opening stamp and the Moabit postcard both carry the planned move date. Update both when the move happens, rebuild, and upload both editions.

The photo catalog is [scripts/photos.mjs](scripts/photos.mjs). Media in `public/assets/photos/` comes from the selected Miauabit album. Stills are resized WebP files, and the Vermont clip is an animated GIF. The exports omit source metadata. The gallery groups media by stop on the map. Postcard assignments are listed separately in the catalog.
