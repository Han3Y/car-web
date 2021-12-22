import React from "react";
import {
  AutoComplete, Form, FormItemProps, Input,
  Typography
} from 'antd';
const {Item} = Form;
import {LiteralUnion} from "antd/es/_util/type";


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


export interface InputItemProps {
  label: string | any
  value?: string
  placeholder?: string
  disable?: boolean
  required?: boolean
  help?: string | any

  setValue?(s: string): any

  autoComplete?: string[]
  type?: LiteralUnion<'button' | 'checkbox' | 'color' | 'date' | 'datetime-local' | 'email' | 'file' | 'hidden' | 'image' | 'month' | 'number' | 'password' | 'radio' | 'range' | 'reset' | 'search' | 'submit' | 'tel' | 'text' | 'time' | 'url' | 'week', string>
  width?: string | number
  style?: React.CSSProperties
  extraFormItemProps?: FormItemProps
  textarea?: boolean
  textareaRow?: number
  textareaCol?: number
  autoSize?: boolean | object
  allowClear?: boolean

  prefix?: React.ReactNode
  suffix?: React.ReactNode

  // 放在form-item里面的前缀元素
  prefixNode?: React.ReactNode
  // 是否阻止事件冒泡
  isBubbing?: boolean
}


export const InputItem: React.FC<InputItemProps> = (props) => {
  return <Item
    label={props.label}
    required={!!props.required} style={props.style} {...props.extraFormItemProps}
    help={props.help}
  >
    {props.prefixNode}
    {props.autoComplete ? <AutoComplete
      style={{width: props.width || 200}}
      dropdownMatchSelectWidth={400}
      disabled={!!props.disable}
      placeholder={props.placeholder}
      allowClear={true}
      value={props.value} onChange={e => props.setValue && props.setValue(e)}
      options={(props.autoComplete || []).map(i => {
        return {value: i}
      })}
    /> : props.textarea ? <>
      <Input.TextArea
        style={{width: props.width}}
        // type={props.type}
        rows={props.textareaRow}
        autoSize={props.autoSize}
        cols={props.textareaCol}
        required={!!props.required}
        disabled={!!props.disable}
        placeholder={props.placeholder}
        allowClear={props.allowClear}
        value={props.value} onChange={e => {
        props.setValue && props.setValue(e.target.value);
        if (props.isBubbing) e.stopPropagation()
      }}
        onPressEnter={(e) => {
          if (props.isBubbing) e.stopPropagation()
        }}
        onFocus={(e) => {
          if (props.isBubbing) e.stopPropagation()
        }}
        onClick={(e) => {
          if (props.isBubbing) e.stopPropagation()
        }}
      />
    </> : <Input
      style={{width: props.width}}
      type={props.type}
      required={!!props.required}
      disabled={!!props.disable}
      placeholder={props.placeholder}
      allowClear={props.allowClear}
      value={props.value} onChange={e => {
      props.setValue && props.setValue(e.target.value);
      if (props.isBubbing) e.stopPropagation()
    }}
      prefix={props.prefix}
      suffix={props.suffix}
      onPressEnter={(e) => {
        if (props.isBubbing) e.stopPropagation()
      }}
      onFocus={(e) => {
        if (props.isBubbing) e.stopPropagation()
      }}
      onClick={(e) => {
        if (props.isBubbing) e.stopPropagation()
      }}
    />}

  </Item>
};
