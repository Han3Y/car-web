import React, {useEffect, useRef, useState} from "react";
import MonacoEditor, {monaco} from 'react-monaco-editor';
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api";
import ReactResizeDetector from "react-resize-detector";
// yak register
import "./monacoSpec/theme"
import "./monacoSpec/fuzzHTTP";
import "./monacoSpec/yakEditor";
import "./monacoSpec/html"

export type IMonacoActionDescriptor = monaco.editor.IActionDescriptor;

export type IMonacoEditor = monacoEditor.editor.IStandaloneCodeEditor;
export type IMonacoCodeEditor = monacoEditor.editor.ICodeEditor;

export interface EditorProps {
  loading?: boolean
  value?: string
  bytes?: boolean
  valueBytes?: Uint8Array
  setValue?: (e: string) => any
  readOnly?: boolean
  editorDidMount?: (editor: IMonacoEditor) => any
  type?: "html" | "http" | "yak" | string
  theme?: string
  fontSize?: number

  // 自动换行？ true 应该不换行，false 换行
  noWordWrap?: boolean

  noMiniMap?: boolean,
  noLineNumber?: boolean

  actions?: IMonacoActionDescriptor[]
  triggerId?: any

  full?: boolean
}

export interface YakHTTPPacketViewer {
  value: Uint8Array
  isRequest?: boolean
  isResponse?: boolean
  raw?: EditorProps
}

export const YakEditor: React.FC<EditorProps> = (props) => {
  const [editor, setEditor] = useState<IMonacoEditor>();
  const [reload, setReload] = useState(false);
  const [triggerId, setTrigger] = useState<any>();
  // 高度缓存
  const [prevHeight, setPrevHeight] = useState(0);
  const [preWidth, setPreWidth] = useState(0);
  // const [editorHeight, setEditorHeight] = useState(0);
  const outterContainer = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (props.triggerId !== triggerId) {
      setTrigger(props.triggerId)
      setReload(true)
    }
  }, [props.triggerId])

  useEffect(() => {
    if (!reload) {
      return
    }
    setTimeout(() => setReload(false), 100)
  }, [reload])

  useEffect(() => {
    if (!editor) {
      return
    }

    setTimeout(() => {
      setLoading(false)
    }, 200)

    if (props.actions) {
      // 注册右键菜单
      props.actions.forEach(e => {
        editor.addAction(e)
      })
    }
  }, [editor])

  const handleEditorMount = (editor: IMonacoEditor, monaco: any) => {
    const updateEditorHeight = () => {
      const editorElement = editor.getDomNode();

      if (!editorElement) {
        return;
      }

      const padding = 40;

      const lineHeight = editor.getOption(
        monaco.editor.EditorOption.lineHeight
      );
      const lineCount = editor.getModel()?.getLineCount() || 1;
      const height =
        editor.getTopForLineNumber(lineCount + 1) +
        lineHeight +
        padding;


      if (prevHeight !== height) {
        setPrevHeight(height);
        editorElement.style.height = `${height}px`;
        editor.layout();
      }
    };
    editor.onDidChangeModelDecorations(() => {
      updateEditorHeight(); // typing
      requestAnimationFrame(updateEditorHeight); // folding
    });
  };

  return <>
    {!reload && <div style={{height: "100%", width: "100%", overflow: "hidden"}} ref={outterContainer}>
      <ReactResizeDetector
        onResize={(width, height) => {
          if (props.full) {
            return
          }
          if (!width || !height) {
            return
          }

          if (editor) {
            editor.layout({height, width})

          }
          setPrevHeight(height);
          setPreWidth(width)
        }}
        handleWidth={true} handleHeight={true} refreshMode={"debounce"} refreshRate={30}
      >
        <div style={{height: "100%", width: "100%", overflow: "hidden"}}>
          <MonacoEditor
            theme={props.theme || "kurior"}
            value={props.bytes ? new Buffer((props.valueBytes || []) as Uint8Array).toString() : props.value}
            onChange={props.setValue}
            language={props.type || "http"}
            height={100}
            editorDidMount={(editor: IMonacoEditor, monaco: any) => {
              setEditor(editor)
              if (props.editorDidMount) props.editorDidMount(editor);

              if (props.full) {
                handleEditorMount(editor, monaco)
              }
            }}
            options={{
              readOnly: props.readOnly,
              scrollBeyondLastLine: false,
              fontWeight: "500",
              fontSize: props.fontSize || 12,
              showFoldingControls: "always",
              showUnused: true,
              wordWrap: props.noWordWrap ? "off" : "on",
              renderLineHighlight: "line",
              lineNumbers: props.noLineNumber ? "off" : "on",
              minimap: props.noMiniMap ? {enabled: false} : undefined,
              lineNumbersMinChars: 4,
            }}
          />
        </div>
      </ReactResizeDetector>
    </div>}
  </>
};
