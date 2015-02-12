export class Line {

    constructor(text, number) {
        this.text = (text === '') ? ' ' : text;
        this.number = number;

        this.comments = [];

        this.selected = false;
        this.adding = false;

        this.newCommentBody = '';

    }

    addComment() {
        this.adding = true;
    }

    cancelComment() {
        this.adding = false;
    }

    postComment() {
        this.adding = false;
        console.log(this.newCommentBody);
        this.newCommentBody = '';
    }
}
