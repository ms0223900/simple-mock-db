import { SingleGetterResolver } from "@/types";
import DateGetterResolver from "./DateGetterResolver";
import RandomValGetterResolver from "./RandomValGetterResolver";

const BasicGetterResolvers: Record<string, SingleGetterResolver> = {
  [RandomValGetterResolver.name]: RandomValGetterResolver,
  [DateGetterResolver.name]: DateGetterResolver,
};

export default BasicGetterResolvers;