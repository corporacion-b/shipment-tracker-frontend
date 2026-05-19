declare module "react-leaflet-cluster" {
  import type { ReactNode } from "react";

  export default function MarkerClusterGroup(props: {
    children: ReactNode;
    chunkedLoading?: boolean;
    disableClusteringAtZoom?: number;
    zoomToBoundsOnClick?: boolean;
  }): JSX.Element;
}
