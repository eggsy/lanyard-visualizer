# ⚡ Lanyard Visualizer

<p align="center">
  <img src="./images/landing.png" alt="landing page" title="Landing page of the example" />
</p>

> ⚠️ **BREAKING CHANGE**: From now on, this project won't be supporting settings to use as iframe. I updated the UI and removed many things that I believe weren't needed. If you are looking for something to put on your website, try [lanyard-profile-readme](https://github.com/cnrad/lanyard-profile-readme) by cnrad.

An interactive example of how you could use [Lanyard API](https://github.com/Phineas/lanyard) to create amazing real-time Discord status related things! Take a look at the code and see how it works!

### 🔥 Features

- Spotify integration
  - It will display what you're listening, it'll show a progress bar just like the one on your Discord profile!
- Every RPCs work!
  - If there's something visible on your status (only RPCs), it's visible here too!
- Everything is real-time!
  - We use Lanyard's WebSocket so everything is updated in real-time!

### ❓ How to use?

Just visit [this page](https://visualizer.eggsy.xyz) and use the input to check on whoever you want! _Keep in mind that the user has to be in Lanyard's Discord server so that they could be monitored by the service._

### 🌟 Host it yourself

I don't collect any kind of data, there's no third-party plugins (except the Google Fonts), no cookies, nothing! If you still don't want to use the service, you can download from the source and host it yourself.

- Clone this repo: `git clone https://github.com/eggsy/lanyard-visualizer`
  - Change directory to the new folder: `cd lanyard-visualizer`
- Instal dependencies
  - With `npm`: `npm install`
  - With `pnpm`: `pnpm`
- Start in development, or build the app
  - With `npm`: `npm run dev` or `npm run build` (and then `npm run serve`)
  - With `pnpm`: `pnpm dev` or `pnpm build` (and then `pnpm serve`)

Starting in development mode will provide hot reloading, PRs and issues are always welcome! Feel free to contribute to my project.

### Sponsors

<p align="center">
  <a href="https://github.com/sponsors/eggsy">
    <img src='https://cdn.jsdelivr.net/gh/eggsy/.github/sponsors.svg'/>
  </a>
</p>
