/* eslint-disable @typescript-eslint/no-explicit-any */
// @ts-expect-error || no types
import whiskers from "whiskers";
import path from "path";
import RendererConfig from "../../configs/RendererConfig.json";

interface IAppWithRenderer {
  engine(
    ext: string,
    renderer: (
      // eslint-disable-next-line no-shadow
      path: string,
      options: Record<string, any>,
      callback: (e: any, rendered?: string | undefined) => void
    ) => any
  ): any;
  set(setting: string, val: any): any;
}

export default function InitializeRenderEngine(app: IAppWithRenderer): void {
  // eslint-disable-next-line no-underscore-dangle
  app.engine(RendererConfig.extension, whiskers.__express);
  app.set("views", path.join(process.cwd(), RendererConfig.viewsFolder));
}
