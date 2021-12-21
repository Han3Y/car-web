import {PortAsset} from "@/pages/penetration/port/beans/portAsset";

export interface PortAssetTableProp {
  closed?: boolean
  onClicked?: (i: PortAsset) => any,
}
