export function ValidateComment(comment) {
    if(!comment.author) throw 'The comment does not have an author.';
    if(!comment.body) throw 'The comment does not have a body.';
    return true;
}
