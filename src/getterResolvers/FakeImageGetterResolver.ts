import { SingleGetterResolver } from "@/types";
import ImageHelpers from "@/utils/ImageHelpers";

const IMAGE_MIN_WIDTH = 200;
const RATIO_STR_REG_EXP = /(\d+)_(\d+)/g;

const FakeImageGetterResolver: SingleGetterResolver = {
  name: 'fakeImageGetter',
  resolveByGetterInput: ({
    type, condition, param
  }) => {
    // console.log(param);
    const paramIsRatio = (param as string).match(RATIO_STR_REG_EXP);
    let resolution = `360x270`;
    if(paramIsRatio) {
      const [
        width, height
      ] = (param as string).split(RATIO_STR_REG_EXP).filter(s => !!s);
  
      resolution = `${IMAGE_MIN_WIDTH}x${IMAGE_MIN_WIDTH * (Number(width) / Number(height))}`;
    }

    const src = ImageHelpers.getFakeImageByResolution(resolution);
    return ({
      src,
      name: `fake_img_${resolution}`,
    });
  }
};

export default FakeImageGetterResolver;