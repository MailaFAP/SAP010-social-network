export default () => {
    const perfil = document.createElement('div');
    const templatePerfil = `
    <h1> Perfil </h1>
    `;

    perfil.innerHTML = templatePerfil;

    return perfil;
}