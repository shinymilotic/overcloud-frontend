import defaultTheme from "./themes/DefaultTheme";
import { InitialConfigType, LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import * as React from "react";
import {OnChangePlugin} from '@lexical/react/LexicalOnChangePlugin';
import { EditorState, LexicalEditor } from "lexical";
import { Root, createRoot } from 'react-dom/client';
import onChange from "./onChange";

export class LEditor {
  value!: LexicalEditor;
  
  root!: Root;
  placeholder = () => {
    return <div className="editor-placeholder">Nhập nội dung...</div>;
  }

  editorConfig = () : InitialConfigType => {
    return {
      namespace: "lexical-editor",
      theme: defaultTheme,
      onError(error: any) {
        throw error;
      },
      nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode
      ]
    };
  }

  Editor(onChange: any) {
    return (
      <LexicalComposer initialConfig={this.editorConfig()}>
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<this.placeholder/>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <OnChangePlugin onChange={(editorState, editor) => {onChange(editorState, editor)}} />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <CodeHighlightPlugin />
            <ListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          </div>
        </div>
      </LexicalComposer>
    );
  }

  initialize(containerId: string, onChange: any) {
    const container: any = document.getElementById(containerId);
    // if(container.innerHTML === '') {
    this.root = createRoot(container);
    // }
    const editorElement = this.Editor(onChange);
    this.root.render(editorElement);
  }
}


