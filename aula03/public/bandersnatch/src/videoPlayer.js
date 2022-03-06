class VideoPlayer {
  constructor({ manifestJSON, network, videoComponent }) {
    this.activeItem = {};
    this.videoComponent = videoComponent;
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
      setInterval(this.waitForQuestions.bind(this), 200);
    };
  }

  waitForQuestions() {
    const currentTime = parseInt(this.videoElement.currentTime);
    const option = this.selected.at === currentTime;

    if (!option) return;
    // evitar que a modal apareça 2x no mesmo segundo
    if (this.activeItem.url === this.selected.url) return;

    this.videoComponent.configureModal(this.selected.options);
    this.activeItem = this.selected;
  }

  async nextChunk(data) {
    const key = data.toLowerCase();

    const selected = this.manifestJSON[key];

    this.selected = {
      ...selected,
      // ajustar o tempo que o modal vai aparecer, baseado no tempo corrente
      at: parseInt(this.videoElement.currentTime + selected.at),
    };

    // deixar o restante do video rodar enquanto o novo vai ser baixado
    this.videoElement.play();
    await this.fileDownload(selected.url);
  }

  async fileDownload(url) {
    const prepareUrl = {
      url,
      fileResolution: 360,
      fileResolutionTag: this.manifestJSON.fileResolutionTag,
      hostTag: this.manifestJSON.hostTag,
    };

    const finalUrl = this.network.parseManifestURL(prepareUrl);
    console.log("finalUrl", finalUrl);
    this.setVideoPlayerDuration(finalUrl);
    const data = await this.network.fetchFile(finalUrl);
    await this.processBufferSegments(data);
  }

  setVideoPlayerDuration(finalUrl) {
    //finalUrl http://127.0.0.1:8081/timeline/01.intro/01.intro-12.733333-360.mp4

    const bars = finalUrl.split("/");
    const [name, videoDuration] = bars[bars.length - 1].split("-");
    this.videoDuration += parseFloat(videoDuration);
    console.log("video duration:", this.videoDuration);
  }

  async processBufferSegments(allSegments) {
    const sourceBuffer = this.sourceBuffer;
    sourceBuffer.appendBuffer(allSegments);

    return new Promise((resolve, reject) => {
      // Quando chegar bytes novos, atualiza e remove o eventListenet
      // Para evitar loop infinitos no updateend event
      const updateEnd = () => {
        sourceBuffer.removeEventListener("updateend", updateEnd);

        // Netflix talks about this timestamp offset
        // para sincronizar o player com o tempo correto
        sourceBuffer.timestampOffset = this.videoDuration;

        return resolve();
      };

      sourceBuffer.addEventListener("updateend", updateEnd);

      sourceBuffer.addEventListener("error", reject);
    });
  }
}
