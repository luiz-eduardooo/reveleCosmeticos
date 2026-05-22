## Criação de admins

Não há endpoint público para criar admin. Processo manual:

1. Cadastrar usuário normal via `POST /usuarios` (ou pela tela de cadastro do front)
2. No banco: `UPDATE usuarios SET role = 'ADMIN' WHERE email = 'admin@revele.com';`

MVP: aceitável. Pós-MVP: considerar seed via `CommandLineRunner` ou endpoint protegido.