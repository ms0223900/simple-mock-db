import { PluginsByDataType } from "@/types";
import BasicBooleanGenerator from "./BasicBooleanGenerator.plugin";
import BasicNumberGenerator from "./BasicNumberGenerator.plugin";
import ImageGenerator from "./ImageGenerator.plugin";
import RandomNumberGenerator from "./RandomNumberGenerator.plugin";
import SimpleEmailGenerator from "./SimpleEmailGenerator.plugin";

const basicPlugins: Partial<PluginsByDataType> = {
  boolean: [
    BasicBooleanGenerator,
  ],
  string: [
    SimpleEmailGenerator,
  ],
  object: [
    ImageGenerator,
  ],
  number: [
    RandomNumberGenerator,
    BasicNumberGenerator,
  ]
};

export default basicPlugins;