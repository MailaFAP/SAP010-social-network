export default () => {
    const home = document.createElement('div');
    const templateHome = `
    <form action="">
      <fieldset>
        <div>
          <label for="">Nome do usuário</label>
          <input type="text" class="usuárioLogin" id="usuárioLogin">
        </div>
        <div>
          <label for="senha">Senha</label>
          <input type="password" class="senhaLogin" id="senhaLogin">
        </div>
        <a href="/#entrar">Entrar</a>
        <a href="/#esqueceuSenha">Esqueceu a senha?</a>
        <a href="/#loginGoogle">Faça login com sua conta do Google</a>
        <a href="/#cadastro">Não tem login? Crie sua conta</a>
      </fieldset>
    </form>`;
    
    
    home.innerHTML = templateHome;

    return home;
}