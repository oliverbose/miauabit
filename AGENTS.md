# Miauabit / Meowabit

Keep this file up to date with project decisions made in chat. Update the current design when a later decision supersedes it and record the earlier approach when it helps explain the change.

## Site and story

- Build a playful, static travelogue for Jacques, a tuxedo cat, and Xena, a brown tabby. Their launch-era ages are 14 and 8. The name is a pun on Berlin-Moabit.
- The chosen design pairs an illustrated, interactive map with postcard stories, animated travel, and real family photos. Offer an Atlantic overview, a US East Coast view, and a Berlin view. The November 2022 crossing animates a plane and the cats traveled in the passenger cabin. Mark the Moabit move as planned for early 2027 until it happens.
- Jacques’ first five years are unknown. He was adopted from the Washington D.C. Humane Society in January 2018 after being found in an apartment hallway. The family’s Takoma theory is a joke based on his meowing there. Spell the stop **Takoma** in both languages and place its pin and Bethesda’s near Petworth on the schematic map.
- Xena was rescued after a hurricane in North Carolina and adopted at five months old from a Bethesda foster family in fall 2018. The cats shared Petworth as their home base until November 2022 and settled in Friedrichshain after the flight to Berlin.
- Use **„Zwei Katzen. Economy-Class.“** on the German flight postcard. Put the photo of both cats on the patterned chair on Brooklyn’s postcard.
- Use `IMG_20200610_124813.jpg` for Takoma, `IMG_20190505_124302.jpg` for Petworth, and an animated GIF from `My Movie.mp4` for Vermont. These source files are in `~/Downloads/miauabit`. The Vermont GIF loops continuously, including in the postcard thumbnail.
- Use the curated family album photos featuring the cats without people. Favor playful moments and unusual places. The initial site used 12 photos.

## Local preview

- Build both editions with `node scripts/build.mjs` from the repository root.
- Run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist` for the local preview. Use `/preview/de/` for German and `/preview/en/` for English. Both editions share the same stop and photo catalogs.
- The intended Strato domains are `miauabit.de` for German and `meowabit.de` for English. Deployment was deferred. The [README](README.md) documents the hosting setup.

## Journey layout

- Keep the timeline beneath the map. Jacques starts in Takoma. Xena starts in North Carolina and travels through Bethesda. The two paths merge at Petworth and continue together through Brooklyn, Vermont, the Atlantic crossing, Friedrichshain, and Moabit. Brooklyn and Vermont are side trips from Petworth.
- Clicking a map pin or timeline station opens its postcard inside the map frame. On desktop, dock the card opposite the selected pin. On smaller screens, overlap the lower edge of the map so the station and the full postcard can be read together. A close button and Escape dismiss the postcard.
- Lay out the desktop timeline horizontally. On smaller screens, wind the shared route through alternating rows after Petworth. Keep the two starting paths distinguishable in both layouts.
- Animate pawprints only when moving forward along a cat’s route or the shared route. Respect the browser’s reduced-motion setting.
- Keep the postcard photos connected to the family album viewer. Keep stop links shareable and carry the selected stop across the German and English editions.

## Project history

- The initial bilingual site was committed as `8422a83`. The map and postcard refinements were committed as `19ca200` and submitted in [PR #1](https://github.com/oliverbose/miauabit/pull/1).
- The first redesign displayed all postcards beneath the map with two vertical paths joining at Petworth. It was committed as `a85679d` (`Layout updates`) on `layout-updates`. Git branch names cannot contain spaces.
- The next revision moved the postcards onto the map and turned the timeline into compact station links. The Petworth merge remains part of the route.
