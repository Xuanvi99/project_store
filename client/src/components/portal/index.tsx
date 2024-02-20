import React, { Fragment, useEffect } from "react";
import { createPortal } from "react-dom";

const createPortalWrapper = () => {
  const element: HTMLDivElement = document.createElement("div");
  element.id = "portal-wrap";
  return element;
};

const portalElement = createPortalWrapper();

interface IPortalProps {
  children: React.ReactNode;
}

export default function Portal({ children }: IPortalProps) {
  useEffect(() => {
    document.body.appendChild(portalElement);
  }, []);
  const renderElement = <Fragment>{children}</Fragment>;
  return createPortal(renderElement, portalElement);
}
