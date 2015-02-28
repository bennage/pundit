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

    valueChanged(newValue) {
        var html  = this.converter.makeHtml(newValue);
        this.element.innerHTML = html;
    }
}
