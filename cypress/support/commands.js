Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(nome, sobrenome, email, textArea, ms = 10) {
    cy.get('#firstName')
      .type(nome);
    cy.get('#lastName')
      .type(sobrenome);
    cy.get('#email')
      .type(email);
    cy.get('#open-text-area')
      .type(textArea, { delay: ms });
    cy.contains('button', 'Enviar').click();
});