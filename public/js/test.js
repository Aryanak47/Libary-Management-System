const bookForm = document.querySelector('.bookForm');


if(bookForm){
    bookForm.addEventListener('submit', async e => {
        e.preventDefault();
        const btn = document.getElementById('uploadBtn');
        btn.textContent="uploading..."
        const name = document.getElementById('inputBookName').value;
        const isbn = document.getElementById('inputISBN').value
        const stocks = document.getElementById('inputStock').value
        const summary = document.getElementById('Summary').value
        const genre = document.getElementById('inputGenre').value
        const check = document.querySelector(`input[type="checkbox"]:checked`)
        const newBook = check !==null ? true:false;
        const photo = document.querySelector('#validatedCustomFile').files[0];
        const badges = document.getElementsByClassName('badge')
        const authors = []
        for (const badge of badges) {
            authors.push(badge.textContent)
        }
        try {
            const result = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/api/books',
                data: {
                    name,
                    ISBN:isbn,
                    stocks,
                    summary,
                    genre,
                    new:newBook,
                    photo:'myphoto',
                    authors,
                }
            });
            if(result.data.status ==="success"){  
           
            } 
            btn.textContent = 'upload'           
        }catch (err) {
            btn.textContent = 'upload'
            console.log(err);
        }
        
      
       
    })
}