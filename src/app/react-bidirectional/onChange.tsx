import { $getRoot, $getSelection, EditorState, LexicalEditor } from "lexical";

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
export default function onChange(editorState: EditorState, editor: LexicalEditor, tags: Set<string>) {
  editorState.read(() => {
    // Read the contents of the EditorState here.
    const root = $getRoot();
    const selection = $getSelection();
    console.log(JSON.stringify(editorState));
  });
}
