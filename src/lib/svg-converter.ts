export function convertSvgToPathArray(svgString: string) {
  // Create a temporary div to parse the SVG
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = doc.querySelector("svg");

  if (!svgElement) {
    throw new Error("No SVG element found in the provided string");
  }

  // Get the viewBox
  const viewBox = svgElement.getAttribute("viewBox") || "0 0 239 43";

  // Extract all path elements
  const pathElements = svgElement.querySelectorAll("path");
  const paths = Array.from(pathElements).map((path) => {
    const pathObj: {
      d: string;
      fill?: string;
      stroke?: string;
      className?: string;
      fillRule?: string;
      clipRule?: string;
    } = {
      d: path.getAttribute("d") || "",
    };

    // Add optional attributes if they exist
    if (path.getAttribute("fill")) pathObj.fill = path.getAttribute("fill")!;
    if (path.getAttribute("stroke"))
      pathObj.stroke = path.getAttribute("stroke")!;
    if (path.getAttribute("class"))
      pathObj.className = path.getAttribute("class")!;
    if (path.getAttribute("fill-rule"))
      pathObj.fillRule = path.getAttribute("fill-rule")!;
    if (path.getAttribute("clip-rule"))
      pathObj.clipRule = path.getAttribute("clip-rule")!;

    return pathObj;
  });

  return {
    viewBox,
    paths,
  };
}
