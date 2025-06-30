import { useMemo } from "react";

export function useFieldId(node) {
  const fieldId = useMemo(() => {
    if (!node) {
      return null;
    }

    const parentItem = node.parentElement;

    if (parentItem?.tagName !== "HRITEM") {
      return null;
    }

    const fieldAttr = parentItem.getAttribute("Field");
    if (!fieldAttr) {
      console.error(
        "ID Logic Error: Parent HRITEM is missing 'Field' attribute.",
        parentItem
      );
      return null;
    }

    const infoNode = parentItem.closest("[Info]");
    const infoAttr = infoNode?.getAttribute("Info");
    if (infoAttr) {
      if (fieldAttr.startsWith(infoAttr)) {
        return fieldAttr.substring(infoAttr.length);
      }
    }
    if (fieldAttr.length > 4) {
      const potentialId = fieldAttr.substring(4);
      console.warn(
        `useFieldId using fallback logic for Field="${fieldAttr}". Derived ID: "${potentialId}"`
      );
      return potentialId;
    }
    console.error("Could not derive a valid Field ID.", {
      Node: node,
      "Parent Field": fieldAttr,
      "Ancestor Info": infoAttr,
    });

    return null;
  }, [node]);

  return fieldId;
}
