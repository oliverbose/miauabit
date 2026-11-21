# Miauabit / Meowabit

A static, bilingual travelogue for Jacques and Xena. The illustrated map and photo gallery run in the browser. Both editions are generated from the same story and photo catalog.

## Build and preview

Run `node scripts/build.mjs` from the repository root. Any current Node.js LTS release can build the site without installing dependencies.

To preview both editions and test switching between them, run `python3 -m http.server 4173 --bind 127.0.0.1 --directory dist` and open [German](http://127.0.0.1:4173/preview/de/) or [English](http://127.0.0.1:4173/preview/en/). The preview editions link to each other locally.

## Deploy to Strato

The footer links to a brief Impressum and hosting privacy information in each language. The notices reflect the site's exclusively personal and family use. Review the privacy information if the audience or hosting setup changes. The GDPR household exception depends on who can access the site. [Guidance from the Lower Saxony data protection authority](https://www.lfd.niedersachsen.de/faq/website_betreiber/faq-webseiten-datenschutzkonform-betreiben-166238.html)

The GitHub **Website** workflow builds both editions for pull requests and pushes to `main`. The deploy job uploads both production builds over SFTP when you run the workflow manually from `main`.

Under **Domains verwalten → Umleitung einrichten** in STRATO, assign each domain to its corresponding folder using an internal destination.

| Domain | Language | Local build output | Internal destination |
| --- | --- | --- | --- |
| `miauabit.de` | German | `dist/miauabit/` | `/miauabit/` |
| `meowabit.de` | English | `dist/meowabit/` | `/meowabit/` |

### Configure the first deployment

1. Create a dedicated SFTP account under **Datenbanken und Webspace → SFTP & SSH**. Its start directory must be the parent of `miauabit` and `meowabit`, as listed above. Copy the personalized server hostname and generated username. [STRATO’s SFTP setup](https://www.strato.de/faq/hosting/so-nutzen-sie-ihren-ssh-sftp-zugang/)
2. In the GitHub repository, create the `production` environment under **Settings → Environments**. Limit deployments to `main` and add the following values in that environment. [GitHub deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)

   | Type | Name | Value |
   | --- | --- | --- |
   | Variable | `STRATO_SFTP_HOST` | The personalized STRATO SFTP hostname from the hosting dashboard |
   | Variable | `STRATO_SFTP_USER` | The dedicated SFTP username |
   | Variable | `STRATO_SFTP_KNOWN_HOSTS` | The verified OpenSSH `known_hosts` entry for that hostname |
   | Secret | `STRATO_SFTP_PASSWORD` | The dedicated SFTP account password |

   Verify the SSH host-key fingerprint using a trusted source, such as STRATO support or an existing trusted connection, before recording its `known_hosts` entry. The workflow requires that key when connecting over port 22.
3. Once the workflow is on `main`, open **Actions → Website → Run workflow**, select `main`, and run it. The upload copies assets before HTML and reads the uploaded pages back to verify them. It then checks that both HTTPS domains serve the new homepages. For a site with password-protected pages, set the `production` environment variable `STRATO_VERIFY_HTTPS` to `false` to use SFTP verification alone.

After setting up both domains, switch languages from a selected stop to check that the chapter ID survives the change. [STRATO’s guide to using several domains with one webspace](https://www.strato.de/faq/hosting/wie-kann-ich-mehrere-domains-in-meinem-paket-nutzen/)

### Enable automatic deployment later

Set `STRATO_AUTO_DEPLOY` to `true` under **Settings → Secrets and variables → Actions → Variables** at the repository level. Successful builds of pushes to `main`, including merged pull requests, will then deploy to STRATO. Delete the variable or set it to `false` to return to manual deployment. The **Run workflow** option is available in either mode.

## Update the journey

Edit the German and English stories in [scripts/content.mjs](scripts/content.mjs). The opening stamp and the Moabit postcard both carry the planned move date. Update both when the move happens and deploy both editions using the **Website** workflow.

The photo catalog is [scripts/photos.mjs](scripts/photos.mjs). Media in `public/assets/photos/` comes from the selected Miauabit album. Stills are resized WebP files, and the Vermont clip is an animated GIF. The exports omit source metadata. The gallery groups media by stop on the map. Postcard assignments are listed separately in the catalog.
