/* eslint-disable */


const loginForm = document.querySelector('.login');
const signupForm = document.querySelector('.signup');
const search = document.querySelector('#search');
const no_stocks_btn = document.querySelector('.no_stocks');



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



