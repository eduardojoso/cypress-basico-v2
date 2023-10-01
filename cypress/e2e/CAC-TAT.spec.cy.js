/// <reference types="cypress" />

describe('Central de Atendimento ao Cliente TAT', () => {
  
  beforeEach(() => {
    cy.visit('./src/index.html');
  });
  
  it('Verifica o título da aplicação', () => {
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT');
  });

  it('Preenche os campos obrigatórios e envia o formulário', () => {
    entreOsDadosNoSite(
      '#firstName',
      'Eduardo'
    );
    entreOsDadosNoSite(
      '#lastName',
      'Ferrero'
    );
    entreOsDadosNoSite(
      '#email',
      'edu@rdo.com'
    );
    entreOsDadosNoSite(
      '#open-text-area',
      'Me paga uma cerveja!',
      0
    );
    cy.contains('button', 'Enviar').click();
    cy.get('.success').should('be.visible');
  });

  it('Exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', () => {
    entreOsDadosNoSite(
      '#firstName',
      'Eduardo'
    );
    entreOsDadosNoSite(
      '#lastName',
      'Ferrero'
    );
    entreOsDadosNoSite(
      '#email',
      'eduerdo,com'
    );
    entreOsDadosNoSite(
      '#open-text-area',
      'Me paga uma cerveja!',
      0
    );
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  });

  it('Exibe mensagem de erro quando o telefone recebe caracteres não numéricos', () => {
    cy.get('#phone')
      .type('abc')
      .should('have.value', '');
  });

  it('Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio', () => {
    entreOsDadosNoSite(
      '#firstName',
      'Eduardo'
    );
    entreOsDadosNoSite(
      '#lastName',
      'Ferrero'
    );
    entreOsDadosNoSite(
      '#email',
      'edu@rdo.com'
    );
    cy.get('#phone-checkbox').check();
    entreOsDadosNoSite(
      '#open-text-area',
      'Me paga uma cerveja!',
      0
    );
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  });

  it('Preenche e limpa os campos nome, sobrenome, email e telefone', () => {
    validaCampoAntesEDepoisDoClear(
      '#firstName',
      'Eduardo'
    );
    validaCampoAntesEDepoisDoClear(
      '#lastName',
      'Ferrero'
    );
    validaCampoAntesEDepoisDoClear(
      '#email',
      'edu@rdo.com'
    );
    validaCampoAntesEDepoisDoClear(
      '#phone',
      '123456789'
    );
    validaCampoAntesEDepoisDoClear(
      '#open-text-area',
      'Me paga uma cerveja!',
      0
    );
  });

  it('Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
    cy.contains('button', 'Enviar').click();
    cy.get('.error').should('be.visible');
  });

  it('Envia um formulário com sucesso usando comando customizado', () => {
    cy.fillMandatoryFieldsAndSubmit(
      'Eduardo',
      'Ferrero',
      'edu@rdo.com',
      'Me paga uma cerveja!',
      0
    );
    cy.get('.success').should('be.visible');
  });

  it('Seleciona um produto YouTube por seu texto', () => {
    cy.get('#product')
      .select('YouTube')
      .should('have.value', 'youtube');
  });

  it('Seleciona um produto Mentoria por seu valor', () => {
    cy.get('#product')
      .select('mentoria')
      .should('have.value', 'mentoria');
  });

  it('Seleciona um produto Blog por seu índice', () => {
    cy.get('#product')
      .select(1)
      .should('have.value', 'blog');
  });

  it('Marca o tipo de atendimento Feedback', () =>{
    cy.get('[value="feedback"]')
      .check()
      .should('have.value', 'feedback');
  });

  it('Marca cada tipo de atendimento', () => {
    cy.get('input[type="radio"]')
      .should('have.length', 3)
      .each(function($radio) {
        cy.wrap($radio)
          .check()
          .should('be.checked');
      });
  });

  it('Marca ambos os checkboxes depois, desmarca o último', () => {
    cy.get('input[type="checkbox"]')
      .should('have.length', 2)
      .check()
      .should('be.checked')
      .last()
      .uncheck()
      .should('not.be.checked');
  });

  it('Seleciona um arquivo da pasta features', () => {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json')
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });

  it('Seleciona um arquivo simulando drag and drop', () => {
    cy.get('#file-upload')
      .should('not.have.value')
      .selectFile('./cypress/fixtures/example.json', { action: 'drag-drop' })
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });

  it('Seleciona um arquivo utilizando uma fixture para qual foi dada um alias', () => {
    cy.fixture('example.json').as('sampleFile');
    cy.get('#file-upload')
      .selectFile('@sampleFile')
      .should(function($input){
        expect($input[0].files[0].name).to.equal('example.json');
      });
  });

  it('Verifica que a política de privacidade abre em outra aba sem a ncessidade de um click', () => {
    cy.get('a[href="privacy.html"]')
      .should('have.attr', 'target', '_blank');
  });

  it('Acessa a página da política de privacidade removendo o target e então clicando no link', () => {
    cy.get('a[href="privacy.html"]')
      .invoke('removeAttr', 'target')
      .click()
      .title()
      .should('be.equal', 'Central de Atendimento ao Cliente TAT - Política de privacidade');
  });

  function entreOsDadosNoSite(selector, valor, ms = 10) {
    cy.get(selector)
      .type(valor, { delay: ms });
  }

  function validaCampoAntesEDepoisDoClear(selector, valor, ms = 10) {
    cy.get(selector)
      .type(valor, { delay: ms })
      .should('have.value', valor)
      .clear()
      .should('have.value', '');
  }
})