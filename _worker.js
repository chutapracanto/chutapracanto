export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Por enquanto, apenas mantém o site a funcionar normalmente.
    // As rotas /api/admin serão adicionadas no próximo passo.

    return env.ASSETS.fetch(request);
  }
};
