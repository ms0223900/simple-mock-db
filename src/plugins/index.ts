import { PluginsByDataType } from "@/types";
import BasicBooleanGenerator from "./BasicBooleanGenerator.plugin";
import ImageGenerator from "./ImageGenerator.plugin";
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
  ]
};

export default basicPlugins;