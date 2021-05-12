/* eslint-disable */




const loginForm = document.querySelector('.login');
const signupForm = document.querySelector('.signup');
const search = document.querySelector('#search');
const no_stocks_btn = document.querySelector('.no_stocks');
const reserveBtn = document.querySelector('.reserve');
const approveBtns =  document.getElementsByClassName('approve');
const rejectBtns = document.getElementsByClassName('reject'); 



// alert
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is 'success' or 'error'
const showAlert = (type, msg, time = 7) => {
  hideAlert();
  const markup = `<div class="alert alert--${type}">${msg}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, time * 1000);
};
if(loginForm){
    loginForm.addEventListener('submit',async e => {
        e.preventDefault();
        const btn = document.getElementById('login__btn');
        btn.textContent = 'logging in....'
        
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        try {
            const result = await axios({
                method: 'post',
                url: 'http://127.0.0.1:8000/api/users/login',
                data: {
                  email: email.value,
                  password: password.value
                }
              });
              if(result.data.status ==="sucess"){ 
                showAlert('success', 'Logged in successfully!');  
                setTimeout(() => {
                  window.location.assign('/')
                },1500)
              }            
        } catch (err) {
            btn.textContent = 'login'
            if(err.response.data.error.statusCode === 500){
              showAlert('error','Try again later');
              return
            }
            showAlert('error', err.response.data.message); 
        }
        
    })
}
if(search){
  document.querySelector('.search__icon').addEventListener('click', e =>{
    e.preventDefault()
    window.location.assign(`/search/?term=${search.value}`)
  })
}

if(signupForm){
  signupForm.addEventListener('submit',async e => {
    e.preventDefault();
    const btn = document.getElementById('signup__btn');
    btn.textContent = 'Signing in....'
    const email = document.getElementById('signup__email');
    const password = document.getElementById('signup__password');
    const name = document.getElementById('signup__name');
    try {
        const result = await axios({
            method: 'post',
            url: 'http://127.0.0.1:8000/api/users/signup',
            data: {
              email: email.value,
              password: password.value,
              name: name.value
            }
          });
          if(result.data.status ==="sucess"){  
            showAlert('success', 'signed up  successfully!'); 
            setTimeout(() => {
              window.location.assign('/')
            },1500)
          }            
    } catch (err) {
        btn.textContent = 'signup'
        if(err.response.data.error.statusCode === 500){
          showAlert('error','Try again later');
          return
        }
        showAlert('error', err.response.data.message); 
      }
  })

}

if(no_stocks_btn){
  no_stocks_btn.addEventListener('click',e => {
    const { bookName } = e.target.dataset;
    showAlert('info',`There is no any '${bookName}' book on stock`,3)
  })
}

if(reserveBtn){
  reserveBtn.addEventListener('click',async e => {
    const {book} = e.target.dataset
    const {user} = e.target.dataset
    reserveBtn.textContent = 'Processing....'

    try {
        const result = await axios({
          method: 'post',
          url: `http://127.0.0.1:8000/api/reserve`,
          data: {
            user,
            book,
          }
        });
        if(result.data.status ==="success"){ 
          showAlert('success', 'Your requested book is on review!');  
        }  
        reserveBtn.textContent = 'Reserve'          
    } catch (err) {
      reserveBtn.textContent = 'Reserve'
      if(err.response.data.error.statusCode === 500){
        showAlert('error','Try again later');
        return
      }
      showAlert('error', err.response.data.message); 
    }
  })
}

if(rejectBtns){
  for (const reject of rejectBtns) {
    reject.addEventListener('click', async function(e){
      const { reserveId } = e.target.dataset
      const row = reject.parentElement.parentElement
      try{
        reject.textContent = 'Processing...'
        const result = await axios({
          method: 'delete',
          url: `http://127.0.0.1:8000/api/reserve/${reserveId}`,
        });
        if(result.data.status ==="success"){ 
          showAlert('success', 'Rejected !');  
          row.parentElement.removeChild(row)
        }  
        reject.textContent = 'Reject'          
      } catch (err) {
        reject.textContent = 'Reject'
        if(err.response.data.error.statusCode === 500){
          showAlert('error','Try again later');
          return
        }
        showAlert('error', err.response.data.message); 
      }  

    })
  }

 
}
if(approveBtns){
  for (const approve of approveBtns) {
    approve.addEventListener('click', async function(e){
      const { reserveId } = e.target.dataset
      const row = approve.parentElement.parentElement
      try{
        approve.textContent = 'Processing...'
        const result = await axios({
          method: 'patch',
          url: `http://127.0.0.1:8000/api/reserve/approval/${reserveId}`,
          data: {
            approve:true,
            expireDate:new Date(
              Date.now() + 5 * 24 * 60 * 60 * 1000
            ),
            issueDate:Date.now()
          }
        });
        if(result.data.status ==="success"){ 
          showAlert('success', 'Approved !');  
          row.parentElement.removeChild(row)
          
        }  
        approve.textContent = 'Approve'          
      } catch (err) {
        approve.textContent = 'Approve'
        if(err.response.data.error.statusCode === 500){
          showAlert('error','Try again later');
          return
        }
        showAlert('error', err.response.data.message); 
      }  
    }
  )}
}



