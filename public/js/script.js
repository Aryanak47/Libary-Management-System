/* eslint-disable */

const loginForm = document.querySelector('.login');

if(loginForm){
    loginForm.addEventListener('submit',async e => {
        e.preventDefault();
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
              console.log(result.data);
              if(result.data.status ==="sucess"){
                setTimeout(() => {
                  window.location.assign('/')
                },1500)
                

              }else{
                alert('log in failed')
              }

            
        } catch (error) {
            alert(error.message)
            
        }
        
    })
}


