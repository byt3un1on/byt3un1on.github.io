# language: pt
Funcionalidade: Validação da branch de feature
  Para que nenhuma mudança chegue a develop sem prova
  Como quem empurra uma branch de feature
  Quero que a esteira verifique tudo e só então abra a Pull Request

  @esteira
  Cenário: RF-01 — a execução se identifica pelo último commit
    Dado que existe uma branch de feature com um commit cuja descrição é conhecida
    Quando um push é feito nessa branch
    Então a esteira de validação é disparada
    E a execução é identificada pela descrição desse commit
    Mas a execução não é identificada por um nome fixo, igual para toda execução

  @esteira
  Cenário: RF-02 — as sete verificações são sete jobs
    Dado que a esteira de validação foi disparada por push em branch de feature
    Quando eu observo o diagrama da execução
    Então eu vejo um job próprio para cada uma das sete verificações: formatação, análise estática, testes unitários, cobertura, integração, comportamento e auditoria
    Mas eu não vejo nenhuma dessas verificações escondida como passo dentro de um job de outra verificação

  @esteira
  Cenário: RNF-05 — nada é esperado além do que a dependência real exige
    Dado que a esteira de validação foi disparada
    Quando eu observo as dependências declaradas entre os jobs de verificação
    Então formatação, análise estática, testes unitários, cobertura e integração não dependem de nenhum outro job
    E auditoria depende apenas do job de construção, e comportamento depende apenas do job de auditoria
    Mas o sítio é construído uma única vez na execução, e auditado uma única vez

  @esteira
  Cenário: RF-04 — validação aprovada abre a Pull Request com o título previsto
    Dado que todos os jobs de verificação aprovaram na branch "feature/nome-curto"
    Quando o portão de validação é avaliado
    Então é aberta a Pull Request de título "PR - feature/nome-curto -> develop"
    Mas nenhuma outra Pull Request é aberta pela mesma execução

  @esteira
  Cenário: RF-04 — push seguinte não duplica a Pull Request
    Dado que já existe Pull Request aberta da branch "feature/nome-curto" para develop
    Quando um novo push é feito nessa mesma branch e a validação aprova
    Então a Pull Request existente é atualizada com o resultado da nova validação
    Mas nenhuma segunda Pull Request é aberta para a mesma branch

  @esteira
  Cenário: RF-03 — cobertura abaixo do mínimo reprova e diz quanto mediu
    Dado que a mudança na branch de feature deixa a cobertura de linhas abaixo de 90%
    Quando a esteira de validação executa a verificação de cobertura
    Então o job de cobertura reprova
    E o resumo da execução informa a cobertura medida e o mínimo exigido de 90%
    Mas a esteira não abre a Pull Request para develop

  @esteira
  Cenário: RF-16 — formatação pendente reprova e nomeia os arquivos
    Dado que existe na branch um arquivo fora do formato do projeto
    Quando o job de formatação é executado
    Então o job reprova e o resumo nomeia os arquivos fora de formato
    Mas nenhum commit de formatação é empurrado para a branch

  @esteira
  Cenário: RF-05 e RF-13 — uma reprovação interrompe a cadeia inteira
    Dado que todas as verificações aprovaram exceto uma, que reprovou
    Quando o portão de validação é avaliado
    Então o portão reprova e nomeia a verificação que falhou
    E nenhum estágio posterior da esteira é executado
    Mas as verificações aprovadas continuam exibindo seu resultado próprio de aprovação
