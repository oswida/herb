import { Editor, TLEmbedShape, uniqueId } from "@tldraw/tldraw";
import { IPdfShape } from "../shapes/PdfContent";
import { UPLOAD_URL } from "../common";

export const registerPdfContent = (editor: Editor) => {
  editor.registerExternalContentHandler("files", async ({ files, point }) => {
    files
      .filter((f) => f.type === "application/pdf")
      .forEach(async (f) => {
        const id = uniqueId();

        const objectName = `${id}-${f.name}`.replaceAll(/[^a-zA-Z0-9.]/g, "-");
        const url = `${UPLOAD_URL}/${objectName}`;

        await fetch(url, {
          method: "POST",
          body: f,
        });

        editor.createShape<IPdfShape>({
          type: "pdf",
          x: point?.x,
          y: point ? point.y - 150 : 0,
          props: {
            pdf: url,
            w: 500,
            h: 300,
          },
        });
      });
    // const htmlSource = sources?.find(
    //   (s) => s.type === "application" && s.subtype === "pdf"
    // );

    // if (htmlSource) {
    //   const center = point ?? editor.viewportPageCenter;

    //   editor.createShape({
    //     type: "pdf",
    //     x: center.x - 250,
    //     y: center.y - 150,
    //     props: {
    //       pdf: htmlSource.data,
    //     },
    //   });
    // }
  });
};
