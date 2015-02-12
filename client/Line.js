export class Line {

    constructor(text, number, user) {
        this.text = (text === '') ? ' ' : text;
        this.number = number;
        this.user = user;

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

        this.comments.push({
            author: this.user.name,
            body: this.newCommentBody
        });

        this.newCommentBody = '';
    }
}
