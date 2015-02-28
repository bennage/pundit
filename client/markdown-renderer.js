import { Behavior } from 'aurelia-framework';

import showdown from 'showdown';

export class MarkdownRendererAttachedBehavior {

    static metadata(){
        return Behavior
            .attachedBehavior('markdown-renderer')
            .withProperty('value', 'valueChanged', 'markdown-renderer');
        }

        static inject() { return [Element]; }

    constructor(element) {
        this.element = element;
        this.converter = new showdown.converter();
    }

    attached() {
        this.value.somethingElse();
    }

    valueChanged(newValue) {

        var html  = this.converter.makeHtml(
          newValue.split('\n').map((line) => line.trim()).join('\n')
        );

        this.element.innerHTML = html;
    }
}
