import cadastro from "./pages/Cadastro/cadastro";
import home from "./pages/Home/home";
import perfil from "./pages/Perfil/perfil";
import feed from "./pages/Feed/feed";



const main = document.querySelector("#root");

const init = () => {
    window.addEventListener("hashchange", () => {
        main.innerHTML = "";
        switch (window.location.hash) {
            case "#cadastro":
                main.appendChild(cadastro());
                break;
            case "#voltarCadastro":
                main.appendChild(home());
                break;
            case "#entrar":
                main.appendChild(perfil());
                break;
            case "#concluirCadastro":
                main.appendChild(home());
                break;

        }
    });
}


window.addEventListener("load", () => {
    main.appendChild(home());
    init();
})