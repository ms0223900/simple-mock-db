import { SingleGetterResolver } from "@/types";
import BooleanGetterResolver from "./BooleanGetterResolver";
import DateGetterResolver from "./DateGetterResolver";
import FakeImageGetterResolver from "./FakeImageGetterResolver";
import RandomValGetterResolver from "./RandomValGetterResolver";

const BasicGetterResolvers: Record<string, SingleGetterResolver> = {
  [RandomValGetterResolver.name]: RandomValGetterResolver,
  [DateGetterResolver.name]: DateGetterResolver,
  [BooleanGetterResolver.name]: BooleanGetterResolver,
  [FakeImageGetterResolver.name]: FakeImageGetterResolver,
};

export default BasicGetterResolvers;