import { assert } from "@ember/debug";
import { action } from "@ember/object";
import {
  Placement,
  autoUpdate,
  computePosition,
  flip,
  offset,
  platform,
  shift,
} from "@floating-ui/dom";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";

interface FloatingUIContentSignature {
  Args: {
    anchor: HTMLElement;
    placement?: Placement;
    renderOut?: boolean;
  };
}

export default class FloatingUIContent extends Component<FloatingUIContentSignature> {
  @tracked _content: HTMLElement | null = null;
  @tracked cleanup: (() => void) | null = null;

  get content() {
    assert("_content must exist", this._content);
    return this._content;
  }

  @action didInsert(e: HTMLElement) {
    this._content = e;

    let updatePosition = async () => {
      computePosition(this.args.anchor, this.content, {
        platform: platform,
        placement: this.args.placement || "bottom-start",
        middleware: [offset(5), flip(), shift()],
      }).then(({ x, y, placement }) => {
        this.content.setAttribute("data-floating-ui-placement", placement);

        Object.assign(this.content.style, {
          left: `${x}px`,
          top: `${y}px`,
        });
      });
    };

    this.cleanup = autoUpdate(this.args.anchor, this.content, updatePosition);
  }
}