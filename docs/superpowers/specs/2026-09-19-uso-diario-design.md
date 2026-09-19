# Antes do Pix — Uso diário: design

## Objetivo

Tornar o Antes do Pix mais útil em situações recorrentes de dúvida antes de um pagamento, reduzindo a distância entre o alerta e a próxima decisão segura. A melhoria deve manter o app local, offline, sem histórico automático e sem acesso a conta bancária.

## Resultado esperado

Depois de analisar uma mensagem, link, chave Pix ou QR Code, a pessoa deve saber o que fazer em seguida sem interpretar sozinha o resultado. Ela também deve conseguir iniciar uma nova conferência rapidamente, corrigir uma entrada manual e receber uma orientação compreensível quando o QR Code não puder ser aproveitado.

## Escopo aprovado

### 1. Próximos passos no resultado

Adicionar um card acessível “O que fazer agora” na tela de resultado. O conteúdo será determinado pelo nível da análise:

- `possivelGolpe`: não pagar, confirmar por canal oficial e procurar o banco se já houve transferência;
- `atencao`: pausar, conferir beneficiário/valor no app do banco e não informar códigos ou senhas;
- `baixoRisco`: conferir o beneficiário no app do banco antes de concluir.

O texto será orientação, não confirmação de golpe ou garantia de segurança. O card não exibirá a mensagem original.

### 2. Nova conferência direta

Adicionar uma ação “Conferir outro conteúdo” na tela de resultado. Ela deve limpar somente a análise em memória e retornar à tela inicial, mantendo o comportamento atual de não persistir dados.

### 3. Entrada manual mais confortável

Quando houver texto no campo manual, exibir uma ação acessível “Limpar campo”. A ação deve apagar o texto, remover erro visível e manter o contador em `0/5000`. Quando o campo estiver vazio, essa ação não deve existir.

### 4. QR Code inválido ou vazio

O scanner deve ignorar leituras vazias e, quando a leitura não produzir uma entrada útil para conferência, exibir uma orientação de erro no próprio fluxo, sem navegar para uma revisão incompleta. A pessoa deve poder fechar o scanner e tentar novamente.

## Fluxos e limites

1. Entrada manual continua limitada a 5.000 caracteres.
2. A análise continua determinística e sem rede.
3. Nenhum texto bruto será gravado em arquivo, log, histórico ou armazenamento persistente.
4. O compartilhamento continuará usando apenas o resumo já existente.
5. Nenhuma ação inicia pagamento, acessa banco ou valida titularidade.
6. Textos novos devem usar `allowFontScaling`, papéis acessíveis e não depender de cor isoladamente.
7. Animações existentes e novas devem respeitar `useReducedMotion`.

## Arquitetura

As mensagens de próximos passos ficarão em uma função pura próxima ao domínio de análise, recebendo apenas o nível de risco e devolvendo uma estrutura de apresentação estável. A tela de resultado renderizará essa estrutura e controlará somente navegação e limpeza do estado.

O campo manual continuará controlando seu próprio texto localmente. O botão de limpeza será uma ação visual da tela, sem criar estado global. O scanner manterá o estado de leitura única, mas só avançará para a confirmação quando `analyzeInput` produzir uma entrada aproveitável; falhas permanecerão no fluxo da câmera.

## Tratamento de erros

- Texto manual vazio: manter a mensagem atual e não navegar.
- Leitura vazia: ignorar o evento para evitar falso avanço.
- QR Code não reconhecido: informar que o código não parece ser um Pix conferível e oferecer nova tentativa/fechamento.
- Ausência de análise nas telas protegidas: manter o redirecionamento existente para o início.

## Testes de aceitação

- A função de próximos passos retorna textos diferentes e apropriados para os três níveis de risco.
- A tela de resultado exibe o card correspondente e retorna ao início ao tocar em “Conferir outro conteúdo”.
- O botão “Limpar campo” só aparece com texto, zera o campo e remove o erro.
- O scanner não cria análise para leitura vazia ou inválida e mostra orientação ao usuário.
- A suíte completa, typecheck e `git diff --check` passam.

## Fora do escopo

- Histórico de análises, favoritos ou sincronização.
- Login, backend, notificações, contatos, localização ou integração com banco.
- OCR, consulta externa de CNPJ/telefone ou promessa de identificar fraude.
- Redesign completo da identidade visual.
