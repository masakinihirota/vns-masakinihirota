import {
  Children,
  cloneElement,
  type HTMLAttributes,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

type SlotProperties = HTMLAttributes<HTMLElement> & {
  children?: ReactNode;
};

export const Slot = (properties: SlotProperties) => {
  const { children, ...rest } = properties;

  // https://react.dev/reference/react/isValidElement
  // https://react.dev/reference/react/cloneElement
  if (isValidElement(children)) {
    const childProperties = children.props as Record<string, unknown>;
    return cloneElement(children as ReactElement, {
      ...rest,
      ...childProperties,
      className: `${rest.className ?? ""} ${childProperties.className ?? ""}`,
    } as Record<string, unknown>);
  }

  if (Children.count(children) > 1) {
    Children.only(null);
  }

  return null;
};
