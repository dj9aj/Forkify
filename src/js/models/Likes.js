export default class Likes {
    constructor() {
        this.likes = [];
    };



    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        // Push like object into likes array
        this.likes.push(like);

        // Persist data in local storage
        this.persistData();
        return like;
    };



    deleteLike(id) {
        // Loop over likes array and find the index which is equal to the id thats passed in
        const index = this.likes.findIndex(el => el.id === id);
        
        // Remove that like from array
        this.likes.splice(index, 1);

        // Persist data in local storage
        this.persistData();
    };



    isLiked(id) {
        // If findIndex returns an index that matches the id that was passed in, then it is not equal to -1, therefore it will return true (isLiked). 
        return this.likes.findIndex(el => el.id === id) !== -1;
    };



    getNumLikes() {
        return this.likes.length;
    };



    persistData() {
        // Add likes array to the local storage. Convert to string
        localStorage.setItem('likes', JSON.stringify(this.likes));
    };


    
    readStorage() {
        // Get local storage and convert into object
        const storage = JSON.parse(localStorage.getItem('likes'));

        // Restore likes from the local storage by adding back to likes array
        if (storage) this.likes = storage;
    };
}