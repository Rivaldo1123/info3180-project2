/* Add your Application JavaScript */

const register = ('register', {
    name: 'register',
    template: `
    <div>
        <h1 class="page-header"> 
            Add New User
        </h1>
        <form @submit.prevent='register' id = 'register' method = 'POST' enctype="multipart/form-data">
            <div>
                <div class="col-12 form-group">
                    <label for = 'name'> Name </label>
                    <input type="text" name="name" id="name" class="form-control mb-2 mr-sm-2" placeholder="Enter Name here">
                </div>
                <div class="col-12 form-group">
                    <label for = 'email'> Email </label>
                    <input type="text" name="email" id="email" class="form-control mb-2 mr-sm-2" placeholder="Enter Email here">
                </div>
                <div class="col-12 form-group">
                    <label for = 'location'> Location </label>
                    <input type="text" name="location" id="location" class="form-control mb-2 mr-sm-2" placeholder="Enter Location here">
                </div>
                <div class="col-12 form-group">
                    <label for = 'biography'> Biography </label>
                    <textarea type="text" name="biography" id="biography" class="form-control mb-2 mr-sm-2" style='min-height: 10rem; height:10rem;' placeholder="Enter Biography here"></textarea>
                </div>
                <div class="col-12 form-group">
                    <label for = 'username'> Username </label>
                    <input type="text" name="username" id="username" class="form-control mb-2 mr-sm-2" placeholder="Enter Username here">
                </div>
                <div class="col-12 form-group">
                    <label for = 'password'> Password </label>
                    <input type="password" name="password" id="password" class="form-control mb-2 mr-sm-2">
                </div>
                <div class="form-group">
                    <div class="col-sm-6">
                        <label for = 'photo'> Select a photo: </label> <br>
                        <input type='file' name = 'photo'> <br>
                    </div>
                </div>
                <div class="col-12">
                    <button class='btn bg-primary' type='submit'> Submit </button>
                </div>
            </div>
        </form>
    </div>
    `,
    data() {
        return {
            message: [],
            error: []
        };
    },
    methods: {
        register: function() {
            let self = this;
            let register = document.getElementById('register');
            let form_data = new FormData(register);

            fetch('/api/register', {
                    method: 'POST',
                    body: form_data,
                    headers: {
                        'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    // display a success message
                    console.log(jsonResponse);
                    self.message = jsonResponse.message;
                    self.error = jsonResponse.error;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
});

const login = ('login', {
    name: 'login',
    template: `
        <div class="login-form center-block">
            <h2>Please Log in</h2>
            <form @submit.prevent='login' id = 'login' method = 'POST' enctype="multipart/form-data">
            <div class="col-12 form-group">
                <label for = 'username'> Username </label>
                <input type="text" name="username" id="username" class="form-control mb-2 mr-sm-2" placeholder="Enter Username here">
            </div>
            <div class="col-12 form-group">
                <label for = 'password'> Password </label>
                <input type="password" name="password" id="password" class="form-control mb-2 mr-sm-2">
            </div>
            <button type="submit" name="submit" class="btn btn-primary btn-block">Log in</button>
            </form>
        </div>    
    `,
    methods: {
        login: function() {
            let login = document.getElementById('login');
            let form_data = new FormData(login);

            fetch('/api/auth/login', {
                    method: 'POST',
                    body: form_data,
                    headers: {
                        'X-CSRFToken': token
                    },
                    credentials: 'same-origin'
                })
                .then(function(response) {
                    return response.json();
                })
                .then(function(jsonResponse) {
                    // display a success message
                    console.log(jsonResponse);
                    self.message = jsonResponse.message;
                    self.error = jsonResponse.error;
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    }
});

// Instantiate our main Vue Instance
const app = Vue.createApp({
    data() {
        return {

        }
    },
    components: {
        'register': register,
        'login': login
    }
});

app.component('app-header', {
    name: 'AppHeader',
    template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <a class="navbar-brand" href="#">Lab 7</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
    
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/">Home <span class="sr-only">(current)</span></router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/register/">Register </router-link>
          </li>
        </ul>
      </div>
    </nav>
    `
});

app.component('app-footer', {
    name: 'AppFooter',
    template: `
    <footer>
        <div class="container">
            <p>Copyright &copy; {{ year }} Flask Inc.</p>
        </div>
    </footer>
    `,
    data() {
        return {
            year: (new Date).getFullYear()
        }
    }
});

const Home = {
    name: 'Home',
    template: `
    <div class="jumbotron">
        <h1>Lab 7</h1>
        <p class="lead">In this lab we will demonstrate VueJS working with Forms and Form Validation from Flask-WTF.</p>
    </div>
    `,
    data() {
        return {}
    }
};

const NotFound = {
    name: 'NotFound',
    template: `
    <div>
        <h1>404 - Not Found</h1>
    </div>
    `,
    data() {
        return {}
    }
};

// Define Routes
const routes = [
    { path: "/", component: Home },
    // Put other routes here
    { path: "/register/", component: register },
    { path: "/login/", component: login },
    // This is a catch all route in case none of the above matches
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
];

const router = VueRouter.createRouter({
    history: VueRouter.createWebHistory(),
    routes, // short for `routes: routes`
});

app.use(router);

app.mount('#app');