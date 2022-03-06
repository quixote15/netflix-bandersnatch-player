class VideoPlayer {
  constructor({ manifestJSON, network }) {
    this.network = network;
    this.manifestJSON = manifestJSON;
    this.videoElement = null;
    this.sourceBuffer = null;
    this.videoDuration = 0;
  }

  initializeCodec() {
    this.videoElement = document.getElementById("vid");
    const mediaSourceSupported = !!window.MediaSource;

    if (!mediaSourceSupported) {
      alert("Seu browser ou sistema não tem suporte a MSE!");
      return;
    }

    const currentCodec = this.manifestJSON.codec;
    console.log(this.manifestJSON);
    const codecSupported = MediaSource.isTypeSupported(currentCodec);

    if (!codecSupported) {
      alert(`codec ${currentCodec} não é suportado pelo browser`);
      return;
    }

    const mediaSource = new MediaSource();

    console.log("chegou aqui");
    mediaSource.addEventListener(
      "sourceopen",
      this.sourceOpenWrapper(mediaSource)
    );
    this.videoElement.src = URL.createObjectURL(mediaSource);
  }

  sourceOpenWrapper(mediaSource) {
    // curry function
    return async (_) => {
      console.log("carregour");
      this.sourceBuffer = mediaSource.addSourceBuffer(this.manifestJSON.codec);
      const selected = (this.selected = this.manifestJSON.intro);

      // evita rodar como "LIVE"
      mediaSource.duration = this.videoDuration;
      await this.fileDownload(selected.url);
    };
  }

  fileDownload(url) {
    const prepareUrl = {
      url,
      fileResolution: 360,
      fileResolutionTag: this.manifestJSON.fileResolutionTag,
      hostTag: this.manifestJSON.hostTag,
    };

    const finalUrl = this.network.parseManifestURL(prepareUrl);
    console.log("finalUrl", finalUrl);
    this.setVideoPlayerDuration(finalUrl);
  }

  setVideoPlayerDuration(finalUrl) {
    //finalUrl http://127.0.0.1:8081/timeline/01.intro/01.intro-12.733333-360.mp4

    const bars = finalUrl.split("/");
    const [name, videoDuration] = bars[bars.length - 1].split("-");
    this.videoDuration += Number(videoDuration);
    console.log("video duration:", this.videoDuration);
  }
}
