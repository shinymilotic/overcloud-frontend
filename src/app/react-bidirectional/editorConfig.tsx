import defaultTheme from "./themes/DefaultTheme";

const editorConfig = {
  namespace: "overcloud-editor",
  theme: defaultTheme,
  onError(error: any) {
    throw error;
  },
  nodes: []
};

export default editorConfig;
