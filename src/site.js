import {
  FileLoadersTransform,
  FilesGraph,
  MapExtensionsGraph,
  MapInnerKeysGraph,
  MapValuesGraph,
} from "@graphorigami/origami";
import path from "node:path";
import { fileURLToPath } from "node:url";
import thumbnail from "./thumbnail.js";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const files = new (FileLoadersTransform(FilesGraph))(dirname);

const assets = await files.get("assets");
const images = await files.get("images");
const indexTemplate = await files.get("index.ori");
const indexHtmlFn = indexTemplate.toFunction();
const personTemplate = await files.get("person.ori");
const personHtmlFn = personTemplate.toFunction();
const teamData = await files.get("teamData.yaml");

const title = "Our Amazing Team";
const indexHtml = indexHtmlFn({ teamData, title });
const thumbnails = new MapValuesGraph(images, thumbnail);
const teamByName = new MapInnerKeysGraph(teamData, (value) =>
  value.get("name")
);
const team = new MapExtensionsGraph(
  teamByName,
  (person) => personHtmlFn({ person, title }),
  {
    extension: "->html",
  }
);

export default {
  assets,
  images,
  "index.html": indexHtml,
  team,
  thumbnails,
};