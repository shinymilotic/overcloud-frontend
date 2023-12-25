import { OnInit, Input, Component, Output, EventEmitter } from "@angular/core";
import { LEditor } from "./react-bidirectional/lexical-editor";
import { $getRoot, $insertNodes, EditorState, LexicalEditor } from "lexical";
import { $generateNodesFromDOM } from "@lexical/html";

@Component({
  selector: "lexical-editor",
  template: ``,
  standalone: true,
})
export class LexicalEditorBinding implements OnInit {
  reactApp: LEditor;
  @Output() changeValueEvent = new EventEmitter<LexicalEditor>();

  constructor() {
    this.reactApp = new LEditor();
  }

  ngOnInit() {
    this.reactApp.initialize("lexical-editor", this.onChange.bind(this));
  }

  onChange(editorState: EditorState, editor: LexicalEditor) {
    editorState.read(() => {
      this.reactApp.value = editor;
      this.changeValueEvent.emit(this.reactApp.value);
    });
  }

  getCurrentValue() {
    this.reactApp.value;
  }

  // @Input() set setCurrentValue(value: string) {
  //   if (value != "") {
  //     this.reactApp.value.update(() => {
  //       // In the browser you can use the native DOMParser API to parse the HTML string.
  //       const parser = new DOMParser();
  //       const dom = parser.parseFromString(value, "text/html");

  //       // Once you have the DOM instance it's easy to generate LexicalNodes.
  //       const nodes = $generateNodesFromDOM(this.reactApp.value, dom);

  //       // Select the root
  //       $getRoot().select();

  //       // Insert them at a selection.
  //       $insertNodes(nodes);
  //     });
  //   }
  // }
}
