# Segurança — Chuta Pra Canto

## Admin

- O painel usa uma palavra-passe guardada como secret no Cloudflare e uma sessão assinada em cookie HttpOnly, Secure e SameSite=Strict, com validade de oito horas.
- O token do GitHub é utilizado pelo Worker e não deve ser exposto ao browser nem ao repositório.
- A força da palavra-passe não pode ser avaliada a partir do código, porque o valor é um secret. Deve ser longa, única e guardada no gestor de secrets.
- Não existe atualmente rate limiting na rota de login nem MFA. Não foi acrescentado um contador em memória: no Workers, estado local por isolate/localidade não oferece bloqueio global fiável. Deve ser configurado um controlo de tráfego compatível com Pages/Workers antes de abrir o Admin a mais utilizadores ou expô-lo num domínio próprio.
- Os uploads novos são limitados a JPEG, PNG e WebP, com verificação da assinatura binária e máximo de 5 MiB. SVG e HTML não são aceites para novos uploads.

## Resposta a vulnerabilidades

Não publiques tokens, palavras-passe ou dados privados em issues. Para reportar um problema, contacta o projeto pelos canais públicos apresentados em https://chutapracanto.com/contacto.
