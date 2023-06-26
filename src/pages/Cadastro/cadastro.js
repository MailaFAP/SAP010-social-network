export default () => {
    const conteiner = document.createElement('div');
    const template = `
    <form action="">
        <fieldset>
            <legend>Cadastre-se</legend>
            <div>
                <label for="nome">Nome do usuário</label>
                <input type="text" class="usuárioCadastro" id="usuárioCadastro">                
            </div>
            <div>
                <label for="email">Email</label>
                <input type="email" class="emailCadastro" id="emailCadastro">                
            </div>
            <div>
                <label for="">Senha</label>
                <input type="number" class="senhaCadastro" id="senhaCadastro">                
            </div>
            <a href="/#concluirCadastro">Concluir</a>
            <a href="/#voltarCadastro">Voltar</a>
            <a href="/#googleCadastro">Login com Google</button>
            <p></p>
        </fieldset>
    </form>`;
    
    conteiner.innerHTML = template;

    return conteiner;
}