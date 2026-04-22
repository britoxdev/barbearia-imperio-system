# 💈 Barbershop Scheduling System

Sistema completo de agendamento online para barbearia, permitindo que clientes escolham serviços, profissionais e horários disponíveis de forma prática e organizada.

---

## 🚀 Funcionalidades

- 📅 Agendamento de horários
- 👨‍🔧 Seleção de profissionais (Pedro, Vitor e Rony)
- ✂️ Escolha de serviços com duração específica
- ⏱️ Controle automático de horários disponíveis
- 🚫 Bloqueio de horários já ocupados
- 🎨 Interface moderna com tema dark/light
- 🔗 Integração entre front-end e back-end

---

## 🧠 Lógica do Sistema

O sistema considera:

- Horário de funcionamento:
  - 08:00 às 11:30
  - 14:00 às 18:30

- Cada serviço possui uma duração específica
- Ao agendar, o sistema:
  - Remove automaticamente os horários ocupados
  - Evita conflitos de agenda
  - Distribui os agendamentos entre os profissionais

---

## 🛠️ Tecnologias Utilizadas

### Front-end
- HTML5
- CSS3
- JavaScript

### Back-end
- Node.js
- Express

### Estrutura
- MVC (Model, View, Controller)

---

---

## 📁 Estrutura do Projeto

-📦 projeto
┣ 📂 public
┃ ┣ 📂 css
┃ ┣ 📂 js
┃ ┣ 📂 images
┃ ┗ 📄 index.html
┣ 📂 server
┃ ┣ 📂 controllers
┃ ┣ 📂 models
┃ ┣ 📂 middlewares
┃ ┣ 📂 config
┃ ┣ 📄 app.js
┃ ┗ 📄 server.js
┣ 📄 package.json

---

## ⚙️ Como rodar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/barbershop-scheduling-system.git



