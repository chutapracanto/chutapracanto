// keystatic.config.js
const { config, fields, collection } = keystatic;

export default config({
  storage: {
    kind: 'github',
    repo: 'chutapracanto/chutapracanto',
  },
  collections: {
    noticias: collection({
      label: 'Notícias',
      slugField: 'title',
      path: 'content/noticias/*',
      format: { data: 'frontmatter' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        tag: fields.text({ label: 'Tag / Categoria', defaultValue: 'SL BENFICA' }),
        descricao: fields.text({ label: 'Descrição Curta', multiline: true }),
        imagem: fields.image({
          label: 'Imagem de Capa',
          directory: 'images/uploads',
          publicPath: '/images/uploads',
        }),
        date: fields.datetime({ label: 'Data de Publicação' }),
        body: fields.document({
          label: 'Conteúdo da Notícia',
          formatting: true,
          dividers: true,
          links: true,
          images: true,
        }),
      },
    }),
  },
});
