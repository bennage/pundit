export class Line {

    constructor(text, number) {
        this.text = (text === '') ? ' ' : text;
        this.number = number;

        this.comments = [];

        this.adding = false;

        // See the TODO about this in the view.
        this.newCommentBody = '';
    }

    addComment() {
        this.adding = true;
    }

    cancelComment() {
        this.adding = false;
    }
}
