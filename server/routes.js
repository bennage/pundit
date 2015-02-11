export class Routes {

    // thinking through the flow of posting a comment to the backend
    postComment(owner, repo, blobSha, comment) {

        // does the db exist? 'owner/repo'
        // n -> info the user
        // y ->
        //   does a collection exist for the blob?
        //   n -> create it
        //   timestamp the comment (does DocDb do this? probably)
        //   add the comment as doc to the collection
    }

    getComments(owner, repo, blobSha) {
        // does the db exist? 'owner/repo'
        // n -> info the user
        // y ->
        //   does a collection exist for the blob?
        //   n -> respond empty page
        //   return a page of comments
        // NB we can have a large page size and deal with pagination later
    }

}
