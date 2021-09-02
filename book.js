// toggleMessage function is for displaying error message or number of result founded
const toggleMessage = (display, message = 'No results found!', bg = 'bg-warning') =>{
    const searchMessage = document.getElementById('search-message');
    searchMessage.innerText = `${message}`;
    // setting different background color based on message
    if(bg !== 'bg-warning'){
        searchMessage.classList.remove('bg-warning');
        searchMessage.classList.add(`${bg}`);
    }
    else{
        searchMessage.classList.remove('bg-info');
        searchMessage.classList.add(`${bg}`);
    }
    // removing previous class name by checking display property
    if(display === 'd-none'){
        searchMessage.classList.remove('d-block');
    }
    else{
        searchMessage.classList.remove('d-none');
    }       
    searchMessage.classList.add(`${display}`);
}

// toggleSpinner function is created for toggle spinner 
const toggleSpinner = display => {
    const spinner = document.getElementById('spinner');
    if(display === 'd-block'){
        spinner.classList.remove('d-none');
        spinner.classList.add('d-block');
    } 
    else {
        spinner.classList.remove('d-block');
        spinner.classList.add('d-none');
    }
}

// searchBook function is created for getting search input text and to validate if input is empty and it will call other function to complete further task 
const searchBook = () =>{
    const searchText = document.getElementById('search-text').value;
    if(searchText.length === 0){
        toggleMessage('d-block', 'Please enter a Book name!');
        // clearing all content from books container 
        document.getElementById('books-container').textContent = '';
    }
    else{
        toggleMessage('d-none');
        // making url dynamic with input text 
        const url = `https://openlibrary.org/search.json?q=${searchText}`;
        // clearing all content from books container 
        document.getElementById('books-container').textContent = '';
        // calling spinner to display 
        toggleSpinner('d-block');
        // it's time to fetch
        fetchData(url);
    }
}

// fetching url with async await and passing result to displayBooks function 
const fetchData = async url => {
    res = await fetch(url);
    data = await res.json();
    displayBooks(data);
}

// displayBooks will extract data from result and create respected elements to show them on webpage
const displayBooks = data => {
    toggleSpinner('d-none');
    document.getElementById('search-text').value = '';
    if(data.numFound !== 0){
        toggleMessage('d-block', `${data.numFound} Books found related to your search.`, 'bg-info');
        const bookList = data.docs;
        const booksContainer = document.getElementById('books-container');
        bookList.forEach(book => {
            const div = document.createElement('div');
            div.classList.add('col');
            div.innerHTML = `
            <div class="card h-100 shadow">
            <img src="${getImage(book)}" style="height: 15rem;" class="card-img-top p-3 pb-0" alt="...">
            <div class="card-body">
                <h5 class="card-title">${getBookName(book)}</h5>
                <h6>Author: ${getAuthorName(book)}</h6>
                <h6>Publisher: ${getPublisherName(book)}</h6>
                <p class="card-text">First publish year: ${getPublishYear(book)}</p>
            </div>
            </div>`;
            booksContainer.appendChild(div);
        });        
    }
    else{
        toggleMessage('d-block');
    }    
}

// getImage function will check if the book has an image or not. if there is no image, it will set a default image; which describe it has no image 
const getImage = book =>{
    if(book.cover_i === undefined){
        return 'https://covers.openlibrary.org/b/id/10909258-M.jpg';
    }
    else{
        return `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
    }
}

// getBookName function will check whether name of the book is too long or not. if long; it will return sliced value to set the name 
const getBookName = book =>{
    if(book.title.length<50){
        return book.title;
    }
    else{
        return book.title.slice(0,50);
    }
}

// getAuthorName function will check whether Author name exist in the result or not! if not it will set 'Unknown' as the Author value.
const getAuthorName = book => {
    if(book.author_name !== undefined){
        return book.author_name[0];
    }
    else{
        return 'Unknown';
    }
}
// getPublisherName function will check whether publisher exist in the result or not! if not it will set 'Unknown' as the publisher value.
const getPublisherName = book => {
    if(book.publisher !== undefined){
        return book.publisher[0];
    }
    else{
        return 'Unknown';
    }
}
// getPublishYear function will check whether first publish year exist in the result or not! if not it will set 'Unknown' as the first publish year value.
const getPublishYear = book => {
    if(book.first_publish_year !== undefined){
        return book.first_publish_year;
    }
    else{
        return 'Unknown';
    }
}