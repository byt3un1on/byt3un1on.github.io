# language: pt
Funcionalidade: Frescura e integridade do catálogo
  Para que a vitrine nunca publique um retrato incompleto da organização
  Como autor da Byte Union
  Quero que o catálogo seja obtido antes da publicação e que falha na obtenção impeça a troca

  @processo
  Cenário: RF-14 — falha na obtenção não publica catálogo incompleto
    Dado que a versão atual do sítio está no ar
    Quando a publicação é executada e o catálogo da organização não pode ser obtido integralmente
    Então a publicação é abortada e informa a falha
    E a versão anterior do sítio permanece no ar, intacta
    Mas nenhuma versão com catálogo parcial ou vazio é publicada


  @processo
  Cenário: RF-16 — publicação abortada abre questão no repositório
    Dado que uma publicação foi abortada
    Quando o aborto é registrado
    Então existe uma questão aberta no repositório do sítio com o motivo da falha
    Mas nenhuma questão duplicada é aberta enquanto a anterior seguir em aberto


  @processo
  Cenário: RF-16 — publicação bem-sucedida encerra a questão aberta
    Dado que existe uma questão aberta por uma publicação abortada
    Quando uma publicação conclui com sucesso
    Então essa questão é encerrada automaticamente
    Mas nenhuma outra questão do repositório é alterada


  @navegador
  Cenário: RNF-08 — o visitante não espera pela rede
    Dado que eu abro qualquer página pública do sítio
    Quando a página termina de carregar
    Então todos os dados dos projetos já estão presentes
    Mas o meu navegador não realizou nenhuma requisição à API do GitHub
