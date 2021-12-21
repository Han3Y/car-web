import React from "react";
import {
  Typography
} from 'antd';


export interface CopyableFieldProp {
  text?: string
  width?: any
  style?: React.CSSProperties;
  noCopy?: boolean
  mark?: boolean
  tooltip?: boolean
}
export const CopyableField: React.FC<CopyableFieldProp> = (props) => {
  return <div style={{width: props.width, maxWidth: props.width}}>
    <Typography.Paragraph
      copyable={!props.noCopy}
      style={{marginBottom: 0, ...props.style}}
      ellipsis={{rows: 1, tooltip: props.tooltip === undefined ? true : props.tooltip}}
      mark={props.mark}
    >
      {props.text}
    </Typography.Paragraph>
  </div>
};
