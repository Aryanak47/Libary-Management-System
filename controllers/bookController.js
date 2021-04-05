const Book = require('../model/bookModel')

const handleErrors = (res,sts,message) =>{
    res.status(sts).json({
        status: 'fail',
        message: message

    })
}

exports.createBook = async(req,res) => {
    try {
        console.log('called me');
        const doc = await Book.create(req.body);
        res.status(200).json({
          message: 'sucess',
          data: {
            data: doc
          }
        });
    } catch (error) {
        handleErrors(res,400,`Failed to create ! ${error.message}`)
        
        
    }
   
}

exports.getBook = async(req,res) => {
    try {
        const {id} = req.params;
        const book = await Book.findById(id)
        res.status(200).json({
            status:'sucess',
            data:{
                book
            }
        })
    } catch (er) {
        handleErrors(res,404,'There is no book with this id')
       
    }
   
    
}


exports.getBooks = async(req,res) => {
    try {
        const books = await Book.find()
        res.status(200).json({
            status:'success',
            data:{
                books
            }
        })
        
    } catch (error) {
        handleErrors(res,404,error.message);
        
    }
    
}
exports.updateBook = async(req,res) => {
    try {
        console.log("asas",req.body);
        const doc = await Book.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'OK',
            data: {
            data: doc
            }
        });
        
    } catch (error) {
        handleErrors(res, 404, error.message);
        
    }



}
exports.deleteBook = async(req,res) => {
    try {
        console.log("asas",req.body);
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: 'OK',
            message: 'sucessfully deleted'
        });
        
    } catch (error) {
        handleErrors(res, 404, error.message);
        
    }

}