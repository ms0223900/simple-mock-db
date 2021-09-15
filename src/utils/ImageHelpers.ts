export interface MakeSrcsetOptions {
  srcAndWidthList: SingleImgSrcAndWidth[]
}

export interface SingleImgSrcAndWidth {
  src: string
  width: string | number
}

const ImageHelpers = {
  checkIsResString: (imgSrc = '100x200') => {
    const devided = imgSrc.split('x');
    return (
      !Number.isNaN(Number(devided[0]))
            && !Number.isNaN(Number(devided[1]))
    );
  },

  getFakeImageByResolution: (resolution = '200x200'): string => (
    `https://fakeimg.pl/${resolution}/`
  ),

  addBackgroundPrefix: (imgSrc = ''): string => (
    `background-image: url(${imgSrc})`
  ),

  getHandledImgSrc(_imgSrc: string, fakeImgRes?: string): string {
    let res = _imgSrc;
    if (this.checkIsResString(_imgSrc)) {
      res = this.getFakeImageByResolution(_imgSrc);
    }
    if (fakeImgRes) {
      res = this.getFakeImageByResolution(fakeImgRes);
    }
    return res;
  },

  makeSingleSrcSet({ src, width }: SingleImgSrcAndWidth): string {
    const imgSrc = this.getHandledImgSrc(src);
    return `${imgSrc} ${width}w`;
  },
  makeSrcset(options: MakeSrcsetOptions): string {
    const res = options.srcAndWidthList.map((s) => this.makeSingleSrcSet(s)).join(', ');
    return res;
  },
};

export default ImageHelpers;
