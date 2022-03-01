const localStorageKey   = "BOOKSHELF"
const title             = document.querySelector("#inputBookTitle")
const errorTitle        = document.querySelector("#errorTitle")
const author            = document.querySelector("#inputBookAuthor")
const errorAuthor       = document.querySelector("#errorAuthor")
const year              = document.querySelector("#inputBookYear")
const errorYear         = document.querySelector("#errorYear")
const desc              = document.querySelector("#inputBookDesc")
const readed            = document.querySelector("#inputBookIsComplete")
const btnSubmit         = document.querySelector("#bookSubmit")
const searchValue       = document.querySelector("#searchBookTitle")
const btnSearch         = document.querySelector("#searchSubmit")

let checkInput  = []
let checkTitle  = ''
let checkAuthor = ''
let checkYear   = ''

window.addEventListener("load", function(){
    if (localStorage.getItem(localStorageKey) !== null) {    
        const booksData = getData()
        showData(booksData)
    }
})

btnSearch.addEventListener("click",function(e) {
    e.preventDefault()
    if (localStorage.getItem(localStorageKey) == null) {    
        return alert("There Is No Book Data")
    }else{
        const getByTitle = getData().filter(a => a.title == searchValue.value.trim());
        if (getByTitle.length == 0) {
            const getByAuthor = getData().filter(a => a.author == searchValue.value.trim());
            if (getByAuthor.length == 0) {
                const getByYear = getData().filter(a => a.year == searchValue.value.trim());
                if (getByYear.length == 0) {
                    alert(`No Data Found With Keywords: ${searchValue.value}`)
                }else{
                    showSearchResult(getByYear);
                }
            }else{
                showSearchResult(getByAuthor);
            }
        }else{
            showSearchResult(getByTitle);
        }
    }

    searchValue.value = ''
})

btnSubmit.addEventListener("click", function() {
    if (btnSubmit.value == "") {
        checkInput = []

        title.classList.remove("error")
        author.classList.remove("error")
        year.classList.remove("error")

        errorTitle.classList.add("error-display")
        errorAuthor.classList.add("error-display")
        errorYear.classList.add("error-display")

        if (title.value == "") {
            checkTitle = false
        }else{
            checkTitle = true
        }

        if (author.value == "") {
            checkAuthor = false
        }else{
            checkAuthor = true
        }

        if (year.value == "") {
            checkYear = false
        }else{
            checkYear = true
        }

        checkInput.push(checkTitle,checkAuthor,checkYear)
        let resultCheck = validation(checkInput)

        if (resultCheck.includes(false)) {
            return false
        }else{
            if (desc.value == ''){
                const descript = "No Description"
                const newBook = {
                    id: +new Date(),
                    title: title.value.trim(),
                    author: author.value.trim(),
                    year: year.value,
                    desc: descript,
                    isCompleted: readed.checked,
                    isFavorite: ''
                }

                insertData(newBook)

                title.value = ''
                author.value = ''
                year.value = ''
                desc.value = ''
                readed.checked = false
                isFavorite = ''

            } else {
                const newBook = {
                id: +new Date(),
                title: title.value.trim(),
                author: author.value.trim(),
                year: year.value,
                desc: desc.value,
                isCompleted: readed.checked,
                isFavorite: ''
                }
                insertData(newBook)

                title.value = ''
                author.value = ''
                year.value = ''
                desc.value = ''
                readed.checked = false
                isFavorite = ''
            }
            
        }    
    }else{
        const bookData = getData().filter(a => a.id != btnSubmit.value);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData))

        const newBook = {
            id: btnSubmit.value,
            title: title.value.trim(),
            author: author.value.trim(),
            year: year.value,
            desc: desc.value,
            isCompleted: readed.checked,
        }
        insertData(newBook)
        btnSubmit.innerHTML = "Completed"
        btnSubmit.value = ''
        title.value = ''
        author.value = ''
        year.value = ''
        desc.value = ''
        readed.checked = false
        alert("Book Succesfully Edited!")
    }
})

function validation(check) {
    let resultCheck = []
    
    check.forEach((a,i) => {
        if (a == false) {
            if (i == 0) {
                title.classList.add("error")
                errorTitle.classList.remove("error-display")
                resultCheck.push(false)
            }else if (i == 1) {
                author.classList.add("error")
                errorAuthor.classList.remove("error-display")
                resultCheck.push(false)
            }else{
                year.classList.add("error")
                errorYear.classList.remove("error-display")
                resultCheck.push(false)
            }
        }
    });
    return resultCheck
}

function insertData(book) {
    let bookData = []
    if (localStorage.getItem(localStorageKey) === null) {
        localStorage.setItem(localStorageKey, 0);
    }else{
        bookData = JSON.parse(localStorage.getItem(localStorageKey))
    }

    bookData.unshift(book)   
    localStorage.setItem(localStorageKey,JSON.stringify(bookData))
    
    showData(getData())
}

function getData() {
    return JSON.parse(localStorage.getItem(localStorageKey)) || []
}

function showData(books = []) {
    const inCompleted = document.querySelector("#incompleteBookshelfList")
    const completed = document.querySelector("#completeBookshelfList")
    const favorited = document.querySelector("#favoriteBookshelfList")

    inCompleted.innerHTML = ''
    completed.innerHTML = ''
    favorited.innerHTML = ''

    books.forEach(book => {
        if (book.isCompleted == false ) {
            let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Author : ${book.author}</p>
                <p>Year : ${book.year}</p>
                <p class="desc">${book.desc}</p>

                <div class="action">
                    <button class="btnhis" onclick="readedBook('${book.id}')">Complete</button>
                    <a href="#sectiontwo"><button class="btnhis" onclick="editBook('${book.id}')" id="btnedit">Edit</button></a>
                    <button class="btnhis" onclick="deleteBook('${book.id}')">Delete</button>
                    <button class="btnhis" onclick="favoriteBook('${book.id}')" >Favorite</button>
                </div>
            </article>
            `
            if (book.isFavorite == true) {
                let en = `
                <article class="book_fav">
                    <div class="headerfav">
                        <i class="fa-solid fa-star"></i>
                        <h3>${book.title}</h3>
                    </div>
                    <p>Author : ${book.author}</p>
                    <p>Year : ${book.year}</p>
                    <p class="desc">${book.desc}</p>

                    <div class="action">
                        <button class="btnhis" onclick="deleteFavoriteBook('${book.id}')" id="btndel">Delete</button>
                    </div>
                </article>
                `
                favorited.innerHTML += en
            }
            inCompleted.innerHTML += el
        } 
        else {
            let el = `
            <article class="book_item">
                <h3>${book.title}</h3>
                <p>Author : ${book.author}</p>
                <p>Year : ${book.year}</p>
                <p class="desc">${book.desc}</p>

                <div class="action">
                    <button class="btnhis" onclick="unreadedBook('${book.id}')">Uncomplete</button>
                    <a href="#sectiontwo"><button class="btnhis" onclick="editBook('${book.id}')" id="btnedit">Edit</button></a>
                    <button class="btnhis" onclick="deleteBook('${book.id}')">Delete</button>
                    <button class="btnhis" onclick="favoriteBook('${book.id}')" >Favorite</button>
                </div>
            </article>
            `
            if (book.isFavorite == true) {
                let en = `
                <article class="book_fav">
                    <div class="headerfav">
                        <i class="fa-solid fa-star"></i>
                        <h3>${book.title}</h3>
                    </div>
                    <p>Author : ${book.author}</p>
                    <p>Year : ${book.year}</p>
                    <p class="desc">${book.desc}</p>

                    <div class="action">
                        <button class="btnhis" onclick="deleteFavoriteBook('${book.id}')" id="btndel">Delete</button>
                    </div>
                </article>
                `
                favorited.innerHTML += en
            }
            completed.innerHTML += el
        } 
    });
}

function readedBook(id) {
    let confirmation = confirm("Move To Finish Reading?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const favorite = bookDataDetail[0].isFavorite;
        if (favorite == true){
            const newBook = {
                id: bookDataDetail[0].id,
                title: bookDataDetail[0].title,
                author: bookDataDetail[0].author,
                year: bookDataDetail[0].year,
                desc: bookDataDetail[0].desc,
                isCompleted: true,
                isFavorite: true
            }
    
            const bookData = getData().filter(a => a.id != id);
            localStorage.setItem(localStorageKey,JSON.stringify(bookData))
    
            insertData(newBook)
        }
        else {
            const newBook = {
                id: bookDataDetail[0].id,
                title: bookDataDetail[0].title,
                author: bookDataDetail[0].author,
                year: bookDataDetail[0].year,
                desc: bookDataDetail[0].desc,
                isCompleted: true,
                isFavorite: false
            }
    
            const bookData = getData().filter(a => a.id != id);
            localStorage.setItem(localStorageKey,JSON.stringify(bookData))
    
            insertData(newBook)
        }
        
    }else{
        return 0
    }
}

function favoriteBook(id) {
    const bookDataDetail = getData().filter(a => a.id == id);
    const  favcheck = bookDataDetail[0].isFavorite;
    if (favcheck == true){
        alert('The Book Has Become a Favorite')
    } else {
        let confirmation = confirm("Make It a Favorite?")
        if (confirmation == true) {
            const bookDataDetail = getData().filter(a => a.id == id);
            const readed = bookDataDetail[0].isCompleted;
            const favorite = bookDataDetail[0].isFavorite;
            if (readed == true ) {
                if (favorite == false) {
                    const newBook = {
                        id: bookDataDetail[0].id,
                        title: bookDataDetail[0].title,
                        author: bookDataDetail[0].author,
                        year: bookDataDetail[0].year,
                        desc: bookDataDetail[0].desc,
                        isCompleted: true,
                        isFavorite: true
                    }
            
                    const bookData = getData().filter(a => a.id != id);
                    localStorage.setItem(localStorageKey,JSON.stringify(bookData))
                    
                    insertData(newBook)
                }
                else {
                    const newBook = {
                        id: bookDataDetail[0].id,
                        title: bookDataDetail[0].title,
                        author: bookDataDetail[0].author,
                        year: bookDataDetail[0].year,
                        desc: bookDataDetail[0].desc,
                        isCompleted: true,
                        isFavorite: false
                    }
            
                    const bookData = getData().filter(a => a.id != id);
                    localStorage.setItem(localStorageKey,JSON.stringify(bookData))
            
                    insertData(newBook)
                }
            }
            else {
                if (favorite == false) {
                    const newBook = {
                        id: bookDataDetail[0].id,
                        title: bookDataDetail[0].title,
                        author: bookDataDetail[0].author,
                        year: bookDataDetail[0].year,
                        desc: bookDataDetail[0].desc,
                        isCompleted: false,
                        isFavorite: true
                    }
            
                    const bookData = getData().filter(a => a.id != id);
                    localStorage.setItem(localStorageKey,JSON.stringify(bookData))
            
                    insertData(newBook)
                }
                else {
                    const newBook = {
                        id: bookDataDetail[0].id,
                        title: bookDataDetail[0].title,
                        author: bookDataDetail[0].author,
                        year: bookDataDetail[0].year,
                        desc: bookDataDetail[0].desc,
                        isCompleted: false,
                        isFavorite: false
                    }
            
                    const bookData = getData().filter(a => a.id != id);
                    localStorage.setItem(localStorageKey,JSON.stringify(bookData))
            
                    insertData(newBook)
                }
            }
        }else{
            return 0
        }
    }
    
}

function deleteFavoriteBook(id) {
    let confirmation = confirm("Remove from favorite?")
    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const readed = bookDataDetail[0].isCompleted;
        const favorite = bookDataDetail[0].isFavorite;
        if (readed == true ) {
            if (favorite == false) {
                const newBook = {
                    id: bookDataDetail[0].id,
                    title: bookDataDetail[0].title,
                    author: bookDataDetail[0].author,
                    year: bookDataDetail[0].year,
                    desc: bookDataDetail[0].desc,
                    isCompleted: true,
                    isFavorite: true
                }
        
                const bookData = getData().filter(a => a.id != id);
                localStorage.setItem(localStorageKey,JSON.stringify(bookData))
                
                insertData(newBook)
            }
            else {
                const newBook = {
                    id: bookDataDetail[0].id,
                    title: bookDataDetail[0].title,
                    author: bookDataDetail[0].author,
                    year: bookDataDetail[0].year,
                    desc: bookDataDetail[0].desc,
                    isCompleted: true,
                    isFavorite: false
                }
        
                const bookData = getData().filter(a => a.id != id);
                localStorage.setItem(localStorageKey,JSON.stringify(bookData))
        
                insertData(newBook)
            }
        }
        else {
            if (favorite == false) {
                const newBook = {
                    id: bookDataDetail[0].id,
                    title: bookDataDetail[0].title,
                    author: bookDataDetail[0].author,
                    year: bookDataDetail[0].year,
                    desc: bookDataDetail[0].desc,
                    isCompleted: false,
                    isFavorite: true
                }
        
                const bookData = getData().filter(a => a.id != id);
                localStorage.setItem(localStorageKey,JSON.stringify(bookData))
        
                insertData(newBook)
            }
            else {
                const newBook = {
                    id: bookDataDetail[0].id,
                    title: bookDataDetail[0].title,
                    author: bookDataDetail[0].author,
                    year: bookDataDetail[0].year,
                    desc: bookDataDetail[0].desc,
                    isCompleted: false,
                    isFavorite: false
                }
        
                const bookData = getData().filter(a => a.id != id);
                localStorage.setItem(localStorageKey,JSON.stringify(bookData))
        
                insertData(newBook)
            }
        }
    }else{
        return 0
    }
}

function unreadedBook(id) {
    let confirmation = confirm("Pindahkan ke belum selesai dibaca?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const favorite = bookDataDetail[0].isFavorite;
        if (favorite == true){
            const newBook = {
                id: bookDataDetail[0].id,
                title: bookDataDetail[0].title,
                author: bookDataDetail[0].author,
                year: bookDataDetail[0].year,
                isCompleted: false,
                isFavorite: true
            }
    
            const bookData = getData().filter(a => a.id != id);
            localStorage.setItem(localStorageKey,JSON.stringify(bookData))
    
            insertData(newBook)
        }
        else {
            const newBook = {
                id: bookDataDetail[0].id,
                title: bookDataDetail[0].title,
                author: bookDataDetail[0].author,
                year: bookDataDetail[0].year,
                isCompleted: false,
                isFavorite: false
            }
    
            const bookData = getData().filter(a => a.id != id);
            localStorage.setItem(localStorageKey,JSON.stringify(bookData))
    
            insertData(newBook)
        }
    }else{
        return 0
    }
}

function editBook(id) {
    const bookDataDetail = getData().filter(a => a.id == id);
    title.value = bookDataDetail[0].title
    author.value = bookDataDetail[0].author
    year.value = bookDataDetail[0].year
    desc.value = bookDataDetail[0].desc
    bookDataDetail[0].isCompleted ? readed.checked = true:readed.checked = false

    btnSubmit.innerHTML = "Edit Book"
    btnSubmit.value = bookDataDetail[0].id
}

function deleteBook(id) {
    let confirmation = confirm("Sure you'll delete it?")

    if (confirmation == true) {
        const bookDataDetail = getData().filter(a => a.id == id);
        const bookData = getData().filter(a => a.id != id);
        localStorage.setItem(localStorageKey,JSON.stringify(bookData))
        showData(getData())
        alert(`The book titled ${bookDataDetail[0].title} has been deleted.`)
    }else{
        return 0
    }
}

function showSearchResult(books) {
    const searchResult = document.querySelector("#searchResult")

    searchResult.innerHTML = ''

    books.forEach(book => {
        let el = `
        <article class="book_item">
            <h3>${book.title}</h3>
            <p>Author : ${book.author}</p>
            <p>Year : ${book.year}</p>
            <p class="desc">${book.desc}</p>
            <p>Status : ${book.isCompleted ? 'Complete Read' : 'Not Finished Reading'}</p>
            <p>Kategory : ${book.isFavorite ? 'Favorite' : 'Not Favorite'}</p>
        </article>
        `

        searchResult.innerHTML += el
    });
}