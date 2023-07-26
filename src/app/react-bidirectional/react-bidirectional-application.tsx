import { Injector } from "@angular/core";
import * as React from "react";
import Editor from "./react-leditor";
import { createRoot } from 'react-dom/client';

interface IReactBidirectionalApp {
  injector: Injector;
}

class ReactBidirectionalApp extends React.Component<IReactBidirectionalApp, any> {
  constructor(props: IReactBidirectionalApp | Readonly<IReactBidirectionalApp>) {
    super(props);

    this.state = {
    };
  }

  override render() {
    return (
      <div className={'renderer'}>
        <Editor />
      </div>
    );
  }
}

export class ReactBidirectionalApplication {

  static initialize(
    containerId: string,
    injector: Injector,
  ) {
    const container: any = document.getElementById(containerId);
    const root = createRoot(container);
    root.render( <ReactBidirectionalApp injector={injector} />);
  }
}
