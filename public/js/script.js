/* eslint-disable */


const loginForm = document.querySelector('.login');
const signupForm = document.querySelector('.signup');
const search = document.querySelector('#search');
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
                setTimeout(() => {
                  window.location.assign('/')
                },1500)
              }            
        } catch (error) {
            btn.textContent = 'login'
            alert('log in failed')
            
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
            setTimeout(() => {
              window.location.assign('/')
            },1500)
          }            
    } catch (error) {
        btn.textContent = 'signup'
        alert('signup failed')
    }
  })

}


