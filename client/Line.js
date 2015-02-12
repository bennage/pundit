export class Line {

    constructor(text, number, createCommentWithContext) {
        this.text = (text === '') ? ' ' : text;
        this.number = number;

        this.comments = [];

        this.selected = false;
        this.adding = false;

        this.newCommentBody = '';
        this.createCommentWithContext = createCommentWithContext;
    }

    addComment() {
        this.adding = true;
    }

    cancelComment() {
        this.adding = false;
    }

    postComment() {
        this.adding = false;

        var comment = this.createCommentWithContext();

        console.dir(comment);
        
        comment.body = this.newCommentBody;

        this.comments.push(comment);

        this.newCommentBody = '';
    }
}
