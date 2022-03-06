const MANIFEST_URL = "manifest.json";
const localHost = ["127.0.0.1", "localhost"];

async function main() {
  const isLocal = !!~localHost.indexOf(window.location.hostname);
  const manifestJSON = await (await fetch(MANIFEST_URL)).json();

  console.log("isLocal? ", isLocal);
  const host = isLocal ? manifestJSON.localHost : manifestJSON.productionHost;
  const videoCompont = new VideoComponent();
  const network = new Network({ host });
  const videoPlayer = new VideoPlayer({ manifestJSON, network });
  videoPlayer.initializeCodec();
  videoCompont.initializePlayer();
}

window.onload = main;
