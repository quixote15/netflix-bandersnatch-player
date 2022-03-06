class VideoPlayer {
  constructor({ manifestJSON, network }) {
    this.network = network;
    this.manifestJSON = manifestJSON;
    this.videoElement = null;
    this.sourceBuffer = null;
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
      mediaSource.duration = 0;
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
  }
}
